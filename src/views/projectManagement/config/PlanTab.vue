<script setup lang="ts">
import { computed, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import Setting from "~icons/ep/setting";
import { useProjectPlan } from "./composables/useProjectPlan";

defineOptions({
  name: "PlanTab"
});

const props = defineProps<{
  projectId?: number;
}>();

const {
  projectPlanList,
  loadProjectPlans,
  handleAddPlan,
  handleEditPlan,
  handleDeletePlan,
  handleConfigPlan
} = useProjectPlan(computed(() => props.projectId));

// 监听 projectId 变化，自动加载数据
watch(
  () => props.projectId,
  newId => {
    if (newId) {
      loadProjectPlans();
    }
  },
  { immediate: true }
);

// 暴露方法供父组件调用
defineExpose({
  loadProjectPlans
});
</script>

<template>
  <div class="tab-content">
    <div class="table-header">
      <el-button
        type="primary"
        :icon="useRenderIcon(AddFill)"
        @click="handleAddPlan"
      >
        新增方案
      </el-button>
    </div>
    <el-table :data="projectPlanList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="plan_no" label="版本号" min-width="150" />
      <el-table-column
        prop="pk_plan_no"
        show-overflow-tooltip
        label="备注"
        min-width="200"
      />
      <el-table-column
        label="应用状态"
        :formatter="row => (row.is_use === -1 ? '未应用' : '已应用')"
        min-width="120"
      />
      <el-table-column
        label="签名状态"
        :formatter="
          row =>
            row.sign_by > 0
              ? '已签名'
              : row.cancel_by > 0
                ? '签名已撤销'
                : '未签名'
        "
        min-width="120"
      />
      <el-table-column prop="created_at" label="创建时间" min-width="155" />
      <el-table-column prop="create_username" label="创建人" min-width="120" />
      <el-table-column prop="updated_at" label="修改时间" min-width="155" />
      <el-table-column prop="update_username" label="修改人" min-width="120" />
      <el-table-column prop="review_time" label="复核时间" min-width="155" />
      <el-table-column prop="review_username" label="复核人" min-width="120" />
      <el-table-column prop="sign_time" label="签名时间" min-width="155" />
      <el-table-column prop="sign_username" label="签名人" min-width="120" />
      <el-table-column prop="cancel_time" label="撤销时间" min-width="155" />
      <el-table-column prop="cancel_username" label="撤销人" min-width="120" />
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            link
            :icon="useRenderIcon(Setting)"
            @click="handleConfigPlan(row)"
          >
            方案配置
          </el-button>
          <el-button
            type="primary"
            size="small"
            link
            :icon="useRenderIcon(EditPen)"
            @click="handleEditPlan(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            link
            :icon="useRenderIcon(Delete)"
            @click="handleDeletePlan(row, $index)"
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
