<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { CustomMouseMenu } from "@howdyjs/mouse-menu";
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import Document from "~icons/ep/document";
import Folder from "~icons/ep/folder";
import ArrowLeft from "~icons/ep/arrow-left";
import ArrowRight from "~icons/ep/arrow-right";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import ArrowUp from "~icons/ep/arrow-up";
import ArrowDown from "~icons/ep/arrow-down";
import View from "~icons/ep/view";
import projectApi from "@/api/projectManagement";

defineOptions({
  name: "PlanConfig"
});

const props = defineProps<{
  plan?: any;
  projectId?: number;
}>();
console.log(props.plan);

// 左侧：周期/访视树状数据
const treeData = ref<any[]>([]);
const selectedNode = ref<any>(null);

// 中间：事件列表
const eventList = ref<any[]>([]);
const eventLoading = ref(false);

// 右侧：样本类型列表
const sampleTypeList = ref<any[]>([]);
// 右侧：药物列表
const drugList = ref<any[]>([]);

// SplitPane 配置 - 参照表单设计器布局
const leftSplitSet: ContextProps = reactive({
  minPercent: 15,
  defaultPercent: 15,
  split: "vertical"
});

const rightSplitSet: ContextProps = reactive({
  minPercent: 15,
  defaultPercent: 70, // 右侧面板默认占剩余空间的20%
  split: "vertical"
});

// 右键菜单相关（已移除，改用 CustomMouseMenu）

const treeLoading = ref(false);
// 根据周期/访视ID加载事件列表
async function loadProjectPlanTree() {
  try {
    treeLoading.value = true;
    const res = await projectApi.getProjectPlanTree(props.plan.project_plan_id);
    if (res?.code === 200) {
      treeData.value = res.data || [];
    } else {
      message(res?.msg || "加载周期/访视数据失败", { type: "error" });
    }
  } catch (error) {
    console.error("加载周期/访视数据失败:", error);
  } finally {
    treeLoading.value = false;
  }
}

async function loadEventList(data: any) {
  const { id, type } = data;
  eventLoading.value = true;
  try {
    let res;
    const params = {
      project_plan_id: props.plan.project_plan_id,
      project_id: props.projectId,
      cycle_id: id
    };
    if (type === "cycle") {
      res = await projectApi.getCycleEventList(params);
    } else {
      res = await projectApi.getVisitEventList(id);
    }
    if (res?.code === 200) {
      eventList.value = res.data || [];
    } else {
      message(res?.msg || "加载事件列表失败", { type: "error" });
    }
  } catch (error) {
    console.error("加载事件列表失败:", error);
  } finally {
    eventLoading.value = false;
  }
}

// 加载样本类型列表
async function loadSampleTypeList() {
  try {
    // TODO: 调用API获取样本类型列表
    sampleTypeList.value = [
      { id: 1, name: "血液", code: "BLOOD" },
      { id: 2, name: "尿液", code: "URINE" }
    ];
  } catch (error) {
    console.error("加载样本类型列表失败:", error);
  }
}

// 加载药物列表
async function loadDrugList() {
  try {
    // TODO: 调用API获取药物列表
    drugList.value = [
      { id: 1, name: "药物A", dosage: "100mg" },
      { id: 2, name: "药物B", dosage: "200mg" }
    ];
  } catch (error) {
    console.error("加载药物列表失败:", error);
  }
}

// 树节点点击事件
function handleNodeClick(data: any) {
  selectedNode.value = data;
  loadEventList(data);
}

// 新增周期
async function handleAddCycle() {
  try {
    const { value } = await ElMessageBox.prompt("请输入周期名称", "新增周期", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /.+/,
      inputErrorMessage: "周期名称不能为空"
    });

    if (value) {
      // 生成新的周期ID（实际应该调用API）
      const maxCycleId =
        treeData.value.length > 0
          ? Math.max(...treeData.value.map(c => c.cycle_id || 0))
          : 0;
      const newCycleId = maxCycleId + 1;
      const newCycle = {
        id: Date.now(),
        label: value,
        cycle_id: newCycleId,
        children: []
      };

      treeData.value.push(newCycle);
      message("新增周期成功", { type: "success" });

      // TODO: 调用API保存周期
      // await projectApi.addCycle({ project_plan_id: props.projectPlanId, cycle_name: value });
    }
  } catch (error) {
    // 用户取消操作
    if (error !== "cancel") {
      console.error("新增周期失败:", error);
      message("新增周期失败", { type: "error" });
    }
  }
}

