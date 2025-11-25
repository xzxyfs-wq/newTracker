<script setup lang="ts">
import { ref } from "vue";
import { useProjectManagement } from "./utils/hook";
import { ReTable } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Refresh from "~icons/ep/refresh";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Setting from "~icons/ep/setting";
import Delete from "~icons/ep/delete";

defineOptions({
  name: "ProjectManagement"
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
  openConfigDrawer,
  openSampleTypeDrawer,
  handleDelete,
  handleSelectionChange,
  onSelectionCancel,
  handleSizeChange,
  handleCurrentChange,
  // 样本类型列表相关
  sampleTypeDrawerVisible,
  sampleTypeListData,
  sampleTypeListLoading,
  currentProject,
  sampleTypeListPagination,
  handleSampleTypeListSizeChange,
  handleSampleTypeListCurrentChange
} = useProjectManagement();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      inline
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="项目名称：" prop="project_name">
        <el-input
          v-model="form.project_name"
          placeholder="请输入项目名称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="项目编号：" prop="project_no">
        <el-input
          v-model="form.project_no"
          placeholder="请输入项目编号"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="方案编号：" prop="project_gcp_no">
        <el-input
          v-model="form.project_gcp_no"
          placeholder="请输入方案编号"
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
      title="项目管理"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      row-key="project_id"
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
          新增项目
        </el-button>
      </template>
      <template #operation="{ row, size }">
        <el-button
          class="operation-btn"
          link
          type="primary"
          :size="size"
          :icon="useRenderIcon(Setting)"
          @click="openConfigDrawer(row)"
        >
          项目配置
        </el-button>
        <el-button
          class="operation-btn"
          link
          type="primary"
          :size="size"
          :icon="useRenderIcon('ri/file-list-line')"
          @click="openSampleTypeDrawer(row)"
        >
          样本类型
        </el-button>
        <el-button
          class="operation-btn"
          link
          type="primary"
          :size="size"
          :icon="useRenderIcon(EditPen)"
          @click="openDialog('修改', row)"
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

    <!-- 样本类型列表抽屉 -->
    <el-drawer
      v-model="sampleTypeDrawerVisible"
      title="样本类型列表"
      :size="'60%'"
      direction="rtl"
    >
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          "
        >
          <span>样本类型列表 - {{ currentProject?.project_name }}</span>
        </div>
      </template>
      <el-table
        :data="sampleTypeListData"
        :loading="sampleTypeListLoading"
        border
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="80">
          <template #default="{ $index }">
            {{
              (sampleTypeListPagination.currentPage - 1) *
                sampleTypeListPagination.pageSize +
              $index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="样本类型名称"
          align="center"
          prop="sample_type_name"
          min-width="150"
        />
        <el-table-column
          label="条码类型"
          align="center"
          prop="barcode_type_name"
          min-width="120"
        />
        <el-table-column
          label="储存温度(℃)"
          align="center"
          prop="fridge_temperature"
          min-width="120"
        />
        <el-table-column
          label="接收条件"
          align="center"
          prop="storage_conditions_val"
          min-width="120"
        />
        <el-table-column
          label="采集类型"
          align="center"
          prop="sample_taken_type_label"
          min-width="120"
        />
        <el-table-column label="采集量" align="center" min-width="120">
          <template #default="{ row }">
            {{ row.quantity }} {{ row.quantity_unit }}
          </template>
        </el-table-column>
        <el-table-column
          label="首次入冰箱超时限制时长(分钟)"
          align="center"
          prop="limit_max_time"
          min-width="130"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="created_at"
          width="180"
        />
      </el-table>
      <el-pagination
        v-model:current-page="sampleTypeListPagination.currentPage"
        v-model:page-size="sampleTypeListPagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="sampleTypeListPagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSampleTypeListSizeChange"
        @current-change="handleSampleTypeListCurrentChange"
      />
    </el-drawer>
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
<style lang="scss">
.project-config-drawer {
  .el-drawer__body {
    padding-top: 0 !important;
  }
}
</style>
