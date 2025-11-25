import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { ElMessageBox, ElMessage } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList, deviceDetection, isAllEmpty } from "@pureadmin/utils";
import { getRoleMenu, getRoleMenuIds, roleApi } from "@/api/system";
import dictApi from "@/api/dict";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch } from "vue";

export function useRole(treeRef: Ref) {
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const treeIds = ref([]);
  const treeData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const isLinkage = ref(false);
  const treeSearchValue = ref();
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const statusOptions = ref<any[]>([]);
  const { switchStyle } = usePublicHooks();
  const treeProps = {
    value: "id",
    label: "title",
    children: "children"
  };
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "角色编号",
      prop: "role_id",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "role_name",
      minWidth: 150
    },
    {
      label: "权限字符",
      prop: "role_key",
      minWidth: 150
    },
    {
      label: "显示顺序",
      prop: "sort",
      minWidth: 100
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        const activeOption = statusOptions.value.find(
          (item: any) => item.dictValue === "0" || item.dictValue === 0
        );
        const inactiveOption = statusOptions.value.find(
          (item: any) => item.dictValue === "1" || item.dictValue === 1
        );
        const activeText = activeOption?.dictLabel || "正常";
        const inactiveText = inactiveOption?.dictLabel || "停用";
        return (
          <el-switch
            size={props.size === "small" ? "small" : "default"}
            loading={row.loading}
            modelValue={row.status}
            active-value={"0"}
            inactive-value={"1"}
            active-text={activeText}
            inactive-text={inactiveText}
            inline-prompt
            style={switchStyle.value}
            before-change={() => onChange(row)}
          />
        );
      }
    },
    {
      label: "创建时间",
      prop: "created_at",
      minWidth: 160,
      formatter: ({ created_at }) =>
        dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "h-[20px]!",
  //     "reset-margin",
  //     "text-gray-500!",
  //     "dark:text-white!",
  //     "dark:hover:text-primary!"
  //   ];
  // });

  async function onChange(row) {
    console.log(row);

    try {
      await ElMessageBox.confirm(
        `确认要<strong>${
          row.status === "0" || row.status === 0 ? "停用" : "启用"
        }</strong><strong style='color:var(--el-color-primary)'>${
          row.role_name || row.roleName || row.name
        }</strong>吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      );
      row.loading = true;
      const submitData: any = {
        role_id: row.role_id || row.roleId || row.id,
        role_name: row.role_name || row.roleName || row.name,
        role_key: row.role_key || row.roleKey || row.code,
        role_sort: row.role_sort || row.roleSort || row.sort || 0,
        status: row.status,
        remark: row.remark || "",
        admin: row.admin || "",
        data_scope: row.data_scope || row.dataScope || ""
      };
      const res: any = await roleApi.updateRole(submitData);
      if (res?.code !== 200 && !res?.success) {
        throw new Error(res?.msg || res?.error || "更新失败");
      }
      ElMessage.success(`操作成功`);
      return true;
    } catch (error) {
      console.error("更新角色状态失败:", error);
      return false;
    } finally {
      row.loading = false;
    }
  }

  async function handleDelete(row) {
    try {
      await roleApi.deleteRole({
        role_id: row.role_id || row.roleId || row.id
      });
      ElMessage.success(`操作成功`);
      onSearch();
    } catch (error) {
      console.error("删除角色失败:", error);
      ElMessage.error("删除角色失败");
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: any = {
        role_id: 0,
        page: pagination.currentPage,
        page_size: pagination.pageSize
      };

      if (!isAllEmpty(form.name)) {
        params.role_name = form.name;
      }
      if (!isAllEmpty(form.code)) {
        params.role_key = form.code;
      }
      if (!isAllEmpty(form.status)) {
        params.status = form.status;
      }

      const response = await roleApi.getRoleList(params);
      if (response?.success) {
        dataList.value = response.data?.list || [];
        pagination.total = response.data?.count || 0;
        pagination.currentPage = response.data?.page || 1;
        pagination.pageSize = response.data?.page_size || 10;
      } else {
        dataList.value = [];
        pagination.total = 0;
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  };

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          role_id: row?.role_id || row?.roleId || row?.id,
          role_name: (row?.role_name || row?.roleName || row?.name) ?? "",
          role_key: (row?.role_key || row?.roleKey || row?.code) ?? "",
          role_sort: row?.role_sort || row?.roleSort || row?.sort || 0,
          status:
            row?.status !== undefined
              ? typeof row.status === "string"
                ? Number(row.status)
                : row.status
              : 0,
          remark: row?.remark ?? "",
          admin: row?.admin ?? "",
          data_scope: row?.data_scope || row?.dataScope || ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          ElMessage.success(`操作成功`);
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              const submitData: any = {
                role_name: curData.role_name,
                role_key: curData.role_key,
                role_sort: curData.role_sort || 0,
                status: curData.status || 0,
                remark: curData.remark || "",
                admin: curData.admin || "",
                data_scope: curData.data_scope || ""
              };

              if (title === "新增") {
                await roleApi.addRole(submitData);
              } else {
                submitData.role_id = row?.role_id || row?.roleId || row?.id;
                await roleApi.updateRole(submitData);
              }
              chores();
            } catch (error) {
              console.error(`${title}角色失败:`, error);
              ElMessage.error(`${title}角色失败`);
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  async function handleMenu(row?: any) {
    const roleId = row?.roleId || row?.id;
    if (roleId) {
      curRow.value = row;
      isShow.value = true;
      const res: any = await getRoleMenuIds({ id: roleId });
      const data = res?.data || res || [];
      treeRef.value.setCheckedKeys(data);
    } else {
      curRow.value = null;
      isShow.value = false;
    }
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row }) {
    const rowId = row.role_id || row.roleId || row.id;
    const curRowId =
      curRow.value?.role_id || curRow.value?.roleId || curRow.value?.id;
    return {
      cursor: "pointer",
      background: rowId === curRowId ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { role_id, roleId, id, role_name, roleName, name } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    console.log(role_id || roleId || id, treeRef.value.getCheckedKeys());
    ElMessage.success(`操作成功`);
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.title)!.includes(query);
  };

  async function loadStatusOptions() {
    try {
      const response = await dictApi.getDictByType("sys_normal_disable");
      if (response?.data && Array.isArray(response.data)) {
        statusOptions.value = response.data;
      }
    } catch (error) {
      console.error("获取状态字典失败:", error);
      statusOptions.value = [];
    }
  }

  onMounted(() => {
    // await loadStatusOptions();
    onSearch();
    // const res: any = await getRoleMenu();
    // const data = res?.data || res || [];
    // treeIds.value = getKeyList(data, "id");
    // treeData.value = handleTree(data);
  });

  watch(isExpandAll, val => {
    val
      ? treeRef.value.setExpandedKeys(treeIds.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    val
      ? treeRef.value.setCheckedKeys(treeIds.value)
      : treeRef.value.setCheckedKeys([]);
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    treeData,
    treeProps,
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    statusOptions,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleSave,
    handleDelete,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
