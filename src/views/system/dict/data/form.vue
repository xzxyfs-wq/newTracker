<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "../../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    dict_data_id: undefined,
    dict_key: "",
    dict_value: "",
    dict_sort: 0,
    status: 0,
    remark: ""
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

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
        <el-form-item label="数据标签" prop="dict_key">
          <el-input
            v-model="newFormInline.dict_key"
            clearable
            placeholder="请输入数据标签"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="数据键值" prop="dict_value">
          <el-input
            v-model="newFormInline.dict_value"
            clearable
            placeholder="请输入数据键值"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="显示排序" prop="dict_sort">
          <el-input-number
            v-model="newFormInline.dict_sort"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
            placeholder="请输入显示排序"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择状态"
            class="w-full!"
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="-1" />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