// 右键菜单处理
function handleContextMenu(event: MouseEvent, data: any, node: any) {
  event.preventDefault();
  event.stopPropagation();

  const isCycle = !data.visit_id;
  const menuOptions = {
    menuList: isCycle
      ? getCycleMenuList(data, node)
      : getVisitMenuList(data, node),
    menuWrapperCss: {
      background: "var(--el-bg-color)",
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    },
    menuItemCss: {
      labelColor: "var(--el-text-color-primary)",
      hoverLabelColor: "var(--el-color-primary)",
      hoverTipsColor: "var(--el-color-primary)",
      hoverBackgroundColor: "var(--el-fill-color-light)"
    }
  };

  const ctx = CustomMouseMenu({
    el: event.currentTarget as HTMLElement,
    params: { data, node },
    ...menuOptions
  });
  ctx.show(event.clientX, event.clientY);
}

// 获取周期节点菜单列表
function getCycleMenuList(data: any, node: any) {
  return [
    {
      label: "新增访视",
      fn: () => handleAddVisit(data, node)
    },
    {
      label: "修改",
      fn: () => handleEditCycle(data, node)
    },
    {
      label: "删除",
      fn: () => handleDeleteCycle(data, node)
    },
    {
      label: "上移",
      fn: () => handleMoveUp(data, node)
    },
    {
      label: "下移",
      fn: () => handleMoveDown(data, node)
    }
  ];
}

// 获取访视节点菜单列表
function getVisitMenuList(data: any, node: any) {
  return [
    {
      label: "新增事件",
      fn: () => handleAddEvent(data, node)
    },
    {
      label: "修改",
      fn: () => handleEditVisit(data, node)
    },
    {
      label: "删除",
      fn: () => handleDeleteVisit(data, node)
    },
    {
      label: "详情",
      fn: () => handleVisitDetail(data, node)
    }
  ];
}

// 新增访视
async function handleAddVisit(data: any, node: any) {
  try {
    const { value } = await ElMessageBox.prompt("请输入访视名称", "新增访视", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /.+/,
      inputErrorMessage: "访视名称不能为空"
    });

    if (value) {
      const cycle = data;
      const maxVisitId =
        cycle.children?.length > 0
          ? Math.max(...cycle.children.map((v: any) => v.visit_id || 0))
          : 0;
      const newVisitId = maxVisitId + 1;

      const newVisit = {
        id: Date.now(),
        label: value,
        visit_id: newVisitId,
        cycle_id: cycle.cycle_id
      };

      if (!cycle.children) {
        cycle.children = [];
      }
      cycle.children.push(newVisit);
      message("新增访视成功", { type: "success" });

      // TODO: 调用API保存访视
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("新增访视失败:", error);
      message("新增访视失败", { type: "error" });
    }
  }
}

// 修改周期
async function handleEditCycle(data: any, node: any) {
  try {
    const { value } = await ElMessageBox.prompt("请输入周期名称", "修改周期", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValue: data.label,
      inputPattern: /.+/,
      inputErrorMessage: "周期名称不能为空"
    });

    if (value) {
      data.label = value;
      message("修改周期成功", { type: "success" });

      // TODO: 调用API更新周期
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改周期失败:", error);
      message("修改周期失败", { type: "error" });
    }
  }
}

