<script setup lang="ts">
import { computed, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import Delete from "~icons/ep/delete";
import { useProjectUser } from "./composables/useProjectUser";

defineOptions({
  name: "ProjectUserTab"
});

const props = defineProps<{
  projectId?: number;
}>();

const {
  projectUserList,
  projectUserLoading,
  loadProjectUsers,
  handleAdd,
  handleDelete,
  handleUpdateDirector,
  handleUpdateAdminPermission
} = useProjectUser(computed(() => props.projectId));

// 监听 projectId 变化，自动加载数据
watch(
  () => props.projectId,
  newId => {
    if (newId) {
      loadProjectUsers();
    }
  },
  { immediate: true }
);

// 暴露方法供父组件调用
defineExpose({
  loadProjectUsers
});
</script>

<template>
  <div class="tab-content">
    <div class="table-header">
      <el-button
        type="primary"
        :icon="useRenderIcon(AddFill)"
        @click="handleAdd"
      >
        新增人员
      </el-button>
    </div>
    <el-table
      :data="projectUserList"
      :loading="projectUserLoading"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="nick_name" label="姓名" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column prop="created_at" label="创建时间" align="center" />
      <el-table-column label="项目管理者" align="center" width="120">
        <template #default="{ row }">
          <el-switch
            :model-value="row.is_director === 1"
            @change="(value: boolean) => handleUpdateDirector(row, value)"
          />
        </template>
      </el-table-column>
      <el-table-column label="代操作权限" align="center" width="120">
        <template #default="{ row }">
          <el-switch
            :model-value="row.admin_permission === 1"
            @change="
              (value: boolean) => handleUpdateAdminPermission(row, value)
            "
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            link
            :icon="useRenderIcon(Delete)"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.tab-content {
  padding: 0;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
