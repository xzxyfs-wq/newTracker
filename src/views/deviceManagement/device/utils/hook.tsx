import dayjs from "dayjs";
import editForm from "../form/index.vue";
import storeForm from "../storeForm/index.vue";
import { message } from "@/utils/message";
import deviceApi from "@/api/deviceManagement/device";
import roomApi from "@/api/deviceManagement/room";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps, DeviceTypeOption } from "./types.ts";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useDevice() {
  const form = reactive({
    device_type_id: undefined,
    room_id: undefined,
    device_barcode: ""
  });

  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const loading = ref(false);
  const selectedNum = ref(0);
  const deviceTypeOptions = ref<DeviceTypeOption[]>([]);
  const roomOptions = ref([]);
  const centrifugeTypeOptions = ref<
    Array<{ dictValue: string; dictLabel: string }>
  >([]);
  const transferTypeOptions = ref<
    Array<{ dictValue: string; dictLabel: string }>
  >([]);
  const storeListDrawerVisible = ref(false);
  const storeListData = ref([]);
  const currentDevice = ref<FormItemProps | null>(null);
  const storeFormRef = ref();
  const floorList = ref<
    Array<{ device_id: number; device_name: string; floors: number }>
  >([]);
  const storeListLoading = ref(false);
  const storeListPagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

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
      label: "设备编码",
      prop: "device_barcode",
      minWidth: 120,
      align: "left"
    },
    {
      label: "设备名称",
      prop: "device_name",
      minWidth: 150,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "设备类型",
      prop: "device_type_name",
      minWidth: 110,
      align: "center"
    },
    {
      label: "所在房间",
      prop: "room_name",
      minWidth: 120,
      align: "left"
    },
    {
      label: "设备型号",
      prop: "device_model",
      minWidth: 120,
      align: "left"
    },
    {
      label: "设备编号",
      prop: "device_no",
      minWidth: 120,
      align: "left"
    },
    {
      label: "品牌",
      prop: "brand",
      minWidth: 100,
      align: "left"
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      align: "center",
      slot: "status"
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
    // 防止重复请求
    if (loading.value) return;

    loading.value = true;
    try {
      // 构建查询参数，过滤掉 undefined 和空值
      const params: any = {
        page_index: pagination.currentPage,
        page_size: pagination.pageSize,
        is_all_list: 1
      };

      if (form.device_type_id) {
        params.device_type_id = form.device_type_id;
      }
      if (form.room_id) {
        params.room_id = form.room_id;
      }
      if (form.device_barcode && form.device_barcode.trim()) {
        params.device_barcode = form.device_barcode.trim();
      }

      const response = await deviceApi.getDeviceList(params);

      if (response && response.code === 200 && response.data) {
        dataList.value = response.data.list || [];
        pagination.total = response.data.count || 0;
      }
    } catch (error) {
      console.error("获取设备列表失败:", error);
      message("获取设备列表失败", { type: "error" });
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

  // 获取设备类型列表 - 优化：只获取一次，缓存结果
  async function getDeviceTypeList() {
    // 如果已有数据，不再重复请求
    if (deviceTypeOptions.value.length > 0) return;

    try {
      const response = await deviceApi.getDeviceTypeList();
      if (response && response.code === 200 && response.data) {
        deviceTypeOptions.value = response.data;
      }
    } catch (error) {
      console.error("获取设备类型列表失败:", error);
    }
  }

  // 获取房间列表 - 优化：只获取一次，缓存结果
  async function getRoomList() {
    // 如果已有数据，不再重复请求
    if (roomOptions.value.length > 0) return;

    try {
      const response = await roomApi.getRoomList({});
      if (
        response &&
        response.code === 200 &&
        response.data &&
        response.data.list
      ) {
        roomOptions.value = response.data.list.map((item: any) => ({
          room_id: item.room_id,
          room_name: item.room_name
        }));
      }
    } catch (error) {
      console.error("获取房间列表失败:", error);
    }
  }

  // 获取离心机类型列表 - 优化：只获取一次，缓存结果
  async function getCentrifugeTypeList() {
    // 如果已有数据，不再重复请求
    if (centrifugeTypeOptions.value.length > 0) return;

    try {
      const response = await deviceApi.getCentrifugeTypeList();
      if (response && response.code === 200 && response.data) {
        centrifugeTypeOptions.value = response.data.map((item: any) => ({
          dictValue: item.dictValue,
          dictLabel: item.dictLabel
        }));
      }
    } catch (error) {
      console.error("获取离心机类型列表失败:", error);
    }
  }

  // 获取试管类型列表 - 优化：只获取一次，缓存结果
  async function getTransferTypeList() {
    // 如果已有数据，不再重复请求
    if (transferTypeOptions.value.length > 0) return;

    try {
      const response = await deviceApi.getTransferTypeList();
      if (response && response.code === 200 && response.data) {
        transferTypeOptions.value = response.data.map((item: any) => ({
          dictValue: item.dictValue,
          dictLabel: item.dictLabel
        }));
      }
    } catch (error) {
      console.error("获取试管类型列表失败:", error);
    }
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}设备`,
      props: {
        formInline: {
          device_id: row?.device_id ?? undefined,
          device_name: row?.device_name ?? "",
          device_barcode: row?.device_barcode ?? "",
          device_type_id: row?.device_type_id ?? undefined,
          device_type_code: row?.device_type_code ?? "",
          room_id: row?.room_id ?? undefined,
          device_model: row?.device_model ?? "",
          device_no: row?.device_no ?? "",
          brand: row?.brand ?? "",
          sort: row?.sort ?? 1, // 新增时默认为1
          status: row?.status ?? 1,
          // 离心机相关字段
          centrifuge_type_id: row?.centrifuge_type_id ?? undefined,
          centrifuge_type_name: row?.centrifuge_type_name ?? "",
          // 冰箱相关字段
          ref_run_temperature: row?.ref_run_temperature ?? undefined,
          transfer_types: row?.transfer_types ?? "",
          // 盒子相关字段
          rows: row?.rows ?? undefined,
          columns: row?.columns ?? undefined
        },
        deviceTypeOptions: deviceTypeOptions.value,
        roomOptions: roomOptions.value,
        centrifugeTypeOptions: centrifugeTypeOptions.value,
        transferTypeOptions: transferTypeOptions.value
      },
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(editForm, {
          ref: formRef,
          formInline: options.props.formInline,
          deviceTypeOptions: options.props.deviceTypeOptions,
          roomOptions: options.props.roomOptions,
          centrifugeTypeOptions: options.props.centrifugeTypeOptions,
          transferTypeOptions: options.props.transferTypeOptions
        }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = formRef.value.formInline as FormItemProps;

        FormRef.validate(async valid => {
          if (valid) {
            try {
              let response;
              // 构建基础数据
              const baseData: any = {
                device_name: curData.device_name,
                device_barcode: curData.device_barcode,
                device_type_id: curData.device_type_id,
                room_id: curData.room_id,
                sort: curData.sort || 1,
                status: curData.status
              };

              // 根据设备类型添加特定字段
              if (curData.device_type_code === "centrifuge") {
                // 离心机：离心机类型、仪器编码、设备型号
                baseData.centrifuge_type_id = curData.centrifuge_type_id;
                baseData.centrifuge_type_name = curData.centrifuge_type_name;
                baseData.device_no = curData.device_no;
                baseData.device_model = curData.device_model;
              } else if (curData.device_type_code === "fridge") {
                // 冰箱：温度、仪器编码、设备型号、试管类型
                baseData.ref_run_temperature = curData.ref_run_temperature;
                baseData.device_no = curData.device_no;
                baseData.device_model = curData.device_model;
                // 将数组转换为逗号分隔的字符串
                baseData.transfer_types = Array.isArray(curData.transfer_types)
                  ? curData.transfer_types.join(",")
                  : curData.transfer_types || "";
              } else if (curData.device_type_code === "box") {
                // 盒子：行、列
                baseData.rows = curData.rows;
                baseData.columns = curData.columns;
              } else {
                // 其他类型：设备型号、设备编号、品牌
                baseData.device_model = curData.device_model;
                baseData.device_no = curData.device_no;
                baseData.brand = curData.brand;
              }

              if (!curData.device_id) {
                // 新增设备
                response = await deviceApi.addDevice(baseData);
              } else {
                // 修改设备
                response = await deviceApi.updateDevice({
                  device_id: curData.device_id,
                  ...baseData
                });
              }

              if (response?.code === 200) {
                message(
                  `您${title}了设备名称为${curData.device_name}的这条数据`,
                  {
                    type: "success"
                  }
                );
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              } else {
                message(response?.msg || `${title}设备失败`, { type: "error" });
              }
            } catch (error) {
              console.error(`${title}设备失败:`, error);
              message(`${title}设备失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function handleShowStoreList(row: FormItemProps) {
    if (!row.device_id) {
      message("设备ID不存在", { type: "error" });
      return;
    }

    currentDevice.value = row;
    storeListDrawerVisible.value = true;
    // 重置分页
    storeListPagination.currentPage = 1;
    storeListPagination.total = 0;
    // 加载层列表和储位列表
    await Promise.all([loadFloorList(), loadStoreList()]);
  }

  // 加载层列表
  async function loadFloorList() {
    if (!currentDevice.value?.device_id) return;

    try {
      const response = await deviceApi.getFloorList({
        parent_id: currentDevice.value.device_id,
        device_type_code: "floor",
        is_floor: 1,
        page_size: 999
      });

      if (response && response.code === 200 && response.data) {
        floorList.value = (response.data.list || []).map((item: any) => ({
          device_id: item.device_id,
          device_name: item.device_name,
          floors: item.floors || 0
        }));
      } else {
        floorList.value = [];
      }
    } catch (error) {
      console.error("获取层列表失败:", error);
      floorList.value = [];
    }
  }

  // 加载储位列表
  async function loadStoreList() {
    if (!currentDevice.value?.device_id) return;

    storeListLoading.value = true;
    try {
      const response = await deviceApi.getStoreList({
        page_index: storeListPagination.currentPage,
        page_size: storeListPagination.pageSize,
        is_all_list: 1,
        fridge_id: currentDevice.value.device_id,
        device_type_code: "store",
        is_store: 1
      });

      if (response && response.code === 200 && response.data) {
        storeListData.value = response.data.list || [];
        storeListPagination.total = response.data.count || 0;
      } else {
        storeListData.value = [];
        storeListPagination.total = 0;
        message(response?.msg || "获取储位列表失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取储位列表失败:", error);
      storeListData.value = [];
      storeListPagination.total = 0;
      message("获取储位列表失败", { type: "error" });
    } finally {
      storeListLoading.value = false;
    }
  }

  // 储位列表分页大小变化
  function handleStoreListSizeChange(val: number) {
    storeListPagination.pageSize = val;
    storeListPagination.currentPage = 1;
    loadStoreList();
  }

  // 储位列表当前页变化
  function handleStoreListCurrentChange(val: number) {
    storeListPagination.currentPage = val;
    loadStoreList();
  }

  function openStoreDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}储位`,
      props: {
        formInline: {
          device_id: row?.device_id ?? undefined,
          device_name: row?.device_name ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(storeForm, {
          ref: storeFormRef,
          formInline: options.props.formInline,
          isEdit: title !== "新增",
          floorList: floorList.value
        }),
      beforeSure: async (done, { options }) => {
        const FormRef = storeFormRef.value.getRef();
        const curData = storeFormRef.value.formInline;
        FormRef.validate(async valid => {
          if (valid) {
            try {
              let response;
              if (title === "新增") {
                // 参考 store.vue 的逻辑：使用快速创建储位接口
                const data: any = {
                  is_quick_create_store: true,
                  rows: curData.rows,
                  columns: curData.columns
                };

                // 如果选择了已有层，在已有层下创建储位
                if (curData.parent_id && curData.parent_id > 0) {
                  data.parent_id = curData.parent_id;
                  data.is_store = 1;
                  // 从层列表中获取对应的层数
                  const floor = floorList.value.find(
                    item => item.device_id === curData.parent_id
                  );
                  if (floor) {
                    data.floors = floor.floors;
                  }
                } else {
                  // 如果没有选择层，创建新层并在该层下创建储位
                  data.is_floor = 1;
                  data.parent_id = currentDevice.value?.device_id || 0;
                  data.floors = curData.floors;
                }

                // 调用设备新增接口（不是 addStore）
                response = await deviceApi.addDevice(data);

                if (response?.code === 200) {
                  // 如果创建了新层，需要刷新层列表
                  if (data.is_floor) {
                    await loadFloorList();
                  }
                  // 刷新储位列表
                  await refreshStoreList();
                  message(`您${title}了储位数据`, {
                    type: "success"
                  });
                  done(); // 关闭弹框
                } else {
                  message(response?.msg || `${title}储位失败`, {
                    type: "error"
                  });
                }
              } else {
                // 编辑时调用设备更新接口，参照 store.vue 的逻辑
                const data: any = {
                  ...curData,
                  fridge_id: currentDevice.value?.device_id || 0
                };

                response = await deviceApi.updateDevice(data);
                if (response?.code === 200) {
                  // 刷新储位列表
                  await refreshStoreList();
                  message(
                    `您${title}了储位名称为${curData.device_name}的这条数据`,
                    {
                      type: "success"
                    }
                  );
                  done(); // 关闭弹框
                } else {
                  message(response?.msg || `${title}储位失败`, {
                    type: "error"
                  });
                }
              }
            } catch (error) {
              console.error(`${title}储位失败:`, error);
              message(`${title}储位失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function refreshStoreList() {
    // 重新加载当前页的储位列表
    await loadStoreList();
  }

  // 删除层
  async function handleDeleteFloor(floorId: number, floorName: string) {
    ElMessageBox.confirm(
      `确认要删除<strong style='color:var(--el-color-primary)'>${floorName}</strong>层吗?删除后无法恢复！`,
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
        const response = await deviceApi.deleteDevice(floorId);
        if (response?.code === 200) {
          message(`已删除层名称为${floorName}的这条数据`, {
            type: "success"
          });
          // 刷新层列表和储位列表
          await Promise.all([loadFloorList(), refreshStoreList()]);
        } else {
          message(response?.msg || "删除层失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消操作
      });
  }

  async function handleSwitchStatus(
    row: FormItemProps,
    newStatus: number
  ): Promise<boolean> {
    (row as any).statusLoading = true;
    if (!row.device_id) {
      message("设备ID不存在", { type: "error" });
      return false;
    }

    try {
      const response = await deviceApi.switchStatus(row.device_id);
      if (response?.code === 200) {
        message(
          `已${newStatus === 1 ? "启用" : "停用"}设备名称为${row.device_name}的这条数据`,
          {
            type: "success"
          }
        );
        onSearch(); // 刷新列表
        return true; // 允许状态改变
      } else {
        message(response?.msg || "状态切换失败", {
          type: "error"
        });
        return false; // 阻止状态改变
      }
    } catch (error) {
      console.error("切换状态失败:", error);
      message("状态切换失败", {
        type: "error"
      });
      return false; // 阻止状态改变
    } finally {
      (row as any).statusLoading = false;
    }
  }

  async function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除<strong style='color:var(--el-color-primary)'>${
        row.device_name
      }</strong>设备吗?删除后无法恢复！`,
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
        const response = await deviceApi.deleteDevice(row.device_id);
        if (response?.code === 200) {
          message(`已删除设备名称为${row.device_name}的这条数据`, {
            type: "success"
          });
          onSearch();
        } else {
          message(response?.msg || "删除设备失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消操作
      });
  }

  onMounted(async () => {
    // 并行加载初始数据，提升性能
    await Promise.all([
      getDeviceTypeList(),
      getRoomList(),
      getCentrifugeTypeList(),
      getTransferTypeList()
    ]);
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
    deviceTypeOptions,
    roomOptions,
    centrifugeTypeOptions,
    transferTypeOptions,
    storeListDrawerVisible,
    storeListData,
    storeListLoading,
    storeListPagination,
    currentDevice,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改设备 */
    openDialog,
    /** 删除设备 */
    handleDelete,
    /** 切换设备状态 */
    handleSwitchStatus,
    /** 显示储位列表 */
    handleShowStoreList,
    /** 新增、修改储位 */
    openStoreDialog,
    /** 刷新储位列表 */
    refreshStoreList,
    /** 储位列表分页大小变化 */
    handleStoreListSizeChange,
    /** 储位列表当前页变化 */
    handleStoreListCurrentChange,
    /** 删除层 */
    handleDeleteFloor,
    handleSelectionChange,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange
  };
}
