<script setup lang="ts">
import { ref, h, computed } from "vue";
import { useDict } from "./utils/hook";
import { ReTable } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { usePublicHooks } from "../hooks";
import dayjs from "dayjs";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import DeleteFilled from "~icons/ep/delete-filled";

const { tagStyle } = usePublicHooks();

defineOptions({
  name: "SystemDict"
});

const formRef = ref();
const dictDataTableRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleBatchDelete,
  selectedRows,
  tableRef,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  handleViewDictData,
  dictDataDrawerVisible,
  dictDataList,
  dictDataLoading,
  currentDictInfo,
  dictDataForm,
  dictDataFormRef,
  loadDictData,
  resetDictDataForm,
  openDictDataDialog,
  handleDictDataDelete
} = useDict();
</script>

<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px]"
    >
      <el-form-item label="字典名称：" prop="dict_type_name">
        <el-input
          v-model="form.dict_type_name"
          placeholder="请输入字典名称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="字典类型：" prop="dict_type_code">
        <el-input
          v-model="form.dict_type_code"
          placeholder="请输入字典类型"
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
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
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
      title="字典管理"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      row-key="dictId"
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
          新增字典
        </el-button>
        <el-popconfirm
          title="是否确认删除选中的数据？"
          @confirm="handleBatchDelete"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="useRenderIcon(DeleteFilled)"
              :disabled="selectedRows.length === 0"
            >
              批量删除
            </el-button>
          </template>
        </el-popconfirm>
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
        <el-popconfirm
          :title="`是否确认删除字典名称为${row.dict_type_name}的这条数据`"
          @confirm="handleDelete(row)"
        >
          <template #reference>
            <el-button
              class="operation-btn"
              link
              type="danger"
              :size="size"
              :icon="useRenderIcon(Delete)"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </ReTable>

    <!-- 字典数据抽屉 -->
    <el-drawer
      v-model="dictDataDrawerVisible"
      title="字典数据管理"
      :size="'70%'"
      direction="rtl"
      class="dict-data-drawer"
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
          <span
            >字典数据 - {{ currentDictInfo?.dict_type_name }} ({{
              currentDictInfo?.dict_type_code
            }})</span
          >
        </div>
      </template>
      <el-form
        ref="dictDataFormRef"
        :inline="true"
        :model="dictDataForm"
        class="search-form w-full"
      >
        <el-form-item label="数据标签：" prop="dict_value">
          <el-input
            v-model="dictDataForm.dictLabel"
            placeholder="请输入数据标签"
            clearable
            class="w-[180px]!"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="dictDataForm.status"
            placeholder="请选择状态"
            clearable
            class="w-[180px]!"
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri/search-line')"
            :loading="dictDataLoading"
            @click="loadDictData"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetDictDataForm">
            重置
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDictDataDialog()"
          >
            新增字典数据
          </el-button>
        </el-form-item>
      </el-form>
      <div class="dict-data-content">
        <el-table
          ref="dictDataTableRef"
          :data="dictDataList"
          :loading="dictDataLoading"
          row-key="dict_data_id"
          border
          stripe
        >
          <el-table-column
            label="数据标签"
            prop="dict_key"
            min-width="150"
            align="left"
          />
          <el-table-column
            label="数据键值"
            prop="dict_value"
            min-width="150"
            align="center"
          />
          <el-table-column
            label="显示排序"
            prop="dict_sort"
            min-width="100"
            align="center"
          />
          <el-table-column
            label="状态"
            prop="status"
            min-width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :style="tagStyle(row.status === 1 ? 1 : 0)">
                {{ row.status === 1 ? "正常" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
            min-width="200"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            label="创建时间"
            prop="createdAt"
            min-width="200"
            align="center"
          >
            <template #default="{ row }">
              {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
            align="center"
          >
            <template #default="{ row }">
              <el-button
                class="operation-btn"
                link
                type="primary"
                :icon="useRenderIcon('ep/edit-pen')"
                @click="openDictDataDialog('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除数据标签为${row.dict_key}的这条数据`"
                @confirm="handleDictDataDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="operation-btn"
                    link
                    type="danger"
                    :icon="useRenderIcon('ep/delete')"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
    margin-right: 12px;
  }
}

.operation-btn {
  margin-left: 0;
}

:deep(.dict-data-drawer) {
  .el-drawer__body {
    padding: 20px;
  }

  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .search-form {
    background-color: var(--el-bg-color);
    padding-bottom: 16px;
  }

  .dict-data-content {
    .dict-data-toolbar {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
