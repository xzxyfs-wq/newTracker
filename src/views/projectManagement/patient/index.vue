<script setup lang="ts">
import { ref } from "vue";
import { ReTable } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox } from "element-plus";
import { h } from "vue";
import projectApi from "@/api/projectManagement";
import patientForm from "./patientForm.vue";

import Refresh from "~icons/ep/refresh";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Delete from "~icons/ep/delete";

defineOptions({
  name: "PatientManagement"
});

const formRef = ref();
const tableRef = ref();
const loading = ref(false);
const dataList = ref<any[]>([]);
const selectedNum = ref(0);

// 搜索表单
const form = ref({
  patient_name: "",
  patient_no: "",
  project_id: undefined
});

// 分页
const pagination = ref({
  total: 0,
  pageSize: 10,
  currentPage: 1
});

// 表格列配置
const columns = ref<TableColumnList>([
  {
    label: "序号",
    type: "index",
    width: 60,
    align: "center"
  },
  {
    label: "患者姓名",
    prop: "patient_name",
    minWidth: 120
  },
  {
    label: "患者性别",
    prop: "gender",
    width: 100,
    align: "center"
  },
  {
    label: "出生日期",
    prop: "birth_date",
    width: 120,
    align: "center"
  },
  {
    label: "身份证号",
    prop: "patient_identify_no",
    minWidth: 180
  },
  {
    label: "操作",
    fixed: "right",
    width: 150,
    slot: "operation"
  }
]);

// 搜索
async function onSearch() {
  loading.value = true;
  try {
    const response = await projectApi.getPatientList({
      patient_name: form.value.patient_name,
      patient_no: form.value.patient_no,
      pageSize: pagination.value.pageSize,
      currentPage: pagination.value.currentPage
    });

    if (response?.success && response?.data) {
      dataList.value = response.data.list || [];
      pagination.value.total = response.data.total || 0;
    }
  } catch (error) {
    console.error("加载患者信息失败:", error);
    message("加载患者信息失败", { type: "error" });
  } finally {
    loading.value = false;
  }
}

// 重置表单
function resetForm(formEl: any) {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}

// 新增
function handleAdd() {
  const formRef = ref();

  addDialog({
    title: "新增患者",
    width: "500px",
    draggable: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(patientForm, {
        ref: formRef
      }),
    beforeSure: async done => {
      const FormRef = formRef.value.getRef();
      const FormData = formRef.value.getFormData();

      FormRef.validate(async (valid: boolean) => {
        if (valid) {
          try {
            const response = await projectApi.addPatient(FormData);
            if (response?.success) {
              message("新增患者成功", { type: "success" });
              done();
              await onSearch();
            }
          } catch (error) {
            console.error("新增患者失败:", error);
            message("新增患者失败", { type: "error" });
          }
        }
      });
    }
  });
}

// 编辑
function handleEdit(row: any) {
  const formRef = ref();

  addDialog({
    title: "编辑患者",
    width: "500px",
    draggable: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(patientForm, {
        ref: formRef,
        formInline: {
          patient_user_id: row.patient_user_id,
          patient_name: row.patient_name,
          sex: row.sex,
          birth_date: row.birth_date,
          patient_identify_no: row.patient_identify_no
        }
      }),
    beforeSure: async done => {
      const FormRef = formRef.value.getRef();
      const FormData = formRef.value.getFormData();

      FormRef.validate(async (valid: boolean) => {
        if (valid) {
          try {
            const response = await projectApi.updatePatient({
              patient_user_id: row.patient_user_id,
              ...FormData
            });
            if (response?.success) {
              message("编辑患者成功", { type: "success" });
              done();
              await onSearch();
            }
          } catch (error) {
            console.error("编辑患者失败:", error);
            message("编辑患者失败", { type: "error" });
          }
        }
      });
    }
  });
}

// 删除
async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm("确定要删除该患者吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    const response = await projectApi.deletePatient(row.patient_user_id);
    if (response?.success) {
      message("删除患者成功", { type: "success" });
      await onSearch();
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除患者失败:", error);
      message("删除患者失败", { type: "error" });
    }
  }
}

// 选择变化
function handleSelectionChange(selection: any[]) {
  selectedNum.value = selection.length;
}

// 取消选择
function onSelectionCancel() {
  selectedNum.value = 0;
  tableRef.value?.getTableRef().clearSelection();
}

// 分页大小变化
function handleSizeChange(val: number) {
  pagination.value.pageSize = val;
  pagination.value.currentPage = 1;
  onSearch();
}

// 当前页变化
function handleCurrentChange(val: number) {
  pagination.value.currentPage = val;
  onSearch();
}

// 初始化加载
onSearch();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      inline
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="患者姓名：" prop="patient_name">
        <el-input
          v-model="form.patient_name"
          placeholder="请输入患者姓名"
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
      title="患者信息管理"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      row-key="patient_user_id"
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
          @click="handleAdd"
        >
          新增患者
        </el-button>
      </template>
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
