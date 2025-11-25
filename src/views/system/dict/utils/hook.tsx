import dayjs from "dayjs";
import editForm from "../form.vue";
import dictDataForm from "../data/form.vue";
import { message } from "@/utils/message";
import { dictApi } from "@/api/system";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, markRaw, shallowRef } from "vue";
import type { FormItemProps } from "./types";
import type { FormItemProps as DictDataFormItemProps } from "../data/utils/types";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";

// 使用 markRaw 包装组件，避免响应式警告
const editFormComponent = markRaw(editForm);
const dictDataFormComponent = markRaw(dictDataForm);

export function useDict() {
  const form = reactive({
    dict_type_name: "",
    dict_type_code: "",
    status: 0,
    remark: ""
  });

  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedRows = ref<FormItemProps[]>([]);
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1
  });
  const { tagStyle } = usePublicHooks();

  // 字典数据抽屉相关
  const dictDataDrawerVisible = ref(false);
  const dictDataList = ref([]);
  const dictDataLoading = ref(false);
  const currentDictInfo = ref<FormItemProps | null>(null);
  const dictDataForm = reactive({
    dictLabel: "",
    status: null
  });
  const dictDataFormRef = ref();
  const dictDataFormDialogRef = ref();

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 50,
      align: "left",
      reserveSelection: true
    },
    {
      label: "字典编号",
      prop: "dict_type_id",
      width: 100
    },
    {
      label: "字典名称",
      prop: "dict_type_name",
      width: 180
    },
    {
      label: "字典类型",
      prop: "dict_type_code",
      width: 180,
      cellRenderer: ({ row }) => (
        <el-button link type="primary" onClick={() => handleViewDictData(row)}>
          {row.dict_type_code}
        </el-button>
      )
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          style={tagStyle.value(row.status === 1 ? 1 : 0)}
        >
          {row.status === 1 ? "正常" : "禁用"}
        </el-tag>
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 200
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val: FormItemProps[]) {
    selectedRows.value = val;
  }

  async function handleViewDictData(row: FormItemProps) {
    currentDictInfo.value = row;
    dictDataDrawerVisible.value = true;
    await loadDictData();
  }

  async function loadDictData() {
    if (!currentDictInfo.value?.dict_type_code) {
      return;
    }
    dictDataLoading.value = true;
    try {
      const params: any = {
        dict_type_code: currentDictInfo.value.dict_type_code,
        page_size: 9999
      };

      // 添加搜索条件
      // if (!isAllEmpty(dictDataForm.dictLabel)) {
      //   params.dictLabel = dictDataForm.dictLabel;
      // }
      // if (!isAllEmpty(dictDataForm.status)) {
      //   params.status = dictDataForm.status;
      // }

      const res = await dictApi.getDictDataList(params);
      if (res.success) {
        // 如果返回的是分页结构，取 list；如果是数组，直接使用
        if (Array.isArray(res.data)) {
          dictDataList.value = res.data;
        } else if (
          res.data &&
          typeof res.data === "object" &&
          "list" in res.data
        ) {
          dictDataList.value = (res.data as any).list || [];
        } else {
          dictDataList.value = [];
        }
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      console.error("获取字典数据列表失败:", error);
      dictDataList.value = [];
    } finally {
      dictDataLoading.value = false;
    }
  }

  function resetDictDataForm() {
    dictDataForm.dictLabel = "";
    dictDataForm.status = null;
    loadDictData();
  }

  function openDictDataDialog(title = "新增", row?: any) {
    if (!currentDictInfo.value?.dict_type_code) {
      message("请先选择字典类型", { type: "warning" });
      return;
    }
    addDialog({
      title: `${title}字典数据`,
      props: {
        formInline: {
          dict_type_code: currentDictInfo.value?.dict_type_code ?? "",
          dict_id: row?.dict_id ?? undefined,
          dict_key: row?.dict_key ?? "",
          dict_value: row?.dict_value ?? "",
          dict_sort: row?.dict_sort ?? 0,
          status: row?.status === 1 ? 1 : row?.status === -1 ? -1 : 1,
          remark: row?.remark ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(dictDataFormComponent, {
          ref: dictDataFormDialogRef,
          formInline: null
        }),
      beforeSure: async (done, { options }) => {
        const FormRef = dictDataFormDialogRef.value.getRef();
        const curData = options.props.formInline as DictDataFormItemProps;
        function chores() {
          message(`您${title}了数据标签为${curData.dict_key}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          loadDictData(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (!curData.dict_id) {
                await dictApi.addDictData(curData);
              } else {
                await dictApi.updateDictData(curData);
              }
              chores();
            } catch (error) {
              console.error(`${title}字典数据失败:`, error);
              message(`${title}字典数据失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function handleDictDataDelete(row: any) {
    try {
      await dictApi.deleteDictData({ dict_id: row.dict_id });
      message(`您删除了数据标签为${row.dict_key}的这条数据`, {
        type: "success"
      });
      loadDictData();
    } catch (error) {
      console.error("删除字典数据失败:", error);
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: any = {
        page: pagination.currentPage,
        page_size: pagination.pageSize
      };

      // if (!isAllEmpty(form.dictName)) {
      //   params.dict_type_name = form.dict_type_name;
      // }
      // if (!isAllEmpty(form.dictType)) {
      //   params.dict_type_code = form.dict_type_code;
      // }
      // if (!isAllEmpty(form.status)) {
      //   params.status = String(form.status);
      // }

      const res = await dictApi.getDictTypeList(params);
      if (res?.success) {
        dataList.value = res.data?.list || [];
        pagination.total = res.data?.count || 0;
        pagination.currentPage = res.data?.page || 1;
        pagination.pageSize = res.data?.page_size || 10;
      } else {
        dataList.value = [];
        pagination.total = 0;
      }
    } catch (error) {
      console.error("获取字典列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
    } finally {
      loading.value = false;
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

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}字典`,
      props: {
        formInline: Object.assign(
          {
            dict_type_id: undefined,
            dict_type_name: "",
            dict_type_code: "",
            status: 1,
            remark: ""
          },
          row
        )
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editFormComponent, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了字典名称为${curData.dict_type_name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (!curData.dict_type_id) {
                await dictApi.addDictType(curData);
              } else {
                await dictApi.updateDictType(curData);
              }
              chores();
            } catch (error) {
              console.error(`${title}字典失败:`, error);
            }
          }
        });
      }
    });
  }

  async function handleDelete(row: FormItemProps) {
    try {
      await dictApi.deleteDictType({ dict_type_id: row.dict_type_id! });
      message(`您删除了字典名称为${row.dict_type_name}的这条数据`, {
        type: "success"
      });
      // 清除表格选中状态
      const tableInstance = tableRef.value?.getTableRef?.();
      if (tableInstance?.clearSelection) {
        tableInstance.clearSelection();
      }
      selectedRows.value = [];
      onSearch();
    } catch (error) {
      console.error("删除字典失败:", error);
    }
  }

  async function handleBatchDelete() {
    if (selectedRows.value.length === 0) {
      message("请至少选择一条数据", { type: "warning" });
      return;
    }
    try {
      const ids = selectedRows.value.map(row => row.dict_type_id).join(",");
      await dictApi.deleteDictType(ids as any);
      message(`成功删除 ${selectedRows.value.length} 条数据`, {
        type: "success"
      });
      // 清除表格选中状态
      const tableInstance = tableRef.value?.getTableRef?.();
      if (tableInstance?.clearSelection) {
        tableInstance.clearSelection();
      }
      selectedRows.value = [];
      onSearch();
    } catch (error) {
      console.error("批量删除字典失败:", error);
      message("批量删除字典失败", { type: "error" });
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    selectedRows,
    tableRef,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改字典 */
    openDialog,
    /** 删除字典 */
    handleDelete,
    /** 批量删除字典 */
    handleBatchDelete,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    /** 查看字典数据 */
    handleViewDictData,
    /** 字典数据抽屉相关 */
    dictDataDrawerVisible,
    dictDataList,
    dictDataLoading,
    currentDictInfo,
    dictDataForm,
    dictDataFormRef,
    loadDictData,
    resetDictDataForm,
    openDictDataDialog,
    handleDictDataDelete
  };
}
