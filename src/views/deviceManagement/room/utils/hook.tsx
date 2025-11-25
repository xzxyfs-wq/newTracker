import dayjs from "dayjs";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import roomApi from "@/api/deviceManagement/room";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "./types.ts";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useRoom() {
  const form = reactive({
    room_name: "",
    hospital_district_name: ""
  });

  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const loading = ref(false);
  const selectedNum = ref(0);
  const hospitalDistrictOptions = ref<any[]>([]);

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
      label: "房间名称",
      prop: "room_name",
      minWidth: 150,
      align: "left"
    },
    {
      label: "院区名称",
      prop: "hospital_district_name",
      minWidth: 150,
      align: "left"
    },
    {
      label: "排序",
      prop: "order_by",
      minWidth: 80,
      align: "center"
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "created_at",
      align: "center",
      formatter: ({ created_at }) =>
        created_at ? dayjs(created_at).format("YYYY-MM-DD HH:mm:ss") : "-"
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
      const response = await roomApi.getRoomList({
        room_name: form.room_name || undefined,
        hospital_district_name: form.hospital_district_name || undefined,
        page_index: pagination.currentPage,
        page_size: pagination.pageSize
      });

      if (response && response.code === 200 && response.data) {
        dataList.value = response.data.list || [];
        pagination.total = response.data.count || 0;
      }
    } catch (error) {
      console.error("获取房间列表失败:", error);
      message("获取房间列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  // 优化：防抖处理分页变化，避免频繁请求
  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    pagination.currentPage = 1; // 重置到第一页
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}房间`,
      props: {
        formInline: {
          room_id: row?.room_id ?? undefined,
          room_name: row?.room_name ?? "",
          order_by: row?.order_by ?? 1, // 新增时默认为1
          hospital_district_id: row?.hospital_district_id ?? undefined
          // 优化：不传递 hospital_district_name，减少数据传递
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(editForm, {
          ref: formRef,
          formInline: options.props.formInline,
          hospitalDistrictOptions: hospitalDistrictOptions.value
        }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = formRef.value.formInline as FormItemProps;

        FormRef.validate(async valid => {
          if (valid) {
            try {
              let response;
              if (!curData.room_id) {
                // 新增房间 - 只提交 hospital_district_id，不提交 hospital_district_name
                response = await roomApi.addRoom({
                  room_name: curData.room_name!,
                  order_by: curData.order_by,
                  hospital_district_id: curData.hospital_district_id
                });
              } else {
                // 修改房间 - 只提交 hospital_district_id，不提交 hospital_district_name
                response = await roomApi.updateRoom({
                  room_id: curData.room_id!,
                  room_name: curData.room_name!,
                  order_by: curData.order_by,
                  hospital_district_id: curData.hospital_district_id
                });
              }

              if (response?.code === 200) {
                message(
                  `您${title}了房间名称为${curData.room_name}的这条数据`,
                  {
                    type: "success"
                  }
                );
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              } else {
                message(response?.msg || `${title}房间失败`, { type: "error" });
              }
            } catch (error) {
              console.error(`${title}房间失败:`, error);
              message(`${title}房间失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    try {
      await ElMessageBox.confirm(
        `确认要删除<strong style='color:var(--el-color-primary)'>${
          row.room_name
        }</strong>房间吗?删除后无法恢复！`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      );

      const response = await roomApi.deleteRoom(row.room_id);
      if (response?.code === 200) {
        message(`已删除房间名称为${row.room_name}的这条数据`, {
          type: "success"
        });
        onSearch();
      } else {
        message(response?.msg || "删除房间失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除房间失败:", error);
        message("删除房间失败", { type: "error" });
      }
      // 用户取消操作，不处理
    }
  }

  // 获取院区列表 - 优化：只获取一次，缓存结果
  async function getHospitalDistrictList() {
    // 如果已有数据，不再重复请求
    if (hospitalDistrictOptions.value.length > 0) return;

    try {
      const response = await roomApi.getAllHospitalDistrictList();
      if (response && response.code === 200 && response.data) {
        // 优化：使用 filter 一次性过滤，避免多次遍历
        hospitalDistrictOptions.value = response.data.filter(
          item => item.hospital_district_status === 1
        );
      }
    } catch (error) {
      console.error("获取院区列表失败:", error);
    }
  }

  // 优化：并行执行初始化操作，提升加载速度
  onMounted(() => {
    // 并行执行，不阻塞页面加载
    getHospitalDistrictList();
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
    hospitalDistrictOptions,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改房间 */
    openDialog,
    /** 删除房间 */
    handleDelete,
    handleSelectionChange,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange
  };
}
