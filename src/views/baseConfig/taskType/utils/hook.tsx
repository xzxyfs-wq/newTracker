import dayjs from "dayjs";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import taskTypeApi from "@/api/baseConfig/taskType";
import { usePublicHooks } from "@/views/system/hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "./types.ts";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useTaskType() {
  const form = reactive({
    task_type_name: "",
    task_type_code: ""
  });

  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const loading = ref(false);
  const selectedNum = ref(0);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 50,
      align: "center",
      reserveSelection: true
    },
    {
      label: "序号",
      type: "index",
      width: 55,
      align: "center"
    },
    {
      label: "流程名称",
      prop: "task_type_name",
      width: 150,
      align: "left"
    },
    {
      label: "流程标识",
      prop: "task_type_code",
      width: 120,
      align: "left"
    },
    {
      label: "流程介绍",
      prop: "task_type_desc",
      width: 100,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "排序",
      prop: "sort",
      width: 80,
      align: "center"
    },
    {
      label: "操作类型",
      prop: "is_other_operation",
      width: 120,
      align: "center",
      formatter: ({ is_other_operation }) =>
        is_other_operation === -1 ? "常规操作" : "其他操作"
    },
    {
      label: "是否合管",
      prop: "is_merge_tube",
      width: 120,
      align: "center",
      formatter: ({ is_merge_tube }) => (is_merge_tube === 1 ? "是" : "否")
    },
    {
      label: "是否转移",
      prop: "can_transfer",
      width: 120,
      align: "center",
      formatter: ({ can_transfer }) => (can_transfer === 1 ? "是" : "否")
    },
    {
      label: "是否倒计时",
      prop: "is_countdown",
      width: 120,
      align: "center",
      formatter: ({ is_countdown }) => (is_countdown === 1 ? "是" : "否")
    },
    {
      label: "状态(显示/隐藏)",
      prop: "display",
      width: 130,
      align: "center",
      slot: "display"
    },
    {
      label: "状态(启用/禁用)",
      prop: "status",
      width: 130,
      align: "center",
      slot: "status"
    },
    {
      label: "创建时间",
      prop: "created_at",
      width: 180,
      align: "center",
      formatter: ({ created_at }) =>
        created_at ? dayjs(created_at).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      label: "是否使用",
      prop: "is_use",
      width: 120,
      align: "center",
      formatter: ({ is_use }) => (is_use === 1 ? "是" : "否")
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
  }

  function onSelectionCancel() {
    tableRef.value.getTableRef().clearSelection();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  }

  async function onSearch() {
    // 防止重复请求
    if (loading.value) return;

    loading.value = true;
    try {
      const response = await taskTypeApi.getTaskTypeList({
        task_type_name: form.task_type_name || undefined,
        task_type_code: form.task_type_code || undefined,
        page_index: pagination.currentPage,
        page_size: pagination.pageSize
      });

      if (response && response.code === 200 && response.data) {
        dataList.value = response.data.list || [];
        pagination.total = response.data.count || 0;
      }
    } catch (error) {
      console.error("获取样本处理流程列表失败:", error);
    } finally {
      loading.value = false;
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}样本处理流程`,
      props: {
        formInline: {
          task_type_id: row?.task_type_id ?? undefined,
          task_type_name: row?.task_type_name ?? "",
          task_type_code: row?.task_type_code ?? "",
          task_type_desc: row?.task_type_desc ?? "",
          sort: row?.sort ?? 0,
          is_record_end_time: row?.is_record_end_time ?? -1,
          is_merge_tube: row?.is_merge_tube ?? -1,
          can_transfer: row?.can_transfer ?? -1,
          is_countdown: row?.is_countdown ?? -1
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(editForm, { ref: formRef, formInline: options.props.formInline }),
      beforeSure: done => {
        const FormRef = formRef.value.getRef();
        const curData = formRef.value.formInline as FormItemProps;
        function chores() {
          message(`您${title}了流程名称为${curData.task_type_name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (!curData.task_type_id) {
              // 调用新增接口
              const res = await taskTypeApi.addTaskType({
                task_type_name: curData.task_type_name,
                task_type_code: curData.task_type_code,
                task_type_desc: curData.task_type_desc,
                sort: curData.sort,
                is_record_end_time: curData.is_record_end_time,
                is_merge_tube: curData.is_merge_tube,
                can_transfer: curData.can_transfer,
                is_countdown: curData.is_countdown
              });
              if (res?.code === 200) {
                chores();
              }
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              const res = await taskTypeApi.updateTaskType({
                task_type_id: curData.task_type_id!,
                task_type_name: curData.task_type_name!,
                task_type_code: curData.task_type_code!,
                task_type_desc: curData.task_type_desc!,
                sort: curData.sort!,
                is_record_end_time: curData.is_record_end_time!,
                is_merge_tube: curData.is_merge_tube!,
                can_transfer: curData.can_transfer!,
                is_countdown: curData.is_countdown!
              });
              if (res?.code === 200) {
                chores();
              }
            }
          }
        });
      }
    });
  }
  async function handleSwitchStatus(row) {
    try {
      row.statusLoading = true;
      await ElMessageBox.confirm(
        `确认要<strong>${
          row.status === 1 ? "停用" : "启用"
        }</strong><strong style='color:var(--el-color-primary)'>${
          row.task_type_name
        }</strong>流程吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      );
      const res = await taskTypeApi.updateStatus({
        task_type_id: row.task_type_id
      });
      if (res?.code === 200) {
        message(
          `已${row.status === 1 ? "停用" : "启用"}流程名称为${row.task_type_name}的这条数据`,
          { type: "success" }
        );
        onSearch();
        return true;
      } else {
        throw new Error(res?.msg ?? "启用/停用样本处理流程失败");
      }
    } catch (error) {
      console.error("启用/停用样本处理流程失败:", error);
      return false;
    } finally {
      row.statusLoading = false;
    }
  }

  async function handleSwitchDisplay(row) {
    try {
      row.displayLoading = true;
      await ElMessageBox.confirm(
        `确认要<strong>${
          row.display === 1 ? "隐藏" : "显示"
        }</strong><strong style='color:var(--el-color-primary)'>${
          row.task_type_name
        }</strong>流程吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      );
      const res = await taskTypeApi.updateDisplayStatus({
        task_type_id: row.task_type_id
      });
      if (res?.code === 200) {
        message(
          `已${row.display === 1 ? "隐藏" : "显示"}流程名称为${row.task_type_name}的这条数据`,
          { type: "success" }
        );
        onSearch();
        return true;
      } else {
        throw new Error(res?.msg ?? "修改显示状态失败");
      }
    } catch (error) {
      console.error("修改显示状态失败:", error);
      return false;
    } finally {
      row.displayLoading = false;
    }
  }

  async function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除<strong style='color:var(--el-color-primary)'>${
        row.task_type_name
      }</strong>流程吗?删除后无法恢复！`,
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
        const res = await taskTypeApi.deleteTaskType(row.task_type_id);
        if (res?.code === 200) {
          message(`已删除流程名称为${row.task_type_name}的这条数据`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        // 用户取消操作
      });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    tableRef,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改样本处理流程 */
    openDialog,
    /** 启用/停用 */
    handleSwitchStatus,
    /** 显示/隐藏 */
    handleSwitchDisplay,
    /** 删除样本处理流程 */
    handleDelete,
    handleSelectionChange,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange
  };
}
