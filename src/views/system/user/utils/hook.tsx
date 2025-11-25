import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import {
  getKeyList,
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import { getRoleIds, roleApi, userApi, deptApi, postApi } from "@/api/system";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox,
  ElMessage
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
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
      minWidth: 120
    },
    {
      label: "用户昵称",
      prop: "nick_name",
      minWidth: 130
    },
    {
      label: "部门",
      prop: "dept.name",
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
          message("已成功修改用户状态", {
            type: "success"
          });
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
    message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
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
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
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

      if (form.username) {
        params.username = form.username;
      }
      if (form.nick_name) {
        params.nick_name = form.nick_name;
      }
      if (form.barcode) {
        params.barcode = form.barcode;
      }
      if (form.phone) {
        params.phone = form.phone;
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
    if (!formEl) return;
    formEl.resetFields();
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
          role_ids: row?.role_ids ?? [],
          post_id: row?.post_id ?? "",
          barcode: row?.barcode ?? "",
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
        function chores() {
          message(`您${title}了用户名称为${curData.username}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                const submitData: any = {
                  username: curData.username,
                  nick_name: curData.nick_name,
                  phone: curData.phone || "",
                  email: curData.email || "",
                  dept_id:
                    curData.dept_id === ""
                      ? 0
                      : typeof curData.dept_id === "number"
                        ? curData.dept_id
                        : Number(curData.dept_id) || 0,
                  status: curData.status ?? 1,
                  role_ids: curData.role_ids || [],
                  post_id:
                    curData.post_id === ""
                      ? 0
                      : typeof curData.post_id === "number"
                        ? curData.post_id
                        : Number(curData.post_id) || 0,
                  barcode: curData.barcode || "",
                  salt: curData.salt || "",
                  project_auth: curData.project_auth ?? 1,
                  user_login_type: curData.user_login_type || 0
                };
                const res = await userApi.createUser(submitData);
                if (!res?.success) {
                  throw new Error(res?.error ?? "新增用户失败");
                }
                chores();
              } else {
                // 修改用户逻辑
                chores();
              }
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
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="my-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            message(`已成功重置 ${row.username} 用户的密码`, {
              type: "success"
            });
            console.log(pwdForm.newPwd);
            // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        });
      }
    });
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
