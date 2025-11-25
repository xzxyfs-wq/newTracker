<script setup lang="ts">
import { ref } from "vue";
import PlanTab from "./PlanTab.vue";
import SlotTab from "./SlotTab.vue";
import ProjectUserTab from "./ProjectUserTab.vue";

defineOptions({
  name: "ProjectConfig"
});

const props = defineProps<{
  projectId?: number;
  projectName?: string;
}>();

// 当前激活的 tab
const activeTab = ref("plan");

// Tab 组件引用（用于手动刷新数据）
const planTabRef = ref<InstanceType<typeof PlanTab>>();
const slotTabRef = ref<InstanceType<typeof SlotTab>>();
const projectUserTabRef = ref<InstanceType<typeof ProjectUserTab>>();

function getRef() {
  return null;
}

function getFormData() {
  return {
    // 可以从各个 Tab 组件获取数据
  };
}

defineExpose({ getRef, getFormData });
</script>

<template>
  <div class="project-config">
    <el-tabs v-model="activeTab">
      <!-- 项目方案 Tab -->
      <el-tab-pane label="项目方案" name="plan">
        <PlanTab ref="planTabRef" :project-id="projectId" />
      </el-tab-pane>

      <!-- 受试者编号 Tab -->
      <el-tab-pane label="受试者编号" name="subject">
        <SlotTab ref="slotTabRef" :project-id="projectId" />
      </el-tab-pane>

      <!-- 项目人员 Tab -->
      <el-tab-pane label="项目人员" name="user">
        <ProjectUserTab ref="projectUserTabRef" :project-id="projectId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.project-config {
  padding: 0;
}

.tab-content {
  padding: 0;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tabs__content) {
  padding: 0;
}
</style>
<style lang="scss">
.plan-config-dialog {
  .el-dialog__body {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
