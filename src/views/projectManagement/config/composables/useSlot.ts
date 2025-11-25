import { ref, type Ref, computed, reactive } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { h } from "vue";
import projectApi from "@/api/projectManagement";
import slotForm from "../slotForm.vue";
import { getSlotTypeLabel } from "../utils/helpers";

/**
 * Slot 相关逻辑
 */
export function useSlot(projectId: Ref<number | undefined> | (() => number | undefined)) {
  // 如果是函数，转换为 computed
  const projectIdRef = typeof projectId === 'function' ? computed(projectId) : projectId;
  // Slot 列表
  const slotList = ref<any[]>([]);
  // Slot 分页
  const slotPagination = ref({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const slotLoading = ref(false);
  
  // 查询表单
  const searchForm = reactive({
    slot_no: "",
    slot_type: undefined as number | undefined,
    start_date: "",
    end_date: ""
  });
  
  // 编号类型选项
  const slotTypeOptions = ref<Array<{ label: string; value: number }>>([]);
  
  // 加载编号类型字典
  async function loadSlotTypeDict() {
    try {
      const response = await projectApi.getSlotTypeDict();
      if (response?.success && response?.data) {
        slotTypeOptions.value = response.data.map((item: any) => ({
          label: item.dictLabel,
          value: Number(item.dictValue)
        }));
      }
    } catch (error) {
      console.error("加载编号类型字典失败:", error);
    }
  }
  
  // 初始化时加载字典
  loadSlotTypeDict();

  /**
   * 加载 Slot 列表
   */
  async function loadSlots(page = 1, pageSize = 10) {
    if (!projectIdRef.value) return;

    slotLoading.value = true;
    try {
      // 构建查询参数
      const queryParams: any = {
        currentPage: page,
        pageSize: pageSize
      };
      
      // 添加查询条件
      if (searchForm.slot_no) {
        queryParams.slot_no = searchForm.slot_no;
      }
      if (searchForm.slot_type !== undefined) {
        queryParams.slot_type = searchForm.slot_type;
      }
      if (searchForm.start_date) {
        queryParams.start_date = searchForm.start_date;
      }
      if (searchForm.end_date) {
        queryParams.end_date = searchForm.end_date;
      }
      
      const slotResponse = await projectApi.getSlots(projectIdRef.value, queryParams);
      if (slotResponse?.success) {
        if (slotResponse?.data?.list) {
          // 分页数据格式
          slotList.value = slotResponse.data.list.map((item: any) => ({
            slot_id: item.slot_id,
            slot_no: item.slot_no,
            slot_type: item.slot_type,
            format: item.format,
            generate_count: item.generate_count ?? 1,
            is_use: item.is_use,
            project_id: item.project_id,
            created_at: item.created_at,
            updated_at: item.updated_at
          }));
          slotPagination.value = {
            total: slotResponse.data.total || 0,
            pageSize: slotResponse.data.pageSize || pageSize,
            currentPage: slotResponse.data.currentPage || page,
            background: true
          };
        } else if (Array.isArray(slotResponse?.data)) {
          // 非分页数据格式（兼容旧格式）
          slotList.value = slotResponse.data.map((item: any) => ({
            slot_id: item.slot_id,
            slot_no: item.slot_no,
            slot_type: item.slot_type,
            format: item.format,
            generate_count: item.generate_count ?? 1,
            is_use: item.is_use,
            project_id: item.project_id,
            created_at: item.created_at,
            updated_at: item.updated_at
          }));
          slotPagination.value.total = slotResponse.data.length;
        }
      }
    } catch (error) {
      console.error("加载 Slot 失败:", error);
    } finally {
      slotLoading.value = false;
    }
  }

  /**
   * 分页处理：每页条数变化
   */
  function handleSizeChange(size: number) {
    slotPagination.value.pageSize = size;
    slotPagination.value.currentPage = 1; // 重置到第一页
    loadSlots(1, size);
  }

  /**
   * 分页处理：当前页变化
   */
  function handleCurrentChange(page: number) {
    slotPagination.value.currentPage = page;
    loadSlots(page, slotPagination.value.pageSize);
  }
  
  /**
   * 查询
   */
  function handleSearch() {
    slotPagination.value.currentPage = 1; // 重置到第一页
    loadSlots(1, slotPagination.value.pageSize);
  }
  
  /**
   * 重置查询
   */
  function handleReset() {
    searchForm.slot_no = "";
    searchForm.slot_type = undefined;
    searchForm.start_date = "";
    searchForm.end_date = "";
    slotPagination.value.currentPage = 1;
    loadSlots(1, slotPagination.value.pageSize);
  }

  /**
   * 新增 Slot
   */
  function handleAdd() {
    const formRef = ref();
    const formData = {
      slot_no: "",
      slot_type: -1,
      format: "",
      generate_count: 1
    };

    addDialog({
      title: "新增受试者编号配置",
      width: "50%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(slotForm, {
          ref: formRef,
          formInline: formData,
          projectId: projectIdRef.value
        }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();
        const FormData = formRef.value.formInline;

        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const generateMode = formRef.value.getGenerateMode();
              // 根据生成方式提交不同的属性
              const submitData: any = {
                project_id: projectIdRef.value,
                slot_type: FormData.slot_type
              };

              if (generateMode === "batch") {
                // 批量生成：提交格式和数量
                submitData.format = FormData.format;
                submitData.generate_count = FormData.generate_count;
              } else {
                // 手动输入：提交编号
                submitData.slot_no = FormData.slot_no;
              }

              const response = await projectApi.addSlot(submitData);

              if (response?.success) {
                message("新增受试者编号配置成功", { type: "success" });
                done();
                await loadSlots(
                  slotPagination.value.currentPage,
                  slotPagination.value.pageSize
                );
              }
            } catch (error) {
              console.error("新增受试者编号配置失败:", error);
              message("新增受试者编号配置失败", { type: "error" });
            }
          }
        });
      }
    });
  }

  /**
   * 删除 Slot
   */
  async function handleDelete(row: any) {
    try {
      const response = await projectApi.deleteSlot(row.slot_id);
      if (response?.success) {
        message("删除受试者编号配置成功", { type: "success" });
        await loadSlots(
          slotPagination.value.currentPage,
          slotPagination.value.pageSize
        );
      }
    } catch (error) {
      console.error("删除受试者编号配置失败:", error);
      message("删除受试者编号配置失败", { type: "error" });
    }
  }

  return {
    slotList,
    slotPagination,
    slotLoading,
    searchForm,
    slotTypeOptions,
    loadSlots,
    handleSizeChange,
    handleCurrentChange,
    handleSearch,
    handleReset,
    handleAdd,
    handleDelete,
    getSlotTypeLabel
  };
}

