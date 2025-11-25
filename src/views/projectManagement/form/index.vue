<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import type { FormItemProps, DictItem } from "../utils/types";

defineOptions({
  name: "ProjectManagementForm"
});

const props = defineProps<{
  formInline?: FormItemProps;
  projectStatusOptions?: Array<{ dictValue: number; dictLabel: string }>;
}>();

const formRef = ref();
const formInline = reactive<FormItemProps>({
  project_id: undefined,
  project_no: "",
  project_gcp_no: "",
  project_name: "",
  project_desc: "",
  project_sponsor: "",
  testing_unit: "",
  project_start_date: "",
  ae_version_value: "",
  status: undefined,
  pi: "",
  research_site_name: "",
  research_site_no: ""
});

// 初始化表单数据
onMounted(() => {
  if (props.formInline) {
    Object.assign(formInline, {
      project_id: props.formInline.project_id ?? undefined,
      project_no: props.formInline.project_no ?? "",
      project_gcp_no: props.formInline.project_gcp_no ?? "",
      project_name: props.formInline.project_name ?? "",
      project_desc: props.formInline.project_desc ?? "",
      project_sponsor: props.formInline.project_sponsor ?? "",
      testing_unit: props.formInline.testing_unit ?? "",
      project_start_date: props.formInline.project_start_date ?? "",
      ae_version_value: props.formInline.ae_version_value ?? "",
      status: props.formInline.status ?? undefined,
      pi: props.formInline.pi ?? "",
      research_site_name: props.formInline.research_site_name ?? "",
      research_site_no: props.formInline.research_site_no ?? ""
    });
  }
});

// AE版本字典数据
const aeVersionOptions = ref<DictItem[]>([
  {
    dictCode: 335,
    dictSort: 0,
    dictLabel: "4.0",
    dictValue: "1",
    dictType: "ae_version",
    cssClass: "",
    listClass: "",
    isDefault: "",
    status: "",
    expand: "",
    default: "",
    createBy: "",
    updateBy: "",
    remark: "",
    params: "",
    dataScope: "",
    dictTypes: null,
    createdAt: "0001-01-01T00:00:00Z",
    updatedAt: "0001-01-01T00:00:00Z",
    deletedAt: null
  },
  {
    dictCode: 336,
    dictSort: 0,
    dictLabel: "5.0",
    dictValue: "2",
    dictType: "ae_version",
    cssClass: "",
    listClass: "",
    isDefault: "",
    status: "",
    expand: "",
    default: "",
    createBy: "",
    updateBy: "",
    remark: "",
    params: "",
    dataScope: "",
    dictTypes: null,
    createdAt: "0001-01-01T00:00:00Z",
    updatedAt: "0001-01-01T00:00:00Z",
    deletedAt: null
  }
]);

// 项目状态字典数据 - 从 props 传入
const projectStatusOptions = ref<Array<{ dictValue: number; dictLabel: string }>>(
  props.projectStatusOptions || []
);

// 监听 props 变化，更新字典数据
watch(
  () => props.projectStatusOptions,
  newVal => {
    if (newVal) {
      projectStatusOptions.value = newVal;
      console.log("项目状态字典数据更新:", newVal);
    }
  },
  { immediate: true, deep: true }
);

const rules = reactive({
  project_no: [{ required: true, message: "请输入项目编号", trigger: "blur" }],
  project_gcp_no: [
    { required: true, message: "请输入方案编号", trigger: "blur" }
  ],
  project_name: [
    { required: true, message: "请输入项目名称", trigger: "blur" }
  ],
  project_start_date: [
    { required: true, message: "请选择项目开始时间", trigger: "change" }
  ]
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
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="140px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="项目名称" prop="project_name">
          <el-input
            v-model="formInline.project_name"
            placeholder="请输入项目名称"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="项目编号" prop="project_no">
          <el-input
            v-model="formInline.project_no"
            placeholder="请输入项目编号"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="方案编号" prop="project_gcp_no">
          <el-input
            v-model="formInline.project_gcp_no"
            placeholder="请输入方案编号"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="申办方" prop="project_sponsor">
          <el-input
            v-model="formInline.project_sponsor"
            placeholder="请输入申办方"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="检测单位" prop="testing_unit">
          <el-input
            v-model="formInline.testing_unit"
            placeholder="请输入检测单位"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="项目开始时间" prop="project_start_date">
          <el-date-picker
            v-model="formInline.project_start_date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择项目开始时间"
            style="width: 100%"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="AE版本" prop="ae_version_value">
          <el-select
            v-model="formInline.ae_version_value"
            placeholder="请选择AE版本"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in aeVersionOptions"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目状态" prop="status">
          <el-select
            v-model="formInline.status"
            placeholder="请选择项目状态"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in projectStatusOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主要研究者" prop="pi">
          <el-input
            v-model="formInline.pi"
            placeholder="请输入主要研究者"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="研究者中心名称" prop="research_site_name">
          <el-input
            v-model="formInline.research_site_name"
            placeholder="请输入研究者中心名称"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="研究者中心编号" prop="research_site_no">
          <el-input
            v-model="formInline.research_site_no"
            placeholder="请输入研究者中心编号"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="项目介绍" prop="project_desc">
          <el-input
            v-model="formInline.project_desc"
            type="textarea"
            :rows="4"
            placeholder="请输入项目介绍"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>
