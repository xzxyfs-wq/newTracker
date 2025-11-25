<script setup lang="ts">
import { computed, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import Delete from "~icons/ep/delete";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import { useSlot } from "./composables/useSlot";

defineOptions({
  name: "SlotTab"
});

const props = defineProps<{
  projectId?: number;
}>();

const {
  slotList,
  slotPagination,
  slotLoading,
  searchForm,
  slotTypeOptions,
  loadSlots,
  handleSizeChange,
  handleCurrentChange,
  handleSearch,
  handleReset,
  handleAdd,
  handleDelete,
  getSlotTypeLabel
} = useSlot(computed(() => props.projectId));

// 监听 projectId 变化，自动加载数据
watch(
  () => props.projectId,
  newId => {
    if (newId) {
      loadSlots();
    }
  },
  { immediate: true }
);

// 暴露方法供父组件调用
defineExpose({
  loadSlots
});
</script>

<template>
  <div class="tab-content">
    <!-- 查询表单 -->
    <el-form :model="searchForm" inline>
      <el-form-item label="受试者编号">
        <el-input
          v-model="searchForm.slot_no"
          placeholder="请输入受试者编号"
          clearable
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="编号类型">
        <el-select
          v-model="searchForm.slot_type"
          placeholder="请选择编号类型"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="item in slotTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="searchForm.start_date"
          type="date"
          placeholder="开始日期"
          value-format="YYYY-MM-DD"
          style="width: 150px"
          clearable
        />
        <span class="mx-2">至</span>
        <el-date-picker
          v-model="searchForm.end_date"
          type="date"
          placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 150px"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="handleSearch"
        >
          查询
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="handleReset">
          重置
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="slotList"
      :loading="slotLoading"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        :index="
          index =>
            (slotPagination.currentPage - 1) * slotPagination.pageSize +
            index +
            1
        "
      />
      <el-table-column prop="slot_no" label="受试者编号" min-width="150" />
      <el-table-column prop="format" label="编号格式" min-width="150" />
      <el-table-column label="编号类型" width="120" align="center">
        <template #default="{ row }">
          {{ getSlotTypeLabel(row.slot_type) }}
        </template>
      </el-table-column>
      <el-table-column label="是否应用过" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_use === 1 ? 'success' : 'info'">
            {{ row.is_use === 1 ? "已应用" : "未应用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="180"
        align="center"
      />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            link
            :icon="useRenderIcon(Delete)"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="slotPagination.currentPage"
      v-model:page-size="slotPagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="slotPagination.total"
      :background="slotPagination.background"
      layout="total, sizes, prev, pager, next, jumper"
      class="mt-4 justify-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.tab-content {
  padding: 0;
  height: 100%;
}
</style>
