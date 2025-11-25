import { ref, type Ref, computed } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { h } from "vue";
import projectApi from "@/api/projectManagement";
import projectUserForm from "../ProjectUserForm.vue";

/**
 * 项目人员相关逻辑
 */
export function useProjectUser(
  projectId: Ref<number | undefined> | (() => number | undefined)
) {
  // 如果是函数，转换为 computed
  const projectIdRef =
    typeof projectId === "function" ? computed(projectId) : projectId;
  // 项目人员列表
  const projectUserList = ref<any[]>([]);
  const projectUserLoading = ref(false);

  /**
   * 加载项目人员列表
   */
  async function loadProjectUsers() {
    if (!projectIdRef.value) return;

    projectUserLoading.value = true;
    try {
      const response = await projectApi.getProjectUsers(projectIdRef.value);
      if (response?.success && response?.data) {
        projectUserList.value = response.data;
      }
    } catch (error) {
      console.error("加载项目人员失败:", error);
    } finally {
      projectUserLoading.value = false;
    }
  }

  /**
   * 新增项目人员
   */
  function handleAdd() {
    if (!projectIdRef.value) {
      message("请先选择项目", { type: "warning" });
      return;
    }

    const formRef = ref();

    addDialog({
      title: "新增项目人员",
      width: "520px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(projectUserForm, {
          ref: formRef,
          projectId: projectIdRef.value,
          existingUserIds: projectUserList.value.map(
            (user: any) => user.user_id
          )
        }),
      beforeSure: async done => {
        const FormRef = formRef.value;
        if (!FormRef) {
          done();
          return;
        }

        const success = await FormRef.handleSubmit();
        if (success) {
          done();
          await loadProjectUsers();
        }
      }
    });
  }

  /**
   * 更新项目管理者状态
   */
  async function handleUpdateDirector(row: any, value: boolean) {
    try {
      const response = await projectApi.updateProjectUser({
        project_user_id: row.project_user_id,
        is_director: value ? 1 : -1
      });
      if (response?.success) {
        message("更新项目管理者状态成功", { type: "success" });
        // 更新本地数据
        row.is_director = value ? 1 : -1;
      }
    } catch (error) {
      console.error("更新项目管理者状态失败:", error);
      message("更新项目管理者状态失败", { type: "error" });
      // 恢复原值
      await loadProjectUsers();
    }
  }

  /**
   * 更新代操作权限状态
   */
  async function handleUpdateAdminPermission(row: any, value: boolean) {
    try {
      const response = await projectApi.updateProjectUser({
        project_user_id: row.project_user_id,
        admin_permission: value ? 1 : -1
      });
      if (response?.success) {
        message("更新代操作权限状态成功", { type: "success" });
        // 更新本地数据
        row.admin_permission = value ? 1 : -1;
      }
    } catch (error) {
      console.error("更新代操作权限状态失败:", error);
      message("更新代操作权限状态失败", { type: "error" });
      // 恢复原值
      await loadProjectUsers();
    }
  }

  /**
   * 删除项目人员
   */
  async function handleDelete(row: any) {
    try {
      const response = await projectApi.deleteProjectUser(row.project_user_id);
      if (response?.success) {
        message("删除项目人员成功", { type: "success" });
        await loadProjectUsers();
      }
    } catch (error) {
      console.error("删除项目人员失败:", error);
      message("删除项目人员失败", { type: "error" });
    }
  }

  return {
    projectUserList,
    projectUserLoading,
    loadProjectUsers,
    handleAdd,
    handleUpdateDirector,
    handleUpdateAdminPermission,
    handleDelete
  };
}
