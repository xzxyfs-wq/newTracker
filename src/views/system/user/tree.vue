<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, watch } from "vue";
import More2Fill from "~icons/ri/more-2-fill?width=18&height=18";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";

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
  <div
    v-loading="treeLoading"
    class="h-full bg-bg_color overflow-hidden relative"
  >
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
        @node-click="nodeClick"
      >
        <template #default="{ node }">
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
</style>
