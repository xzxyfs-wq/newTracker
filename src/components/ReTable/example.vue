<!--
  使用示例：展示如何使用 ReTable 组件
  这是一个完整的示例，可以直接参考使用
-->
<script setup lang="ts">
import { ref } from "vue";
import { ReTable } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";

defineOptions({
  name: "ReTableExample"
});

const tableRef = ref();
const loading = ref(false);
const dataList = ref([
  { id: 1, name: "项目1", status: "进行中" },
  { id: 2, name: "项目2", status: "已完成" },
  { id: 3, name: "项目3", status: "已暂停" }
]);

const columns = [
  {
    label: "ID",
    prop: "id",
    width: 80
  },
  {
    label: "项目名称",
    prop: "name"
  },
  {
    label: "状态",
    prop: "status"
  },
  {
    label: "操作",
    fixed: "right" as const,
    width: 200,
    slot: "operation"
  }
];

const pagination = ref({
  total: 100,
  pageSize: 10,
  currentPage: 1,
  background: true
});

// 搜索 - 现在会接收表单数据作为参数
function onSearch(formData: Record<string, any>) {
  console.log("搜索表单数据:", formData);
  loading.value = true;
  // 模拟 API 调用，使用 formData 进行搜索
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

// 选择变化
function handleSelectionChange(selection: any[]) {
  console.log("选中的行:", selection);
}

// 分页大小变化
function handleSizeChange(size: number) {
  pagination.value.pageSize = size;
  // 获取表单数据
  const formData = tableRef.value?.searchForm || {};
  onSearch(formData);
}

// 当前页变化
function handleCurrentChange(page: number) {
  pagination.value.currentPage = page;
  // 获取表单数据
  const formData = tableRef.value?.searchForm || {};
  onSearch(formData);
}

// 新增
function handleAdd() {
  console.log("新增");
}

// 编辑
function handleEdit(row: any) {
  console.log("编辑", row);
}

// 删除
function handleDelete(row: any) {
  console.log("删除", row);
}
</script>

<template>
  <div class="main">
    <!-- 使用 ReTable 组件，简化了 PureTableBar 和 pure-table 的使用 -->
    <ReTable
      ref="tableRef"
      title="项目列表"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      :show-search-form="true"
      :search-form-expand="true"
      @refresh="onSearch"
      @selection-change="handleSelectionChange"
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
    >
      <!-- 筛选表单插槽 - form 数据由 ReTable 内部管理 -->
      <template #search-form="{ form }">
        <el-form-item label="项目名称：" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入项目名称"
            clearable
            class="w-[180px]!"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择状态"
            clearable
            class="w-[180px]!"
          >
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已暂停" value="已暂停" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 工具栏按钮 -->
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="handleAdd"
        >
          新增项目
        </el-button>
      </template>

      <!-- 操作列插槽 -->
      <template #operation="{ row, size }">
        <el-button
          class="operation-btn"
          link
          type="primary"
          :size="size"
          :icon="useRenderIcon(EditPen)"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        <el-button
          class="operation-btn"
          link
          type="danger"
          :size="size"
          :icon="useRenderIcon(Delete)"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </ReTable>
  </div>
</template>

<style lang="scss" scoped>
.main {
  margin: 24px 24px 0 !important;
}

.operation-btn {
  margin-left: 0;
}
</style>
