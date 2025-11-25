import dayjs from "dayjs";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import hospitalApi from "@/api/baseConfig/hospital";
import { usePublicHooks } from "@/views/system/hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "./types.ts";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useHospital() {
  const form = reactive({
    hospital_district_name: "",
    hospital_district_no: ""
  });

  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const { tagStyle } = usePublicHooks();

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
      align: "left",
      reserveSelection: true
    },
    {
      label: "序号",
      type: "index",
      width: 55,
      align: "center"
    },
    {
      label: "院区编号",
      prop: "hospital_district_no",
      minWidth: 120,
      align: "left"
    },
    {
      label: "院区名称",
      prop: "hospital_district_name",
      minWidth: 180,
      align: "left"
    },
    {
      label: "是否使用",
      prop: "is_use",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.is_use)}>
          {row.is_use === 1 ? "是" : "否"}
        </el-tag>
      )
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "success" : "danger"}
        >
          {row.status === 1 ? "启用" : "停用"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "created_at",
      formatter: ({ created_at }) =>
        created_at ? dayjs(created_at).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
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
    loading.value = true;
    try {
      const response = await hospitalApi.getHospitalList({
        hospital_district_name: form.hospital_district_name || undefined,
        hospital_district_no: form.hospital_district_no || undefined,
        page_index: pagination.currentPage,
        page_size: pagination.pageSize
      });

      if (response && response.code === 200 && response.data) {
        dataList.value = response.data.list || [];
        pagination.total = response.data.count || 0;
      }
    } catch (error) {
      console.error("获取院区列表失败:", error);
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
    const formData = {
      hospital_district_id: row?.hospital_district_id ?? undefined,
      hospital_district_no: row?.hospital_district_no ?? "",
      hospital_district_name: row?.hospital_district_name ?? ""
    };

    addDialog({
      title: `${title}院区`,
      props: {
        formInline: formData
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
          message(
            `您${title}了院区名称为${curData.hospital_district_name}的这条数据`,
            {
              type: "success"
            }
          );
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (!curData.hospital_district_id) {
              // 调用新增接口
              const res = await hospitalApi.addHospital({
                hospital_district_no: curData.hospital_district_no,
                hospital_district_name: curData.hospital_district_name
              });
              if (res?.code === 200) {
                chores();
              }
            } else {
              // 调用修改接口
              const res = await hospitalApi.updateHospital({
                hospital_district_id: curData.hospital_district_id!,
                hospital_district_no: curData.hospital_district_no!,
                hospital_district_name: curData.hospital_district_name!
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
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 1 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.hospital_district_name
      }</strong>院区吗?`,
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
        const ids = [row.hospital_district_id];
        const res = await hospitalApi.switchStatus({
          hospital_district_ids: ids
        });
        if (res.code === 200) {
          message(
            `已${row.status === 1 ? "停用" : "启用"}院区名称为${row.hospital_district_name}的这条数据`,
            { type: "success" }
          );
          onSearch();
        }
      })
      .catch(() => {
        // 用户取消操作
      });
  }

  async function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除<strong style='color:var(--el-color-primary)'>${
        row.hospital_district_name
      }</strong>院区吗?删除后无法恢复！`,
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
        const res = await hospitalApi.deleteHospital(row.hospital_district_id);
        if (res.code === 200) {
          message(`已删除院区名称为${row.hospital_district_name}的这条数据`, {
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
    /** 新增、修改院区 */
    openDialog,
    /** 启用/停用 */
    handleSwitchStatus,
    /** 删除院区 */
    handleDelete,
    handleSelectionChange,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange
  };
}
