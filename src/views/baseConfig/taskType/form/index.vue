<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { message } from "@/utils/message";
import type { FormItemProps } from "../utils/types";

defineOptions({
  name: "TaskTypeForm"
});

const props = defineProps<{
  formInline?: FormItemProps;
}>();

const formRef = ref();
const formInline = reactive<FormItemProps>({
  task_type_id: undefined,
  task_type_name: "",
  task_type_code: "",
  task_type_desc: "",
  sort: 0,
  is_record_end_time: -1,
  is_merge_tube: -1,
  can_transfer: -1,
  is_countdown: -1
});

// 监听 props 变化，更新表单数据
watch(
  () => props.formInline,
  newVal => {
    if (newVal) {
      Object.assign(formInline, {
        task_type_id: newVal.task_type_id ?? undefined,
        task_type_name: newVal.task_type_name ?? "",
        task_type_code: newVal.task_type_code ?? "",
        task_type_desc: newVal.task_type_desc ?? "",
        sort: newVal.sort ?? 0,
        is_record_end_time: newVal.is_record_end_time ?? -1,
        is_merge_tube: newVal.is_merge_tube ?? -1,
        can_transfer: newVal.can_transfer ?? -1,
        is_countdown: newVal.is_countdown ?? -1
      });
    }
  },
  { immediate: true, deep: true }
);

// 操作类型选项
const operationTypeOptions = [
  { label: "合管", value: "is_merge_tube,can_transfer" },
  { label: "转移", value: "can_transfer" },
  { label: "倒计时", value: "is_countdown" }
];

// 操作类型（用于下拉选择）
const operationType = ref("");

// 根据表单字段值计算操作类型
function getOperationType() {
  const types: string[] = [];
  if (formInline.is_merge_tube === 1) types.push("is_merge_tube");
  if (formInline.can_transfer === 1) types.push("can_transfer");
  if (formInline.is_countdown === 1) types.push("is_countdown");
  return types.join(",");
}

// 初始化操作类型
watch(
  () => [
    formInline.is_merge_tube,
    formInline.can_transfer,
    formInline.is_countdown
  ],
  () => {
    const currentType = getOperationType();
    if (currentType) {
      // 检查是否匹配已知的操作类型
      const matched = operationTypeOptions.find(
        opt => opt.value === currentType || currentType === opt.value
      );
      if (matched) {
        operationType.value = matched.value;
      } else {
        // 如果匹配"合管"类型（is_merge_tube,can_transfer）
        if (
          formInline.is_merge_tube === 1 &&
          formInline.can_transfer === 1 &&
          formInline.is_countdown !== 1
        ) {
          operationType.value = "is_merge_tube,can_transfer";
        } else {
          operationType.value = currentType;
        }
      }
    } else {
      operationType.value = "";
    }
  },
  { immediate: true }
);

// 操作类型变化处理
function handleOperationTypeChange(val: string) {
  // 重置所有操作类型相关字段
  formInline.is_merge_tube = -1;
  formInline.can_transfer = -1;
  formInline.is_countdown = -1;

  if (!val) return;

  // 根据选择的操作类型设置相应字段
  if (val === "is_merge_tube,can_transfer") {
    // 合管
    formInline.is_merge_tube = 1;
    formInline.can_transfer = 1;
    formInline.is_record_end_time = -1;
  } else if (val === "can_transfer") {
    // 转移
    formInline.can_transfer = 1;
    formInline.is_record_end_time = -1;
  } else if (val === "is_countdown") {
    // 倒计时
    formInline.is_countdown = 1;
    formInline.is_record_end_time = 1;
  }
}

// 单独记录操作结束时间是否禁用（当选择了操作类型时禁用）
const isRecordEndTimeDisabled = computed(() => {
  return !!operationType.value;
});

const rules = reactive({
  task_type_name: [
    { required: true, message: "请输入流程名称", trigger: "blur" }
  ],
  task_type_code: [
    { required: true, message: "请输入流程标识", trigger: "blur" }
  ],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
});

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formInline, operationType });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="90px">
    <el-form-item label="流程名称" prop="task_type_name">
      <el-input
        v-model="formInline.task_type_name"
        placeholder="请输入流程名称"
        clearable
      />
    </el-form-item>
    <el-form-item label="流程标识" prop="task_type_code">
      <el-input
        v-model="formInline.task_type_code"
        placeholder="请输入流程标识"
        clearable
      />
    </el-form-item>
    <el-form-item label="流程介绍" prop="task_type_desc">
      <el-input
        v-model="formInline.task_type_desc"
        type="textarea"
        :rows="3"
        placeholder="请输入流程介绍"
        clearable
      />
    </el-form-item>
    <el-form-item label="操作类型">
      <el-select
        v-model="operationType"
        placeholder="请选择操作类型"
        clearable
        @change="handleOperationTypeChange"
        style="width: 100%"
      >
        <el-option
          v-for="option in operationTypeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <template #label>
        <div style="line-height: 1">单独记录操作结束时间</div>
      </template>
      <el-switch
        v-model="formInline.is_record_end_time"
        :disabled="isRecordEndTimeDisabled"
        :active-value="1"
        :inactive-value="-1"
      />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number
        v-model="formInline.sort"
        :min="0"
        placeholder="请输入排序"
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
