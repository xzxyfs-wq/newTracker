import { ref, type Ref, computed } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { h } from "vue";
import projectApi from "@/api/projectManagement";
import planForm from "../planForm.vue";
import planConfig from "../planConfig.vue";

/**
 * 项目方案相关逻辑
 */
export function useProjectPlan(
  projectId: Ref<number | undefined> | (() => number | undefined)
) {
  // 如果是函数，转换为 computed
  const projectIdRef =
    typeof projectId === "function" ? computed(projectId) : projectId;
  // 项目方案列表（用于表格显示）
  const projectPlanList = ref<any[]>([]);
  // 项目方案原始数据（用于拷贝方案选择）
  const projectPlanRawList = ref<any[]>([]);

  /**
   * 加载项目方案列表
   */
  async function loadProjectPlans() {
    if (!projectIdRef.value) return;

    try {
      const response = await projectApi.getProjectPlans(projectIdRef.value);
      if (response && response.code === 200 && response.data) {
        // 处理返回的数据，可能是数组或包含list的对象
        const plansData = Array.isArray(response.data)
          ? response.data
          : response.data.list || [];

        // 保存原始数据用于拷贝方案选择
        projectPlanRawList.value = plansData;
        // 将API返回的数据映射到表格显示的格式
        projectPlanList.value = plansData.map((item: any) => ({
          id: item.project_plan_id,
          project_plan_id: item.project_plan_id,
          plan_name: item.plan_no || `方案${item.plan_version}`,
          plan_desc: item.project_name || "",
          plan_no: item.plan_no,
          plan_version: item.plan_version,
          is_active: item.is_active,
          create_username: item.create_username,
          created_at: item.created_at
        }));
      } else {
        projectPlanList.value = [];
        projectPlanRawList.value = [];
        console.warn("获取项目方案列表失败:", response?.msg);
      }
    } catch (error) {
      console.error("加载项目方案失败:", error);
      projectPlanList.value = [];
      projectPlanRawList.value = [];
    }
  }

  /**
   * 新增方案
   */
  function handleAddPlan() {
    const formRef = ref();
    const formData = {
      plan_no: "",
      pk_plan_no: "",
      copy_project_plan_id: undefined
    };

    addDialog({
      title: "新增方案",
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(planForm, {
          ref: formRef,
          formInline: formData,
          projectId: projectIdRef.value,
          existingPlans: projectPlanRawList.value
        }),
      beforeSure: done => {
        const FormRef = formRef.value.getRef();
        const FormData = formRef.value.formInline;

        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const response = await projectApi.addProjectPlan({
                project_id: projectIdRef.value!,
                plan_no: String(FormData.plan_no || ""),
                pk_plan_no: FormData.pk_plan_no || "",
                copy_project_plan_id: FormData.copy_project_plan_id
              });

              if (response?.code === 200) {
                message("新增方案成功", { type: "success" });
                done();
                await loadProjectPlans();
              } else {
                message(response?.msg || "新增方案失败", { type: "error" });
              }
            } catch (error) {
              console.error("新增方案失败:", error);
              message("新增方案失败", { type: "error" });
            }
          }
        });
      }
    });
  }

  /**
   * 编辑方案
   */
  function handleEditPlan(row: any) {
    const formRef = ref();
    // 从原始数据中找到对应的方案数据
    const rawPlan = projectPlanRawList.value.find(
      item => item.project_plan_id === row.project_plan_id
    );

    const formData = {
      project_plan_id: row.project_plan_id,
      plan_no: rawPlan?.plan_no || row.plan_no || "",
      pk_plan_no: rawPlan?.pk_plan_no || "",
      copy_project_plan_id: rawPlan?.copy_project_plan_id
    };

    addDialog({
      title: "编辑方案",
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(planForm, {
          ref: formRef,
          formInline: formData,
          projectId: projectIdRef.value,
          existingPlans: projectPlanRawList.value,
          isEdit: true
        }),
      beforeSure: done => {
        const FormRef = formRef.value.getRef();
        const FormData = formRef.value.formInline;

        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const response = await projectApi.updateProjectPlan({
                project_plan_id: row.project_plan_id,
                project_id: projectIdRef.value!,
                plan_no: String(FormData.plan_no || ""),
                pk_plan_no: FormData.pk_plan_no || ""
              });

              if (response?.code === 200) {
                message("编辑方案成功", { type: "success" });
                done();
                await loadProjectPlans();
              } else {
                message(response?.msg || "编辑方案失败", { type: "error" });
              }
            } catch (error) {
              console.error("编辑方案失败:", error);
              message("编辑方案失败", { type: "error" });
            }
          }
        });
      }
    });
  }

  /**
   * 删除方案
   */
  function handleDeletePlan(row: any, index: number) {
    projectPlanList.value.splice(index, 1);
  }

  /**
   * 打开方案配置对话框
   */
  function handleConfigPlan(row: any) {
    addDialog({
      title: `方案配置 - ${row.plan_name}`,
      width: "100%",
      class: "flex flex-col plan-config-dialog",
      hideFooter: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(planConfig, {
          plan: row,
          projectId: projectIdRef.value
        })
    });
  }

  return {
    projectPlanList,
    projectPlanRawList,
    loadProjectPlans,
    handleAddPlan,
    handleEditPlan,
    handleDeletePlan,
    handleConfigPlan
  };
}
