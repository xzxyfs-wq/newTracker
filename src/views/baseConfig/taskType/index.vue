<script setup lang="ts">
import { ref } from "vue";
import { useTaskType } from "./utils/hook";
import { ReTable } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import CheckCircle from "~icons/ep/check";
import CloseCircle from "~icons/ep/close";

defineOptions({
  name: "TaskTypeConfig"
});

const formRef = ref();
const tableRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  selectedNum,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleSwitchStatus,
  handleSwitchDisplay,
  handleDelete,
  handleSelectionChange,
  onSelectionCancel,
  handleSizeChange,
  handleCurrentChange
} = useTaskType();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      inline
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="流程名称：" prop="task_type_name">
        <el-input
          v-model="form.task_type_name"
          placeholder="请输入流程名称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="流程编码：" prop="task_type_code">
        <el-input
          v-model="form.task_type_code"
          placeholder="请输入流程编码"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <ReTable
      ref="tableRef"
      title="样本处理流程"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      row-key="task_type_id"
      :pagination="pagination"
      @refresh="onSearch"
      @selection-change="handleSelectionChange"
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增
        </el-button>
      </template>
      <template #display="{ row }">
        <el-switch
          v-model="row.display"
          :active-value="1"
          :inactive-value="-1"
          :loading="row.displayLoading"
          :before-change="() => handleSwitchDisplay(row)"
        />
      </template>
      <template #status="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="1"
          :inactive-value="-1"
          :loading="row.statusLoading"
          :before-change="() => handleSwitchStatus(row)"
        />
      </template>
      <template #operation="{ row, size }">
        <el-button
          class="operation-btn"
          link
          type="primary"
          :size="size"
          :icon="useRenderIcon(EditPen)"
          @click="openDialog('修改', row)"
        >
          修改
        </el-button>
        <el-button
          v-if="row.is_use === 0"
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

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
    margin-right: 12px;
  }
}

.operation-btn {
  margin-left: 0;
}
</style>