// 删除周期
async function handleDeleteCycle(data: any, node: any) {
  try {
    await ElMessageBox.confirm(
      `确定要删除周期"${data.label}"吗？删除后该周期下的所有访视也将被删除。`,
      "删除周期",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    const index = treeData.value.findIndex(
      item => item.cycle_id === data.cycle_id
    );
    if (index > -1) {
      treeData.value.splice(index, 1);
      message("删除周期成功", { type: "success" });

      // TODO: 调用API删除周期
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除周期失败:", error);
      message("删除周期失败", { type: "error" });
    }
  }
}

// 上移周期
function handleMoveUp(data: any, node: any) {
  const index = treeData.value.findIndex(
    item => item.cycle_id === data.cycle_id
  );
  if (index > 0) {
    const temp = treeData.value[index];
    treeData.value[index] = treeData.value[index - 1];
    treeData.value[index - 1] = temp;
    message("上移成功", { type: "success" });

    // TODO: 调用API更新顺序
  } else {
    message("已经是第一个周期", { type: "warning" });
  }
}

// 下移周期
function handleMoveDown(data: any, node: any) {
  const index = treeData.value.findIndex(
    item => item.cycle_id === data.cycle_id
  );
  if (index < treeData.value.length - 1) {
    const temp = treeData.value[index];
    treeData.value[index] = treeData.value[index + 1];
    treeData.value[index + 1] = temp;
    message("下移成功", { type: "success" });

    // TODO: 调用API更新顺序
  } else {
    message("已经是最后一个周期", { type: "warning" });
  }
}

// ========== 访视相关操作 ==========

// 新增事件
async function handleAddEvent(data: any, node: any) {
  try {
    const { value } = await ElMessageBox.prompt("请输入事件名称", "新增事件", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /.+/,
      inputErrorMessage: "事件名称不能为空"
    });

    if (value) {
      const visit = data;
      const newEvent = {
        id: Date.now(),
        event_name: value,
        event_type: "",
        event_time: "",
        visit_id: visit.visit_id
      };

      // 如果当前选中的是该访视，直接添加到事件列表
      if (selectedNode.value?.visit_id === visit.visit_id) {
        eventList.value.push(newEvent);
      } else {
        // 否则先选中该访视，然后加载事件列表
        selectedNode.value = visit;
        await loadEventList(visit.visit_id);
        eventList.value.push(newEvent);
      }

      message("新增事件成功", { type: "success" });

      // TODO: 调用API保存事件
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("新增事件失败:", error);
      message("新增事件失败", { type: "error" });
    }
  }
}

// 修改访视
async function handleEditVisit(data: any, node: any) {
  try {
    const { value } = await ElMessageBox.prompt("请输入访视名称", "修改访视", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValue: data.label,
      inputPattern: /.+/,
      inputErrorMessage: "访视名称不能为空"
    });

    if (value) {
      data.label = value;
      message("修改访视成功", { type: "success" });

      // TODO: 调用API更新访视
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改访视失败:", error);
      message("修改访视失败", { type: "error" });
    }
  }
}

