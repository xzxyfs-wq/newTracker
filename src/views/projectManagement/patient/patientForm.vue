<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "PatientForm"
});

const props = defineProps<{
  formInline?: {
    patient_user_id?: number;
    patient_name?: string;
    sex?: string;
    birth_date?: string;
    patient_identify_no?: string;
  };
}>();

const emit = defineEmits<{
  (e: "success"): void;
}>();

const formRef = ref();
const formInline = reactive({
  patient_name: "",
  sex: "",
  birth_date: "",
  patient_identify_no: ""
});

// 从身份证号提取出生日期
function extractBirthDateFromIdCard(idCard: string): string {
  if (!idCard || idCard.length < 14) {
    return "";
  }

  // 18位身份证：第7-14位是出生日期（YYYYMMDD）
  // 15位身份证：第7-12位是出生日期（YYMMDD），需要转换为19XX或20XX
  if (idCard.length === 18) {
    const year = idCard.substring(6, 10);
    const month = idCard.substring(10, 12);
    const day = idCard.substring(12, 14);
    return `${year}-${month}-${day}`;
  } else if (idCard.length === 15) {
    const year = "19" + idCard.substring(6, 8);
    const month = idCard.substring(8, 10);
    const day = idCard.substring(10, 12);
    return `${year}-${month}-${day}`;
  }

  return "";
}

// 身份证号验证正则
const idCardPattern =
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

// 表单验证规则
const rules = reactive({
  patient_name: [
    { required: true, message: "请输入患者姓名", trigger: "blur" }
  ],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  patient_identify_no: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern: idCardPattern as RegExp,
      message: "请输入正确的身份证号",
      trigger: "blur"
    }
  ]
} as any);

// 监听身份证号变化，自动提取出生日期
watch(
  () => formInline.patient_identify_no,
  newVal => {
    if (newVal && (newVal.length === 15 || newVal.length === 18)) {
      const birthDate = extractBirthDateFromIdCard(newVal);
      if (birthDate) {
        formInline.birth_date = birthDate;
      }
    } else {
      formInline.birth_date = "";
    }
  }
);

// 初始化表单数据
onMounted(() => {
  if (props.formInline) {
    Object.assign(formInline, {
      patient_name: props.formInline.patient_name ?? "",
      sex: props.formInline.sex ?? "",
      birth_date: props.formInline.birth_date ?? "",
      patient_identify_no: props.formInline.patient_identify_no ?? ""
    });
  }
});

function getRef() {
  return formRef.value;
}

function getFormData() {
  return formInline;
}

defineExpose({ getRef, getFormData });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="100px">
    <el-form-item label="患者姓名" prop="patient_name">
      <el-input
        v-model="formInline.patient_name"
        placeholder="请输入患者姓名"
        clearable
      />
    </el-form-item>
    <el-form-item label="患者性别" prop="sex">
      <el-radio-group v-model="formInline.sex">
        <el-radio label="1">男</el-radio>
        <el-radio label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="身份证号" prop="patient_identify_no">
      <el-input
        v-model="formInline.patient_identify_no"
        placeholder="请输入身份证号"
        clearable
        maxlength="18"
      />
    </el-form-item>
  </el-form>
</template>
