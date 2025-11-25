import dayjs from "dayjs";
import editForm from "../form/index.vue";
import projectConfig from "../config/index.vue";
import { message } from "@/utils/message";
import projectApi from "@/api/projectManagement";
import dictApi from "@/api/dict";
import { usePublicHooks } from "@/views/system/hooks";
import { addDialog } from "@/components/ReDialog";
import { addDrawer } from "@/components/ReDrawer";
import { reactive, ref, onMounted, h, nextTick } from "vue";
import type { FormItemProps } from "./types.ts";
import { cloneDeep, deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useProjectManagement() {
  const form = reactive({
    project_name: "",
    project_no: "",
    project_gcp_no: ""
  });

  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const loading = ref(false);
  const selectedNum = ref(0);
  const { tagStyle } = usePublicHooks();
  // 样本类型列表相关
  const sampleTypeDrawerVisible = ref(false);
  const sampleTypeListData = ref([]);
  const sampleTypeListLoading = ref(false);
  const currentProject = ref<FormItemProps | null>(null);
  const sampleTypeListPagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 项目状态字典数据
  const projectStatusOptions = ref<
    Array<{ dictValue: number; dictLabel: string }>
  >([]);

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
      label: "方案编号",
      prop: "project_gcp_no",
      minWidth: 120,
      align: "left"
    },
    {
      label: "项目编号",
      prop: "project_no",
      minWidth: 120,
      align: "left"
    },
    {
      label: "项目名称",
      prop: "project_name",
      minWidth: 180,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "申办方",
      prop: "project_sponsor",
      minWidth: 150,
      align: "left"
    },
    {
      label: "检测单位",
      prop: "testing_unit",
      minWidth: 150,
      align: "left"
    },
    {
      label: "项目开始日期",
      prop: "project_start_date",
      minWidth: 120,
      align: "center",
      formatter: ({ project_start_date }) =>
        project_start_date
          ? dayjs(project_start_date).format("YYYY-MM-DD")
          : "-"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        // 从字典数据中查找对应的状态标签
        const statusValue =
          typeof row.status === "string" ? Number(row.status) : row.status;
        const statusItem = projectStatusOptions.value.find(
          item => item.dictValue === statusValue
        );
        const statusText = statusItem?.dictLabel || "未知";

        // 根据状态值设置标签类型
        const statusType =
          statusValue === 1
            ? "success"
            : statusValue === -1
              ? "danger"
              : statusValue === 3
                ? "warning"
                : statusValue === 4
                  ? "info"
                  : "";
        return (
          <el-tag size={props.size} type={statusType}>
            {statusText}
          </el-tag>
        );
      }
    },
    {
      label: "创建人",
      prop: "create_username",
      minWidth: 120,
      align: "left"
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
      // 构建查询参数
      const params: any = {
        page_index: pagination.currentPage,
        page_size: pagination.pageSize,
        is_all_list: 1
      };

      if (form.project_name && form.project_name.trim()) {
        params.project_name = form.project_name.trim();
      }
      if (form.project_no && form.project_no.trim()) {
        params.project_no = form.project_no.trim();
      }
      if (form.project_gcp_no && form.project_gcp_no.trim()) {
        params.project_gcp_no = form.project_gcp_no.trim();
      }

      const response = await projectApi.getProjectList(params);

      if (response && response.code === 200 && response.data) {
        dataList.value = response.data.list || [];
        pagination.total = response.data.count || response.data.total || 0;
      } else {
        dataList.value = [];
        pagination.total = 0;
        message(response?.msg || "获取项目列表失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取项目列表失败:", error);
      message("获取项目列表失败", { type: "error" });
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

  async function openDialog(title = "新增", row?: FormItemProps) {
    // 确保字典数据已加载
    await getProjectStatusList();

    const formData = {
      project_id: row?.project_id ?? undefined,
      project_no: row?.project_no ?? "",
      project_gcp_no: row?.project_gcp_no ?? "",
      project_name: row?.project_name ?? "",
      project_desc: row?.project_desc ?? "",
      project_sponsor: row?.project_sponsor ?? "",
      testing_unit: row?.testing_unit ?? "",
      project_start_date: row?.project_start_date ?? "",
      ae_version_value: row?.ae_version_value ?? "",
      status: row?.status ?? undefined,
      pi: row?.pi ?? "",
      research_site_name: row?.research_site_name ?? "",
      research_site_no: row?.research_site_no ?? ""
    };

    addDialog({
      title: `${title}项目`,
      props: {
        formInline: formData
      },
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          formInline: formData,
          projectStatusOptions: projectStatusOptions.value
        } as any),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const FormData = formRef.value.formInline as FormItemProps;
        function chores() {
          message(`您${title}了项目名称为${FormData.project_name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              let response;
              if (title === "新增") {
                // 新增项目
                response = await projectApi.addProject({
                  project_no: FormData.project_no,
                  project_gcp_no: FormData.project_gcp_no,
                  project_name: FormData.project_name,
                  project_desc: FormData.project_desc,
                  project_sponsor: FormData.project_sponsor,
                  testing_unit: FormData.testing_unit,
                  project_start_date: FormData.project_start_date,
                  ae_version_value: FormData.ae_version_value,
                  status: FormData.status,
                  pi: FormData.pi,
                  research_site_name: FormData.research_site_name,
                  research_site_no: FormData.research_site_no
                });
              } else {
                // 修改项目
                response = await projectApi.updateProject({
                  project_id: FormData.project_id!,
                  project_no: FormData.project_no,
                  project_gcp_no: FormData.project_gcp_no,
                  project_name: FormData.project_name,
                  project_desc: FormData.project_desc,
                  project_sponsor: FormData.project_sponsor,
                  testing_unit: FormData.testing_unit,
                  project_start_date: FormData.project_start_date,
                  ae_version_value: FormData.ae_version_value,
                  status: FormData.status,
                  pi: FormData.pi,
                  research_site_name: FormData.research_site_name,
                  research_site_no: FormData.research_site_no
                });
              }

              if (response?.code === 200) {
                chores();
              } else {
                message(response?.msg || `${title}项目失败`, { type: "error" });
              }
            } catch (error) {
              console.error(`${title}项目失败:`, error);
              message(`${title}项目失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  function openConfigDrawer(row: FormItemProps) {
    const configRef = ref();
    addDrawer({
      title: `项目配置 - ${row.project_name}`,
      size: "85%",
      hideFooter: true,
      class: "project-config-drawer",
      contentRenderer: () =>
        h(projectConfig, {
          ref: configRef,
          projectId: row.project_id,
          projectName: row.project_name
        }),
      beforeSure: (done, { closeLoading }) => {
        // 使用 nextTick 确保 ref 已经挂载
        nextTick(() => {
          const configData = configRef.value?.getFormData();
          console.log("项目配置数据:", configData);
          // TODO: 调用API保存项目配置
          message("项目配置保存成功", { type: "success" });
          setTimeout(() => done(), 300);
        });
      }
    });
  }

  function handleDelete(row: FormItemProps) {
    ElMessageBox.confirm(`确定要删除项目"${row.project_name}"吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        try {
          if (!row.project_id) {
            message("项目ID不存在", { type: "error" });
            return;
          }

          const response = await projectApi.deleteProject(row.project_id);
          if (response?.code === 200) {
            message("删除成功", { type: "success" });
            onSearch(); // 刷新列表
          } else {
            message(response?.msg || "删除失败", { type: "error" });
          }
        } catch (error) {
          console.error("删除项目失败:", error);
          message("删除项目失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消删除
      });
  }

  // 获取项目状态字典数据
  async function getProjectStatusList() {
    // 如果已有数据，不再重复请求
    if (projectStatusOptions.value.length > 0) {
      console.log("项目状态字典数据已存在，跳过请求");
      return;
    }

    try {
      console.log("开始获取项目状态字典数据...");
      const response = await dictApi.getDictByType("project_status_map");
      console.log("项目状态字典接口响应:", response);

      if (response && response.code === 200 && response.data) {
        projectStatusOptions.value = response.data.map((item: any) => ({
          dictValue: Number(item.dictValue),
          dictLabel: item.dictLabel
        }));
        console.log("项目状态字典数据已设置:", projectStatusOptions.value);
      } else {
        console.warn("项目状态字典数据格式异常:", response);
      }
    } catch (error) {
      console.error("获取项目状态字典失败:", error);
    }
  }

  // 加载样本类型列表
  async function loadSampleTypeList() {
    if (!currentProject.value?.project_id) return;

    sampleTypeListLoading.value = true;
    try {
      const response = await projectApi.getSampleTypeList({
        project_id: currentProject.value.project_id,
        page_index: sampleTypeListPagination.currentPage,
        page_size: sampleTypeListPagination.pageSize
      });

      if (response && response.code === 200 && response.data) {
        sampleTypeListData.value = response.data.list || [];
        sampleTypeListPagination.total =
          response.data.count || response.data.total || 0;
      } else {
        sampleTypeListData.value = [];
        sampleTypeListPagination.total = 0;
        message(response?.msg || "获取样本类型列表失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取样本类型列表失败:", error);
      sampleTypeListData.value = [];
      sampleTypeListPagination.total = 0;
      message("获取样本类型列表失败", { type: "error" });
    } finally {
      sampleTypeListLoading.value = false;
    }
  }

  // 样本类型列表分页大小变化
  function handleSampleTypeListSizeChange(val: number) {
    sampleTypeListPagination.pageSize = val;
    sampleTypeListPagination.currentPage = 1;
    loadSampleTypeList();
  }

  // 样本类型列表当前页变化
  function handleSampleTypeListCurrentChange(val: number) {
    sampleTypeListPagination.currentPage = val;
    loadSampleTypeList();
  }

  // 打开样本类型列表抽屉
  async function openSampleTypeDrawer(row: FormItemProps) {
    currentProject.value = row;
    sampleTypeListPagination.currentPage = 1;
    sampleTypeListPagination.total = 0;
    sampleTypeDrawerVisible.value = true;
    await loadSampleTypeList();
  }

  onMounted(async () => {
    // 并行获取数据
    await Promise.all([getProjectStatusList(), onSearch()]);
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    tableRef,
    formRef,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改项目 */
    openDialog,
    /** 打开项目配置抽屉 */
    openConfigDrawer,
    /** 打开样本类型列表抽屉 */
    openSampleTypeDrawer,
    /** 删除项目 */
    handleDelete,
    handleSelectionChange,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    // 样本类型列表相关
    sampleTypeDrawerVisible,
    sampleTypeListData,
    sampleTypeListLoading,
    currentProject,
    sampleTypeListPagination,
    handleSampleTypeListSizeChange,
    handleSampleTypeListCurrentChange
  };
}
