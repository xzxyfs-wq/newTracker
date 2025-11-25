<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import dictApi from "@/api/dict";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    dict_type_id: undefined,
    dict_type_name: "",
    dict_type_code: "",
    status: 1,
    remark: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const statusOptions = ref<any[]>([]);

// 判断是否为编辑模式（有 dict_type_id 则为编辑模式）
const isEdit = computed(() => !!newFormInline.value.dict_type_id);

async function loadStatusOptions() {
  try {
    const response = await dictApi.getDictByType("sys_normal_disable");
    if (response?.data && Array.isArray(response.data)) {
      statusOptions.value = response.data;
    }
  } catch (error) {
    console.error("获取状态字典失败:", error);
    statusOptions.value = [];
  }
}

onMounted(() => {
  // loadStatusOptions();
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="字典名称" prop="dict_type_name">
          <el-input
            v-model="newFormInline.dict_type_name"
            :disabled="isEdit"
            clearable
            placeholder="请输入字典名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="字典类型" prop="dict_type_code">
          <el-input
            v-model="newFormInline.dict_type_code"
            :disabled="isEdit"
            clearable
            placeholder="请输入字典类型"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="newFormInline.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="-1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
