<script setup lang="ts">
import { ref, computed } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";

interface Props {
  /** 表格标题 */
  title?: string;
  /** 表格列配置 */
  columns: TableColumnList;
  /** 表格数据 */
  data: any[];
  /** 加载状态 */
  loading?: boolean;
  /** 行键 */
  rowKey?: string;
  /** 是否自适应高度 */
  adaptive?: boolean;
  /** 自适应配置 */
  adaptiveConfig?: {
    offsetBottom?: number;
    [key: string]: any;
  };
  /** 分页配置 */
  pagination?: {
    total?: number;
    pageSize?: number;
    currentPage?: number;
    background?: boolean;
    [key: string]: any;
  };
  /** 表格布局 */
  tableLayout?: "auto" | "fixed";
  /** 对齐方式 */
  alignWhole?: "left" | "center" | "right";
  /** 表头样式 */
  headerCellStyle?: Record<string, any>;
  /** 表格key，用于区分多个表格 */
  tableKey?: string | number;
  /** 是否展开所有行（树形表格） */
  isExpandAll?: boolean;
  /** 是否显示边框 */
  border?: boolean;
  /** 是否显示斑马纹 */
  stripe?: boolean;
  /** 最大高度 */
  maxHeight?: string | number;
}

interface Emits {
  (e: "refresh"): void;
  (e: "selection-change", selection: any[]): void;
  (e: "page-size-change", size: number): void;
  (e: "page-current-change", page: number): void;
  (e: "fullscreen", isFullscreen: boolean): void;
  (e: "update:columns", columns: TableColumnList): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "列表",
  loading: false,
  rowKey: "id",
  adaptive: true,
  adaptiveConfig: () => ({ offsetBottom: 108 }),
  pagination: () => ({}),
  tableLayout: "auto",
  alignWhole: "center",
  headerCellStyle: () => ({
    background: "var(--el-fill-color-light)",
    color: "var(--el-text-color-primary)"
  }),
  tableKey: "0",
  isExpandAll: true,
  border: false,
  stripe: false
});

const emit = defineEmits<Emits>();

const tableRef = ref();

// 计算属性：获取表格实例
const tableInstance = computed(() => {
  return tableRef.value?.getTableRef?.() || tableRef.value;
});

// 刷新处理
const handleRefresh = () => {
  emit("refresh");
};

// 选择变化处理
const handleSelectionChange = (selection: any[]) => {
  emit("selection-change", selection);
};

// 分页大小变化处理
const handleSizeChange = (size: number) => {
  emit("page-size-change", size);
};

// 当前页变化处理
const handleCurrentChange = (page: number) => {
  emit("page-current-change", page);
};

// 全屏处理
const handleFullscreen = (isFullscreen: boolean) => {
  emit("fullscreen", isFullscreen);
};

// 暴露表格实例方法
defineExpose({
  getTableRef: () => tableInstance.value,
  tableRef: tableInstance
});
</script>

<template>
  <PureTableBar
    :title="title"
    :columns="columns"
    :table-ref="tableInstance"
    :table-key="tableKey"
    :is-expand-all="isExpandAll"
    @refresh="handleRefresh"
    @fullscreen="handleFullscreen"
  >
    <template #buttons>
      <slot name="buttons" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <slot name="before-table" :size="size" :dynamicColumns="dynamicColumns" />
      <pure-table
        ref="tableRef"
        :row-key="rowKey"
        :adaptive="adaptive"
        :adaptive-config="adaptiveConfig"
        :align-whole="alignWhole"
        :table-layout="tableLayout"
        :loading="loading"
        :size="size"
        :data="data"
        :columns="dynamicColumns"
        :pagination="{ ...pagination, size }"
        :header-cell-style="headerCellStyle"
        :border="border"
        :stripe="stripe"
        :max-height="maxHeight"
        v-bind="$attrs"
        @selection-change="handleSelectionChange"
        @page-size-change="handleSizeChange"
        @page-current-change="handleCurrentChange"
      >
        <!-- 传递所有插槽给 pure-table，排除 buttons、title、before-table -->
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>