// 删除访视
async function handleDeleteVisit(data: any, node: any) {
  try {
    await ElMessageBox.confirm(
      `确定要删除访视"${data.label}"吗？删除后该访视下的所有事件也将被删除。`,
      "删除访视",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    // 找到父周期节点
    const parentNode = node.parent;
    if (parentNode && parentNode.data && parentNode.data.children) {
      const index = parentNode.data.children.findIndex(
        (item: any) => item.visit_id === data.visit_id
      );
      if (index > -1) {
        parentNode.data.children.splice(index, 1);
        message("删除访视成功", { type: "success" });

        // 如果当前选中的是删除的访视，清空选中状态
        if (selectedNode.value?.visit_id === data.visit_id) {
          selectedNode.value = null;
          eventList.value = [];
        }

        // TODO: 调用API删除访视
      }
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除访视失败:", error);
      message("删除访视失败", { type: "error" });
    }
  }
}

// 查看访视详情
function handleVisitDetail(data: any, node: any) {
  // 选中该访视节点，触发事件列表加载
  selectedNode.value = data;
  handleNodeClick(data);
  message("已切换到访视详情", { type: "info" });
}

// 查看事件详情
async function handleEventDetail(row: any) {
  try {
    const res = await projectApi.getVisitEvent(row.event_id);
    if (res?.code === 200) {
      // TODO: 打开事件详情对话框
      console.log("事件详情:", res.data);
      message("事件详情功能待实现", { type: "info" });
    } else {
      message(res?.msg || "获取事件详情失败", { type: "error" });
    }
  } catch (error) {
    console.error("获取事件详情失败:", error);
    message("获取事件详情失败", { type: "error" });
  }
}

function formatTimePoint(row: any) {
  const { ref_event_id, before_or_after, interval_days, time_point } = row;
  const beforeKeys = ["前", "给药前", "给药开始前"];
  const afterKeys = ["后", "给药后", "给药开始后"];
  if (ref_event_id > 0) {
    if (beforeKeys.includes(before_or_after)) {
      return `Day ${interval_days}，-${time_point}`;
    } else if (afterKeys.includes(before_or_after)) {
      return `Day ${interval_days}，+${time_point}`;
    } else {
      return `Day ${interval_days}，${time_point}`;
    }
  } else if (time_point === "") {
    return `Day ${interval_days}，00:00:00`;
  } else {
    return "--";
  }
}

function formatWindow(row: any) {
  const { before_time, after_time } = row;
  if (!before_time && !after_time) {
    return "-";
  }
  if (before_time && after_time && before_time === after_time) {
    return `±${before_time}`;
  }
  const arr = [];
  if (before_time) {
    arr.push("-" + before_time);
  }
  if (after_time) {
    arr.push("+" + after_time);
  }
  return arr.join("，");
}
// 初始化加载数据
watch(
  () => props.plan?.project_plan_id,
  newId => {
    if (newId) {
      loadProjectPlanTree().then(() => {
        if (treeData.value.length > 0) {
          selectedNode.value = treeData.value[0];
          handleNodeClick(selectedNode.value);
        }
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="plan-config-container">
    <splitpane :splitSet="leftSplitSet">
      <!-- 左侧：周期/访视树状列表 -->
      <template #paneL>
        <div class="left-panel">
          <div class="panel-header">
            <span class="font-medium">周期/访视</span>
            <el-button
              type="primary"
              size="small"
              :icon="useRenderIcon(AddFill)"
              @click="handleAddCycle"
            >
              新增周期
            </el-button>
          </div>
          <el-scrollbar class="panel-content">
            <el-tree
              :data="treeData"
              :props="{ children: 'children', label: 'label' }"
              :expand-on-click-node="false"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
              class="cycle-visit-tree"
            >
              <template #default="{ node, data }">
                <span
                  class="tree-node"
                  :class="{
                    'is-cycle': !data.visit_id,
                    'is-visit': data.visit_id
                  }"
                  @contextmenu="handleContextMenu($event, data, node)"
                >
                  <el-icon class="node-icon">
                    <component :is="data.visit_id ? Document : Folder" />
                  </el-icon>
                  <span class="node-label">{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </template>

      <!-- 中间和右侧 -->
      <template #paneR>
        <splitpane :splitSet="rightSplitSet">
          <!-- 中间：事件列表 -->
          <template #paneL>
            <div class="middle-panel">
              <div class="panel-header">
                <span class="font-medium">事件列表</span>
                <span v-if="selectedNode" class="text-gray-400 text-sm">
                  {{ selectedNode.label }}
                </span>
              </div>
              <el-scrollbar class="panel-content table-content">
                <el-table
                  v-loading="eventLoading"
                  :data="eventList"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    align="center"
                  />
                  <el-table-column
                    prop="event_name"
                    label="事件名称"
                    min-width="150"
                  >
                    <template #default="{ row }">
                      <div
                        class="text-blue-500 cursor-pointer overflow-ellipsis text-nowrap w-full overflow-hidden"
                        :title="row.event_name"
                        @click="handleEventDetail(row)"
                      >
                        {{ row.event_name }}
                      </div>
                      <div class="text-gray-500 text-sm">
                        <template v-if="row.event_type === '1'"
                          >{{
                            row.sample_type_name +
                            "：" +
                            row.sample_type.quantity +
                            row.sample_type.quantity_unit
                          }}
                          <strong
                            :style="
                              row.sample_type.storage_conditions_val !== '常温'
                                ? 'color: purple;'
                                : ''
                            "
                          >
                            {{
                              row.sample_type.storage_conditions_val
                                ? `(${row.sample_type.storage_conditions_val})`
                                : ""
                            }}
                          </strong>
                        </template>
                        <template v-else-if="row.event_type === '2'">
                          {{
                            `${row.medicine_name} ${
                              !row.take_method && !row.take_medicine_num
                                ? ""
                                : "(" +
                                  row.medicine_type +
                                  " " +
                                  "(" +
                                  row.take_method +
                                  ")" +
                                  ")"
                            }`
                          }}
                        </template>
                        <template v-else>{{ row.event_name }}</template>
                        <br />
                        <span
                          class="overflow-ellipsis text-nowrap w-full overflow-hidden"
                          :title="row.remark"
                        >
                          {{ row.remark }}
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="event_group_name"
                    label="事件组"
                    width="100"
                  />
                  <el-table-column
                    :formatter="
                      row =>
                        row.ref_event_id <= 0
                          ? '-'
                          : `${row.ref_event_name} (${row.ref_visit_name})`
                    "
                    label="参照事件"
                    width="120"
                  />
                  <el-table-column
                    :formatter="formatTimePoint"
                    label="时间点"
                    width="150"
                  />
                  <el-table-column
                    :formatter="formatWindow"
                    label="时间窗"
                    width="120"
                  />
                  <el-table-column label="可参照" width="80">
                    <template #default="{ row }">
                      <span v-if="row.can_ref === 1" class="text-red-500"
                        >是</span
                      >
                      <span v-if="row.can_ref === -1" class="text-gray-500"
                        >否</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="!props.plan?.sign_by"
                    label="操作"
                    width="100"
                    align="center"
                  >
                    <template #default="{ row }">
                      <el-button type="primary" size="small" link
                        >编辑</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
          </template>

          <!-- 右侧：样本类型和药物列表 -->
          <template #paneR>
            <div class="right-panel">
              <!-- 样本类型列表 -->
              <div class="right-section">
                <div class="panel-header">
                  <span class="font-medium">样本类型</span>
                </div>
                <el-scrollbar class="panel-content">
                  <el-table
                    :data="sampleTypeList"
                    border
                    style="width: 100%"
                    max-height="300"
                  >
                    <template #empty>
                      <el-empty description="暂无样本类型" />
                    </template>
                    <el-table-column
                      type="index"
                      label="序号"
                      width="60"
                      align="center"
                    />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="code" label="编码" />
                  </el-table>
                </el-scrollbar>
              </div>

              <!-- 药物列表 -->
              <div class="right-section">
                <div class="panel-header">
                  <span class="font-medium">药物</span>
                </div>
                <el-scrollbar class="panel-content">
                  <el-table
                    :data="drugList"
                    border
                    style="width: 100%"
                    max-height="300"
                  >
                    <template #empty>
                      <el-empty description="暂无药物" />
                    </template>
                    <el-table-column
                      type="index"
                      label="序号"
                      width="60"
                      align="center"
                    />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="dosage" label="剂量" />
                  </el-table>
                </el-scrollbar>
              </div>
            </div>
          </template>
        </splitpane>
      </template>
    </splitpane>
  </div>
</template>

<style lang="scss" scoped>
.plan-config-container {
  height: 100%;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e6eb;

  :deep(.vue-splitter-container) {
    height: 100%;
    border: none;
    border-radius: 0;
    background: #ffffff;
  }

  :deep(.splitter-pane) {
    background: #ffffff;
    overflow: hidden;
    border-right: 1px solid #e5e6eb;
  }

  :deep(.splitter-pane:last-child) {
    border-right: none;
  }

  :deep(.splitter-pane-resizer) {
    width: 1px;
    background: #e5e6eb;
    transition: background 0.2s;
    cursor: col-resize;

    &:hover {
      background: #409eff;
      width: 2px;
    }
  }
}

.left-panel,
.middle-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-bottom: 1px solid #e5e6eb;

  &:last-child {
    border-bottom: none;
  }
}

.panel-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #e5e6eb;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #ffffff;

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
    background: #ffffff;
  }

  :deep(.el-scrollbar__bar) {
    opacity: 0.3;
  }
}

// 左侧面板内容区域特殊样式
.left-panel .panel-content {
  padding: 8px;
  background: #ffffff;
}

.table-content {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #ffffff;
}

.table-content :deep(.el-table) {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e6eb;

  .el-table__header {
    background: #ffffff;
    th {
      background: #ffffff;
      border-bottom: 1px solid #e5e6eb;
      color: #303133;
      font-weight: 500;
    }
  }

  .el-table__body {
    background: #ffffff;
    tr {
      &:hover {
        background: #f5f7fa;
      }
    }
    td {
      border-bottom: 1px solid #e5e6eb;
    }
  }

  .el-table__border-column-patch {
    border-color: #e5e6eb;
  }
}

.panel-content :deep(.el-empty) {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

// 右侧面板表格样式
.right-section :deep(.el-table) {
  background: #ffffff;
  border: 1px solid #e5e6eb;

  .el-table__header {
    background: #ffffff;
    th {
      background: #ffffff;
      border-bottom: 1px solid #e5e6eb;
      color: #303133;
      font-weight: 500;
    }
  }

  .el-table__body {
    background: #ffffff;
    tr {
      &:hover {
        background: #f5f7fa;
      }
    }
    td {
      border-bottom: 1px solid #e5e6eb;
    }
  }
}

// 周期/访视树样式美化 - 参照表单设计器风格
.cycle-visit-tree {
  background: #ffffff;

  :deep(.el-tree-node) {
    margin-bottom: 2px;
  }

  :deep(.el-tree-node__content) {
    height: 32px;
    padding: 0 8px;
    border-radius: 0;
    transition: all 0.2s;
    margin-bottom: 0;
    background: #ffffff;

    &:hover {
      background-color: #f5f7fa;
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #ecf5ff;
    color: #409eff;
    font-weight: 500;
  }

  :deep(.el-tree-node__expand-icon) {
    color: #909399;
    font-size: 12px;
    padding: 0 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #409eff;
    }
  }

  // 叶子节点（访视节点）不显示展开图标占位，且不占用空间
  :deep(
    .el-tree-node.is-leaf > .el-tree-node__content .el-tree-node__expand-icon
  ) {
    display: none !important;
    width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    min-width: 0 !important;
    flex: 0 0 0 !important;
  }

  // 叶子节点的内容区域，移除展开图标占用的空间
  :deep(.el-tree-node.is-leaf > .el-tree-node__content) {
    padding-left: 8px !important;
  }

  :deep(.el-tree-node__children) {
    padding-left: 16px;
  }
}

.tree-node {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
  padding: 0;
  transition: all 0.2s;

  .node-icon {
    font-size: 14px;
    color: #909399;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .node-label {
    flex: 1;
    font-size: 14px;
    color: #303133;
    transition: color 0.2s;
  }

  // 周期节点样式
  &.is-cycle {
    .node-icon {
      color: #409eff;
      font-size: 16px;
    }

    .node-label {
      font-weight: 500;
      color: #303133;
    }
  }

  // 访视节点样式
  &.is-visit {
    .node-icon {
      color: #909399;
      font-size: 14px;
    }

    .node-label {
      font-weight: 400;
      color: #606266;
    }
  }

  // 悬停效果
  &:hover {
    .node-icon {
      color: #409eff;
    }

    .node-label {
      color: #409eff;
    }
  }
}

// 当前选中节点样式
.cycle-visit-tree
  :deep(.el-tree-node.is-current > .el-tree-node__content .tree-node) {
  .node-icon {
    color: #409eff;
  }

  .node-label {
    color: #409eff;
    font-weight: 500;
  }
}

// 收起按钮样式
.collapse-btn {
  width: 32px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  align-self: center;

  &:hover {
    background: var(--el-fill-color);
    color: var(--el-color-primary);
  }

  .el-icon {
    font-size: 18px;
  }
}

.left-collapse-btn {
  margin-right: 8px;
}

.right-collapse-btn {
  margin-left: 8px;
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
