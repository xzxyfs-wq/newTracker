import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import { isAllEmpty, hideTextAtIndex, deviceDetection } from "@pureadmin/utils";
import { getRoleIds, roleApi, userApi, deptApi, postApi } from "@/api/system";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  type Ref,
  h,
  ref,
  watch,
  computed,
  reactive,
  onMounted,
  nextTick
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    dept_id: "",
    username: "",
    nick_name: "",
    barcode: "",
    phone: "",
    status: 0
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "工号",
      prop: "barcode",
      minWidth: 150
    },
    {
      label: "用户昵称",
      prop: "nick_name",
      minWidth: 130
    },
    {
      label: "部门",
      prop: "sys_dept.dept_name",
      minWidth: 90
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90,
      formatter: ({ phone }) => hideTextAtIndex(phone, { start: 3, end: 6 })
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={-1}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => {
            if (!isInitializing.value) {
              onChange(scope as any);
            }
          }}
        />
      )
    },
    {
      label: "所有项目权限",
      prop: "project_auth",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <el-tag
          type={row.project_auth === 1 ? "success" : "info"}
          effect="plain"
        >
          {row.project_auth === 1 ? "开启" : "关闭"}
        </el-tag>
      )
    },
    {
      label: "有效期",
      prop: "account_expire_date",
      width: 120
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "h-[20px]!",
      "reset-margin",
      "text-gray-500!",
      "dark:text-white!",
      "dark:hover:text-primary!"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);
  const postOptions = ref([]);
  const isInitializing = ref(false);

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === -1 ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          ElMessage.success(`操作成功`);
        }, 300);
      })
      .catch(() => {
        row.status === -1 ? (row.status = 1) : (row.status = -1);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    ElMessage.success(`操作成功`);
    onSearch();
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

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    ElMessage.success(`操作成功`);
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch(searchFormData?: Record<string, any>) {
    loading.value = true;
    try {
      // 从 ReTable 的 searchForm 获取搜索条件，如果没有则使用传入的参数或 form
      const searchForm = searchFormData || tableRef.value?.searchForm || form;

      const params: any = {
        dept_id:
          form.dept_id === ""
            ? 0
            : typeof form.dept_id === "number"
              ? form.dept_id
              : Number(form.dept_id) || 0,
        page: pagination.currentPage,
        page_size: pagination.pageSize
      };

      if (searchForm.username) {
        params.username = searchForm.username;
      }
      if (searchForm.nick_name) {
        params.nick_name = searchForm.nick_name;
      }
      if (searchForm.barcode) {
        params.barcode = searchForm.barcode;
      }
      if (searchForm.phone) {
        params.phone = searchForm.phone;
      }
      if (
        searchForm.status !== undefined &&
        searchForm.status !== null &&
        searchForm.status !== ""
      ) {
        params.status = searchForm.status;
      }

      const response = await userApi.getUserList(params);
      if (response?.success) {
        isInitializing.value = true;
        dataList.value = response.data?.list || [];
        pagination.total = response.data?.count || 0;
        pagination.currentPage = response.data?.page || 1;
        pagination.pageSize = response.data?.page_size || 10;
        // 等待下一个 tick 后取消初始化标志，避免数据加载时触发 switch 的 change 事件
        await nextTick();
        setTimeout(() => {
          isInitializing.value = false;
        }, 100);
      } else {
        throw new Error(response?.error ?? "获取用户列表失败");
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  const resetForm = formEl => {
    // 重置 ReTable 的 searchForm
    if (tableRef.value?.resetSearchForm) {
      tableRef.value.resetSearchForm();
    }
    // 重置 form 对象
    form.dept_id = "";
    form.username = "";
    form.nick_name = "";
    form.barcode = "";
    form.phone = "";
    form.status = 0;
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect(value) {
    const deptId = value?.dept_id || value?.id;
    form.dept_id = value?.selected ? deptId : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示
    if (!treeList || !treeList.length) return [];
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      const item = { ...treeList[i] };
      item.disabled = item.status === 0 || item.status === -1;
      if (item.children && item.children.length > 0) {
        item.children = formatHigherDeptOptions(item.children);
      }
      newTreeList.push(item);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          postOptions: postOptions.value ?? [],
          roleOptions: roleOptions.value ?? [],
          user_id: row?.user_id,
          dept_id: row?.dept_id ?? "",
          nick_name: row?.nick_name ?? "",
          username: row?.username ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          status: row?.status ?? 1,
          role_ids: row?.roles.map(item => item.role_id) ?? [],
          post_id: row?.post_id ?? "",
          barcode: row?.barcode ?? "",
          identify_no: row?.identify_no ?? "",
          account_expire_date: row?.account_expire_date ?? "",
          salt: row?.salt ?? "",
          project_auth: row?.project_auth ?? 1,
          user_login_type: row?.user_login_type ?? 0
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        console.log(curData);
        function chores() {
          ElMessage.success(`操作成功`);
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              // 获取表单实际值，确保所有字段都是最新的
              const formData = FormRef.model || {};

              // 构建提交数据，优先使用表单的实际值
              const submitData: any = {
                ...curData,
                ...formData,
                // 确保日期字段正确传递（如果为 null 或 undefined，转换为空字符串）
                account_expire_date:
                  formData.account_expire_date ??
                  curData.account_expire_date ??
                  ""
              };

              let res;
              if (!curData.user_id) {
                res = await userApi.createUser(submitData);
                if (!res?.success) {
                  throw new Error(res?.error ?? "新增用户失败");
                }
              } else {
                // 修改用户逻辑
                res = await userApi.updateUser(submitData);
                if (!res?.success) {
                  throw new Error(res?.error ?? "修改用户失败");
                }
              }
              chores();
            } catch (error) {
              console.error(`${title}用户失败:`, error);
              ElMessage.error(error?.message || `${title}用户失败`);
            }
          }
        });
      }
    });
  }

  const cropRef = ref();
  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(ReCropperPreview, {
          ref: cropRef,
          imgSrc: row.avatar || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        console.log("裁剪后的图片信息：", avatarInfo.value);
        // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
        done(); // 关闭弹框
        onSearch(); // 刷新表格数据
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  async function handleReset(row) {
    try {
      ElMessageBox.confirm(
        `确认要重置 <strong style='color:var(--el-color-primary)'>${row.username}</strong> 用户的密码吗？`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      )
        .then(async () => {
          try {
            // 调用重置密码接口，只传 user_id
            const params = {
              user_id: row.user_id || row.id
            };
            const res = await userApi.resetPassword(params);
            if (res?.success) {
              // 获取返回的新密码
              // res.data 可能是字符串、对象或数组，需要根据实际返回格式处理
              let newPassword = "";
              if (typeof res.data === "string") {
                newPassword = res.data;
              } else if (res.data && typeof res.data === "object") {
                newPassword =
                  (res.data as any).password ||
                  (res.data as any).new_password ||
                  "";
              }

              // 使用弹窗显示新密码
              ElMessageBox.alert(
                `<div style="text-align: center; padding: 20px;">
                  <p style="font-size: 16px; margin-bottom: 10px;">密码重置成功！</p>
                  <p style="font-size: 14px; color: #666; margin-bottom: 15px;">新密码为：</p>
                  <p style="font-size: 20px; font-weight: bold; color: var(--el-color-primary); letter-spacing: 2px; padding: 10px; background: #f5f7fa; border-radius: 4px;">${newPassword}</p>
                  <p style="font-size: 12px; color: #999; margin-top: 15px;">请妥善保管新密码</p>
                </div>`,
                "重置密码成功",
                {
                  confirmButtonText: "我知道了",
                  type: "success",
                  dangerouslyUseHTMLString: true,
                  draggable: true,
                  center: true
                }
              );

              onSearch(); // 刷新表格数据
            } else {
              throw new Error(res?.error ?? "重置密码失败");
            }
          } catch (error) {
            console.error("重置密码失败:", error);
            ElMessage.error(error?.message || "重置密码失败");
          }
        })
        .catch(() => {
          // 用户取消操作
        });
    } catch (error) {
      console.error("重置密码失败:", error);
      ElMessage.error(error?.message || "重置密码失败");
    }
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const roleIdsResponse = await getRoleIds({ userId: row.id });
    const ids = (roleIdsResponse as any)?.data ?? [];
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nick_name: row?.nick_name ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        console.log("curIds", curData.ids);
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        done(); // 关闭弹框
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;

    try {
      // 先获取部门列表
      const deptResponse = await deptApi.getDeptList();
      if (deptResponse?.success && deptResponse?.data) {
        // 处理 children 为 null 的情况，转换为空数组
        const processTreeData = (data: any[]): any[] => {
          return data.map(item => ({
            ...item,
            children:
              item.children === null || item.children === undefined
                ? []
                : processTreeData(item.children || [])
          }));
        };
        const processedData = processTreeData(deptResponse.data);
        treeData.value = processedData;
        higherDeptOptions.value = processedData;

        // 取第一条部门的id，设置到form中并调用用户列表接口
        if (processedData && processedData.length > 0) {
          const firstDeptId = processedData[0].dept_id;
          // 等待DOM更新后设置树组件的选中状态
          await nextTick();
          treeRef.value?.setCurrentKey(firstDeptId);
          // 触发选中事件（会自动调用onSearch）
          onTreeSelect({
            ...processedData[0],
            selected: true
          });
        } else {
          onSearch();
        }
      } else {
        throw new Error(deptResponse?.error ?? "获取部门列表失败");
      }
    } catch (error) {
      console.error("获取部门列表失败:", error);
      treeData.value = [];
      higherDeptOptions.value = [];
      onSearch();
    } finally {
      treeLoading.value = false;
    }

    // 获取角色列表（用于分配角色功能）
    try {
      const roleResponse = await roleApi.getRoleSelectList();
      if (roleResponse?.success) {
        roleOptions.value = roleResponse.data ?? [];
      } else {
        throw new Error(roleResponse?.error ?? "获取角色列表失败");
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
      roleOptions.value = [];
    }

    // 获取岗位列表
    try {
      const postResponse = await postApi.getPostList({
        page: 1,
        page_size: 1000
      });
      if (postResponse?.success && postResponse?.data?.list) {
        postOptions.value = postResponse.data.list;
      } else {
        postOptions.value = [];
      }
    } catch (error) {
      console.error("获取岗位列表失败:", error);
      postOptions.value = [];
    }
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
