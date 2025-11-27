<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, watch } from "vue";
import More2Fill from "~icons/ri/more-2-fill?width=18&height=18";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";
import ElTreeLine from "@/components/ReTreeLine";

defineProps({
  treeLoading: Boolean,
  treeData: Array
});

const emit = defineEmits(["tree-select"]);

const treeRef = ref();
const isExpand = ref(true);
const searchValue = ref("");
const currentKey = ref<number | null>(null);

const defaultProps = {
  children: "children",
  label: "dept_name"
};

const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return (data.dept_name || "").includes(value);
};

function nodeClick(data: any) {
  const nodeId = data.dept_id;
  const isSelected = currentKey.value === nodeId;

  currentKey.value = isSelected ? null : nodeId;
  emit("tree-select", {
    ...data,
    selected: !isSelected
  });
}

function toggleRowExpansionAll() {
  isExpand.value = !isExpand.value;
  const nodes = (treeRef.value as any)?.store?._getAllNodes() || [];
  nodes.forEach((node: any) => {
    node.expanded = isExpand.value;
  });
}

function onTreeReset() {
  searchValue.value = "";
  currentKey.value = null;
  treeRef.value?.setCurrentKey(null);
  toggleRowExpansionAll();
}

function setCurrentKey(key: number | null) {
  currentKey.value = key;
  if (treeRef.value) {
    treeRef.value.setCurrentKey(key);
  }
}

watch(searchValue, val => {
  treeRef.value?.filter(val);
});

defineExpose({ onTreeReset, setCurrentKey });
</script>

<template>
  <div class="h-full bg-bg_color overflow-hidden relative">
    <!-- 自定义 loading 遮罩层 -->
    <div v-if="treeLoading" class="loading-overlay">
      <div class="el-loading-spinner">
        <svg class="circular" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
    <div class="flex items-center h-[34px] gap-2 px-2">
      <el-input
        v-model="searchValue"
        size="small"
        placeholder="请输入部门名称"
        clearable
        class="flex-1"
      >
        <template #prefix>
          <el-icon>
            <IconifyIconOffline icon="ri/search-line" />
          </el-icon>
        </template>
      </el-input>
      <el-dropdown>
        <More2Fill class="w-[28px] cursor-pointer outline-none" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toggleRowExpansionAll">
              <el-icon class="mr-1">
                <IconifyIconOffline
                  :icon="isExpand ? ExpandIcon : UnExpandIcon"
                />
              </el-icon>
              {{ isExpand ? "折叠全部" : "展开全部" }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider />
    <el-scrollbar height="calc(100% - 35px)">
      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="dept_id"
        size="small"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        highlight-current
        :indent="30"
        @node-click="nodeClick"
      >
        <template #default="{ node }">
          <el-tree-line :node="node" :showLabelLine="true" :indent="30">
            <template #node-label>
              <span
                :class="[
                  searchValue.trim().length > 0 &&
                    node.label.includes(searchValue) &&
                    'text-red-500'
                ]"
              >
                {{ node.label }}
              </span>
            </template>
          </el-tree-line>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}

:deep(.el-dropdown) {
  outline: none;

  &:focus,
  &:focus-visible {
    outline: none;
  }
}

// 自定义 loading 遮罩层 - 完全控制位置，避免抖动
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  pointer-events: none;
  overflow: visible;
}

// 使用 Element Plus 的 loading spinner 样式
.el-loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-loading-spinner .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
}

.el-loading-spinner .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -125px;
  }
}
</style>
