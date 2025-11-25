<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import type { FormItemProps } from "../utils/types";

defineOptions({
  name: "HospitalForm"
});

const props = defineProps<{
  formInline?: FormItemProps;
}>();

const formRef = ref();
const formInline = reactive<FormItemProps>({
  hospital_district_id: undefined,
  hospital_district_no: "",
  hospital_district_name: ""
});

// 初始化表单数据（只在组件挂载时执行一次）
onMounted(() => {
  if (props.formInline) {
    Object.assign(formInline, {
      hospital_district_id: props.formInline.hospital_district_id ?? undefined,
      hospital_district_no: props.formInline.hospital_district_no ?? "",
      hospital_district_name: props.formInline.hospital_district_name ?? ""
    });
  }
});

const rules = reactive({
  hospital_district_no: [
    { required: true, message: "请输入院区编号", trigger: "blur" }
  ],
  hospital_district_name: [
    { required: true, message: "请输入院区名称", trigger: "blur" }
  ]
});

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formInline });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="100px">
    <el-form-item label="院区编号" prop="hospital_district_no">
      <el-input
        v-model="formInline.hospital_district_no"
        placeholder="请输入院区编号"
        clearable
      />
    </el-form-item>
    <el-form-item label="院区名称" prop="hospital_district_name">
      <el-input
        v-model="formInline.hospital_district_name"
        placeholder="请输入院区名称"
        clearable
      />
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
