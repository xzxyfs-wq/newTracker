<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";

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
  /** 是否显示筛选表单 */
  showSearchForm?: boolean;
  /** 筛选表单是否默认展开 */
  searchFormExpand?: boolean;
}

interface Emits {
  (e: "refresh", formData: Record<string, any>): void;
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
  stripe: false,
  showSearchForm: false,
  searchFormExpand: true
});

const emit = defineEmits<Emits>();

const tableRef = ref();
const formRef = ref();

// 表单数据，在组件内部管理
const searchForm = reactive<Record<string, any>>({});

// 计算属性：获取表格实例
const tableInstance = computed(() => {
  return tableRef.value?.getTableRef?.() || tableRef.value;
});

// 需要排除的插槽名称列表
const excludedSlots = ["buttons", "title", "before-table", "search-form"];

// 刷新处理，传递表单数据
const handleRefresh = () => {
  emit("refresh", { ...searchForm });
};

// 搜索处理
const handleSearch = () => {
  emit("refresh", { ...searchForm });
};

// 重置表单
const handleResetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  // 清空表单数据
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = undefined;
  });
  // 重置后触发搜索
  emit("refresh", { ...searchForm });
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

// 暴露表格实例方法和表单数据
defineExpose({
  getTableRef: () => tableInstance.value,
  tableRef: tableInstance,
  searchForm,
  formRef,
  resetSearchForm: handleResetForm
});
</script>

<template>
  <div class="re-table-wrapper">
    <!-- 筛选表单区域 -->
    <div
      v-show="showSearchForm && searchFormExpand"
      class="search-form-wrapper"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="searchForm"
        class="search-form"
      >
        <slot name="search-form" :form="searchForm" :formRef="formRef" />
        <!-- 如果插槽没有提供按钮，则显示默认的搜索和重置按钮 -->
        <template v-if="!$slots['search-form-buttons']">
          <el-form-item>
            <el-button
              type="primary"
              :icon="useRenderIcon('ri/search-line')"
              :loading="loading"
              @click="handleSearch"
            >
              搜索
            </el-button>
            <el-button :icon="useRenderIcon(Refresh)" @click="handleResetForm">
              重置
            </el-button>
          </el-form-item>
        </template>
        <!-- 自定义按钮插槽 -->
        <template v-else>
          <slot
            name="search-form-buttons"
            :form="searchForm"
            :formRef="formRef"
            :onSearch="handleSearch"
            :onReset="handleResetForm"
          />
        </template>
      </el-form>
    </div>
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
        <slot
          name="before-table"
          :size="size"
          :dynamicColumns="dynamicColumns"
        />
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
          <!-- 手动传递常见插槽，其他插槽通过 $slots 自动传递 -->
          <template v-if="$slots.operation" #operation="slotData">
            <slot name="operation" v-bind="slotData" />
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.re-table-wrapper {
  .search-form-wrapper {
    background-color: var(--el-bg-color);
    padding: 12px 24px 0;
    border-radius: 4px;

    :deep(.search-form) {
      .el-form-item {
        margin-bottom: 12px;
        margin-right: 12px;
      }
    }
  }
}
</style>
