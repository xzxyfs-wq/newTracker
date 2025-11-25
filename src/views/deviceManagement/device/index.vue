<script setup lang="ts">
import { ref } from "vue";
import { useDevice } from "./utils/hook";
import { ReTable } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import View from "~icons/ep/view";

defineOptions({
  name: "DeviceManagement"
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
  deviceTypeOptions,
  roomOptions,
  storeListDrawerVisible,
  storeListData,
  storeListLoading,
  storeListPagination,
  currentDevice,
  handleStoreListSizeChange,
  handleStoreListCurrentChange,
  handleDeleteFloor,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleSwitchStatus,
  handleShowStoreList,
  openStoreDialog,
  handleSelectionChange,
  onSelectionCancel,
  handleSizeChange,
  handleCurrentChange
} = useDevice();

// 包装函数用于 before-change
const beforeStatusChange = (row: any, val: number) => {
  return handleSwitchStatus(row, val);
};
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      inline
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="设备类型：" prop="device_type_id">
        <el-select
          v-model="form.device_type_id"
          placeholder="请选择设备类型"
          clearable
          class="w-[180px]!"
        >
          <el-option
            v-for="item in deviceTypeOptions"
            :key="item.device_type_id"
            :label="item.device_type_name"
            :value="item.device_type_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在房间：" prop="room_id">
        <el-select
          v-model="form.room_id"
          placeholder="请选择所在房间"
          clearable
          class="w-[180px]!"
        >
          <el-option
            v-for="item in roomOptions"
            :key="item.room_id"
            :label="item.room_name"
            :value="item.room_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编码：" prop="device_barcode">
        <el-input
          v-model="form.device_barcode"
          placeholder="请输入设备编码"
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
      title="设备管理"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      row-key="device_id"
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
          新增设备
        </el-button>
      </template>
      <template #status="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="1"
          :inactive-value="-1"
          :loading="row.statusLoading"
          :before-change="
            ((val: number) => beforeStatusChange(row, val)) as any
          "
        />
      </template>
      <template #operation="{ row, size }">
        <el-button
          v-if="row.device_type_code === 'fridge'"
          class="operation-btn"
          link
          type="primary"
          :size="size"
          :icon="useRenderIcon(View)"
          @click="handleShowStoreList(row)"
        >
          详情
        </el-button>
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

    <!-- 储位列表抽屉 -->
    <el-drawer
      v-model="storeListDrawerVisible"
      title="储位列表"
      size="70%"
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
          <span>储位列表 - {{ currentDevice?.device_name }}</span>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openStoreDialog()"
          >
            新增储位
          </el-button>
        </div>
      </template>
      <el-table
        :data="storeListData"
        :loading="storeListLoading"
        border
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="80">
          <template #default="{ $index }">
            {{
              (storeListPagination.currentPage - 1) *
                storeListPagination.pageSize +
              $index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column label="层名称" align="center" min-width="120">
          <template #header>
            <span>层名称</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="点击层名称删除层"
              placement="top"
            >
              <i class="el-icon-question" style="margin-left: 4px" />
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <el-button
              v-if="row.parent_device_name"
              link
              type="primary"
              @click="handleDeleteFloor(row.parent_id, row.parent_device_name)"
            >
              {{ row.parent_device_name }}
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="device_barcode"
          label="储位条码"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="device_name"
          label="储位名称"
          align="center"
          min-width="150"
        />
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              class="operation-btn"
              link
              type="primary"
              :icon="useRenderIcon(EditPen)"
              @click="openStoreDialog('修改', row)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="storeListPagination.currentPage"
        v-model:page-size="storeListPagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="storeListPagination.total"
        :background="storeListPagination.background"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 16px; justify-content: flex-end"
        @size-change="handleStoreListSizeChange"
        @current-change="handleStoreListCurrentChange"
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
