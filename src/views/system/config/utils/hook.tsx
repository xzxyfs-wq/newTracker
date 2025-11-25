import editForm from "../form.vue";
import { message } from "@/utils/message";
import { configApi, dictApi } from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, markRaw, computed } from "vue";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";

// 使用 markRaw 包装组件，避免响应式警告
const editFormComponent = markRaw(editForm);

export function useConfig() {
  const formRef = ref();
  const loading = ref(false);
  const groupDataList = ref<any[]>([]); // 组数据列表（完整数据）
  const currentGroup = ref<any | null>(null); // 当前选中的组（对象）
  const configList = ref<FormItemProps[]>([]); // 当前组的配置项列表
  const configFormRef = ref(); // 配置项表单引用
  const configForm = reactive<Record<string, any>>({}); // 动态表单数据

  // 添加配置项表单数据
  const addForm = reactive<FormItemProps>({
    config_id: undefined,
    config_group_id: undefined,
    config_name: "",
    config_key: "",
    config_value: "",
    input_type: "input",
    is_multiline: false,
    is_multiple: false,
    extend: "",
    description: "",
    status: 1,
    remark: ""
  });

  const addFormRef = ref();

  // 获取所有组列表
  async function getGroupList() {
    try {
      const res = await configApi.getConfigGroupList();
      if (res?.success) {
        // 返回数据格式: { data: [{ config_group_id, config_group_name, ... }] }
        const groupData = Array.isArray(res.data) ? res.data : [];
        groupDataList.value = groupData;
        // 如果没有选中组且有组列表，默认选中第一个
        if (!currentGroup.value && groupData.length > 0) {
          currentGroup.value = groupData[0];
          await loadConfigByGroup(currentGroup.value);
        }
      }
    } catch (error) {
      console.error("获取组列表失败:", error);
      groupDataList.value = [];
    }
  }

  // 根据组加载配置项
  async function loadConfigByGroup(groupData: any) {
    if (!groupData) {
      configList.value = [];
      initConfigForm();
      return;
    }
    loading.value = true;
    try {
      if (!groupData) {
        throw new Error("组数据不存在");
      }
      const { config_group_id } = groupData;

      const res = await configApi.getConfigList({ config_group_id });
      if (res?.success) {
        const extendKeys = [];
        configList.value =
          res.data?.list?.map(i => {
            if (i.input_type === "select") {
              extendKeys.push(i.extend);
            }
            return i;
          }) || [];
        console.log(extendKeys);

        extendKeys.forEach(async key => {
          const res = await dictApi.getDictByType({ dict_type_code: key });
          if (res?.success) {
            configList.value.forEach(item => {
              if (item.input_type === "select" && item.extend === key) {
                item.options = res.data;
              }
            });
          }
        });
        // 初始化动态表单数据
        initConfigForm();
        // 加载配置项选项
        await loadConfigOptions();
      } else {
        throw new Error("获取配置项失败");
      }
    } catch (error) {
      console.error(error);
      configList.value = [];
      initConfigForm();
    } finally {
      loading.value = false;
    }
  }

  // 初始化动态表单数据
  function initConfigForm() {
    const formData: Record<string, any> = {};
    configList.value.forEach((item: any) => {
      // 直接使用接口返回的字段名
      formData[item.config_key] = item.config_value;
    });
    Object.assign(configForm, formData);
  }

  // 加载配置项选项（直接将选项数据存储到配置项对象中）
  async function loadConfigOptions() {
    for (const item of configList.value) {
      const componentType = item.input_type;
      if (componentType === "select") {
        const options = await getConfigOptions(item);
        // 直接将选项数据存储到配置项对象中
        (item as any).options = options;
      }
    }
  }

  // 选择组
  async function selectGroup(groupData: any) {
    currentGroup.value = groupData;
    await loadConfigByGroup(groupData);
    // loadConfigByGroup 内部已经调用了 loadConfigOptions，这里不需要重复调用
  }

  // 保存配置项表单（提交当前所选配置组的表单数据）
  async function saveConfigForm() {
    if (!configFormRef.value) return;
    if (!currentGroup.value) {
      message("请先选择配置组", { type: "warning" });
      return;
    }
    try {
      await configFormRef.value.validate();
      // 构建更新数据：从 configFormRef 的表单数据中获取值
      await configApi.updateConfig({
        update_keys: configForm,
        config_group_id: currentGroup.value?.config_group_id
      });
      message("保存成功", { type: "success" });
    } catch (error) {
      console.error("保存配置失败:", error);
      message("保存配置失败", { type: "error" });
    }
  }

  // 添加配置项
  async function handleAddConfig() {
    if (!addFormRef.value) return;
    try {
      await addFormRef.value.validate();
      if (!addForm.config_group_id) {
        message("请选择所属组", { type: "error" });
        return;
      }
      // 构建 API 参数
      const apiParams = {
        config_group_id: addForm.config_group_id,
        config_key: addForm.config_key,
        config_name: addForm.config_name,
        config_value: addForm.config_value,
        input_type: addForm.input_type,
        is_multiple: addForm.is_multiple || false,
        remark: addForm.description || addForm.remark || "",
        extend: addForm.extend || ""
      };
      await configApi.addConfig(apiParams);
      message("添加配置项成功", { type: "success" });
      // 保存当前组ID，用于刷新配置列表
      const currentGroupId = addForm.config_group_id;
      // 重置表单
      Object.assign(addForm, {
        config_id: undefined,
        config_group_id: undefined,
        config_name: "",
        config_key: "",
        config_value: "",
        input_type: "input",
        is_multiline: false,
        is_multiple: false,
        extend: "",
        description: "",
        status: 1,
        remark: ""
      });
      addFormRef.value.resetFields();
      // 刷新配置列表（如果组ID存在）
      if (currentGroupId) {
        const groupData = groupDataList.value.find(
          (item: any) => item.config_group_id === currentGroupId
        );
        if (groupData) {
          await loadConfigByGroup(groupData);
        }
      }
    } catch (error) {
      console.error("添加配置项失败:", error);
      message("添加配置项失败", { type: "error" });
    }
  }

  // 编辑配置项
  function handleEditConfig(row: FormItemProps) {
    // 直接打开编辑对话框，不填充右侧表单
    openDialog("修改", row);
  }

  // 删除配置项
  async function handleDeleteConfig(row: FormItemProps) {
    try {
      await configApi.deleteConfig({ config_id: row.config_id! });
      message(`您删除了配置标题为${row.config_name}的这条数据`, {
        type: "success"
      });
      await loadConfigByGroup(currentGroup.value);
      await getGroupList();
    } catch (error) {
      console.error("删除配置项失败:", error);
      message("删除配置项失败", { type: "error" });
    }
  }

  // 打开编辑对话框
  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}配置项`,
      props: {
        formInline: Object.assign(
          {
            config_id: undefined,
            config_group_id: currentGroup.value?.config_group_id,
            config_name: "",
            config_key: "",
            config_value: "",
            sort: 0,
            input_type: "input",
            is_multiline: false,
            is_multiple: false,
            extend: "",
            description: "",
            status: 1,
            remark: "",
            options: []
          },
          row
        )
      },
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => {
        return h(editFormComponent, {
          ref: formRef,
          formInline: null,
          groupList: groupDataList.value,
          dictTypeList: dictTypeList.value,
          dictOptions: formDictOptions.value,
          loadingDictOptions: loadingFormDictOptions.value,
          onLoadDictOptions: loadFormDictOptions
        });
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        async function chores() {
          message(`您${title}了配置标题为${curData.config_name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          // 刷新配置列表（组列表不需要刷新，因为组名没有变化）
          if (curData.config_group_id) {
            const groupData = groupDataList.value.find(
              (item: any) => item.config_group_id === curData.config_group_id
            );
            if (groupData) {
              await loadConfigByGroup(groupData);
            }
          }
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (!curData.config_id) {
                // 新增配置项
                if (!curData.config_group_id) {
                  message("请选择所属组", { type: "error" });
                  return;
                }
                const apiParams = {
                  config_group_id: curData.config_group_id,
                  config_key: curData.config_key,
                  config_name: curData.config_name,
                  config_value: curData.config_value,
                  input_type: curData.input_type,
                  is_multiple: curData.is_multiple || false,
                  remark: curData.description || curData.remark || "",
                  extend: curData.extend || ""
                };
                await configApi.addConfig(apiParams);
              } else {
                // 更新配置项
                await configApi.updateConfig(curData);
              }
              chores();
            } catch (error) {
              console.error(`${title}配置项失败:`, error);
              message(`${title}配置项失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  // 字典类型列表
  const dictTypeList = ref<any[]>([]);
  // 编辑表单的字典选项
  const formDictOptions = ref<Array<{ label: string; value: any }>>([]);
  const loadingFormDictOptions = ref(false);

  // 加载编辑表单的字典选项（供 form.vue 使用）
  async function loadFormDictOptions(dictType?: string) {
    if (!dictType) return;
    loadingFormDictOptions.value = true;
    try {
      const res = await dictApi.getDictByType({
        dict_type_code: dictType
      });
      if (res?.success) {
        const data = Array.isArray(res.data) ? res.data : [];
        formDictOptions.value = data.map((item: any) => ({
          label: item.dict_label || item.label,
          value: item.dict_value || item.value
        }));
      } else {
        formDictOptions.value = [];
      }
    } catch (error) {
      console.error(`获取字典数据失败 (${dictType}):`, error);
      formDictOptions.value = [];
    } finally {
      loadingFormDictOptions.value = false;
    }
  }

  // 获取字典类型列表
  async function getDictTypeList() {
    try {
      const res = await dictApi.getDictTypeList({ page_size: 9999 });
      if (res?.success) {
        dictTypeList.value = res.data?.list || [];
      }
    } catch (error) {
      console.error("获取字典类型列表失败:", error);
    }
  }

  // 获取字典数据
  async function getDictData(dictType: string) {
    try {
      const res = await dictApi.getDictByType({ dict_type: dictType });
      if (res?.success) {
        const data = Array.isArray(res.data) ? res.data : [];
        return data.map((item: any) => ({
          label: item.dict_label || item.label,
          value: item.dict_value || item.value
        }));
      }
    } catch (error) {
      console.error(`获取字典数据失败 (${dictType}):`, error);
    }
    return [];
  }

  // 获取配置项的选项列表（用于select类型，只能从字典获取）
  async function getConfigOptions(item: any) {
    // 直接使用接口返回的字段名
    const componentType = item.input_type;
    if (componentType === "select") {
      // select类型只能从字典获取数据
      if (item.dict_type_code) {
        return await getDictData(item.dict_type_code);
      }
    }
    return [];
  }

  // 删除配置组
  async function handleDeleteGroup(groupName: string, event?: Event) {
    if (event) {
      event.stopPropagation(); // 阻止事件冒泡，避免触发选择组
    }
    const groupData = groupDataList.value.find(
      (item: any) => item.config_group_name === groupName
    );
    if (!groupData) {
      message("无法获取配置组ID", { type: "error" });
      return;
    }
    const groupId = groupData.config_group_id;
    const { ElMessageBox } = await import("element-plus");
    try {
      await ElMessageBox.confirm(
        `确定要删除配置组"${groupName}"吗？删除后该组下的所有配置项也将被删除。`,
        "删除配置组",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      try {
        await configApi.deleteConfigGroup({ config_group_id: groupId });
        message("删除配置组成功", { type: "success" });
        // 如果删除的是当前选中的组，清空选中状态
        const groupData = groupDataList.value.find(
          (item: any) => item.config_group_name === groupName
        );
        if (
          currentGroup.value?.config_group_id === groupData?.config_group_id
        ) {
          currentGroup.value = null;
          configList.value = [];
          initConfigForm();
        }
        // 刷新组列表
        await getGroupList();
      } catch (error) {
        console.error("删除配置组失败:", error);
        message("删除配置组失败", { type: "error" });
      }
    } catch (error) {
      // 用户取消操作，不需要处理
    }
  }

  // 新增配置组
  async function handleAddGroup() {
    const { ElMessageBox } = await import("element-plus");
    try {
      const { value } = await ElMessageBox.prompt(
        "请输入配置组名称",
        "新增配置组",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^.{1,50}$/,
          inputErrorMessage: "配置组名称长度应在1-50个字符之间"
        }
      );

      if (value && value.trim()) {
        const groupName = value.trim();
        // 检查组名是否已存在
        const hasGroup = groupDataList.value.some(
          (item: any) => item.config_group_name === groupName
        );
        if (hasGroup) {
          message("配置组名称已存在", { type: "warning" });
          return;
        }
        // 调用 API 创建配置组
        try {
          await configApi.createConfigGroup({ config_group_name: groupName });
          // 刷新组列表（从服务器获取最新数据）
          await getGroupList();
          // 选中新创建的组
          const newGroup = groupDataList.value.find(
            (item: any) => item.config_group_name === groupName
          );
          if (newGroup) {
            currentGroup.value = newGroup;
            await loadConfigByGroup(newGroup);
          }
          message("配置组创建成功，请添加配置项", { type: "success" });
        } catch (error) {
          console.error("创建配置组失败:", error);
          message("创建配置组失败", { type: "error" });
        }
      }
    } catch (error) {
      // 用户取消操作，不需要处理
      if (error !== "cancel") {
        console.error("新增配置组失败:", error);
        message("新增配置组失败", { type: "error" });
      }
    }
  }

  onMounted(() => {
    getGroupList();
    getDictTypeList();
  });

  return {
    loading,
    groupList: groupDataList,
    currentGroup,
    configList,
    configForm,
    configFormRef,
    addForm,
    addFormRef,
    selectGroup,
    loadConfigByGroup,
    saveConfigForm,
    handleAddConfig,
    handleEditConfig,
    handleDeleteConfig,
    openDialog,
    getConfigOptions,
    getGroupList,
    handleAddGroup,
    handleDeleteGroup,
    dictTypeList,
    getDictTypeList,
    loadConfigOptions,
    formDictOptions,
    loadingFormDictOptions,
    loadFormDictOptions
  };
}
