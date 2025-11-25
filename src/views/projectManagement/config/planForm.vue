<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormItemProps } from "../utils/types";

defineOptions({
  name: "PlanForm"
});

const props = withDefaults(
  defineProps<{
    formInline?: {
      project_plan_id?: number;
      plan_no?: string | number;
      pk_plan_no?: string;
      copy_project_plan_id?: number;
    };
    projectId?: number;
    existingPlans?: any[];
    isEdit?: boolean;
  }>(),
  {
    existingPlans: () => [],
    isEdit: false
  }
);

const formRef = ref();
const formInline = reactive({
  plan_no: "",
  pk_plan_no: "",
  copy_project_plan_id: undefined
});

// 初始化表单数据
onMounted(() => {
  if (props.formInline) {
    Object.assign(formInline, {
      plan_no: props.formInline.plan_no ? String(props.formInline.plan_no) : "",
      pk_plan_no: props.formInline.pk_plan_no ?? "",
      copy_project_plan_id: props.formInline.copy_project_plan_id ?? undefined
    });
  }
});

const rules = reactive({
  plan_no: [{ required: true, message: "请输入方案版本号", trigger: "blur" }]
});

function getRef() {
  return formRef.value;
}

function getFormData() {
  return formInline;
}

defineExpose({ getRef, getFormData, formInline });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="120px">
    <el-form-item label="方案版本号" prop="plan_no">
      <el-input
        v-model="formInline.plan_no"
        placeholder="请输入方案版本号"
        clearable
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="备注" prop="pk_plan_no">
      <el-input
        v-model="formInline.pk_plan_no"
        type="textarea"
        :rows="4"
        placeholder="请输入备注"
        clearable
      />
    </el-form-item>
    <el-form-item label="拷贝方案" prop="copy_project_plan_id">
      <el-select
        v-model="formInline.copy_project_plan_id"
        placeholder="请选择要拷贝的方案（可选）"
        :disabled="props.isEdit"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="plan in props.existingPlans"
          :key="plan.project_plan_id"
          :label="`${plan.plan_no || '方案' + (plan.plan_version || '')} (版本${plan.plan_version || plan.plan_no || ''})`"
          :value="plan.project_plan_id"
        />
      </el-select>
      <div v-if="props.isEdit" class="text-gray-400 text-xs mt-1">
        编辑模式下不可修改拷贝方案
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
