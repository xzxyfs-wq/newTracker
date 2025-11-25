<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { dictApi } from "@/api/system";

const props = withDefaults(
  defineProps<
    FormProps & {
      groupList?: any[];
      dictTypeList?: any[];
      dictOptions?: Array<{ label: string; value: any }>;
      loadingDictOptions?: boolean;
      onLoadDictOptions?: (dictType?: string) => void;
    }
  >(),
  {
    formInline: () => ({
      config_id: undefined,
      config_group_id: undefined,
      config_name: "",
      config_key: "",
      config_value: "",
      input_type: "input",
      is_multiline: false,
      is_multiple: false,
      extend: "",
      description: "",
      status: 1,
      remark: ""
    }),
    groupList: () => [],
    dictTypeList: () => [],
    dictOptions: () => [],
    loadingDictOptions: false,
    onLoadDictOptions: undefined
  }
);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// 确保 extend 存在
if (!newFormInline.value.extend) {
  newFormInline.value.extend = "";
}
const groupList = computed(() => props.groupList || []);
const dictTypeList = computed(() => props.dictTypeList || []);

// 判断是否为编辑模式（有 config_id 则为编辑模式）
const isEdit = computed(() => !!newFormInline.value.config_id);

// 动态验证规则
const dynamicRules = computed(() => {
  const rules = { ...formRules };
  // 如果组件类型为 select，字典类型必填
  if (newFormInline.value.input_type === "select") {
    rules.extend = [
      { required: true, message: "字典类型为必填项", trigger: "change" }
    ];
  }
  return rules;
});

// 使用从 props 传入的字典选项
const formDictOptions = computed(() => props.dictOptions || []);
const loadingDictOptions = computed(() => props.loadingDictOptions || false);

// 记录已加载的字典类型，避免重复加载
const loadedDictType = ref<string>("");

// 加载字典选项的函数（调用父组件传入的方法）
function loadFormDictOptions(dictType?: string) {
  const targetDictType =
    dictType ||
    (typeof newFormInline.value.extend === "string"
      ? newFormInline.value.extend
      : newFormInline.value.extend?.dict_type_code);
  // 如果已经加载过相同的字典类型，不再重复加载
  if (
    targetDictType &&
    targetDictType !== loadedDictType.value &&
    props.onLoadDictOptions
  ) {
    loadedDictType.value = targetDictType;
    props.onLoadDictOptions(targetDictType);
  }
}

// 监听组件类型变化
watch(
  () => newFormInline.value.input_type,
  newVal => {
    if (newVal === "select") {
      newFormInline.value.is_multiline = false;
      // 如果已有字典类型，加载选项
      const extendValue =
        typeof newFormInline.value.extend === "string"
          ? newFormInline.value.extend
          : newFormInline.value.extend?.dict_type_code;
      if (extendValue) {
        loadFormDictOptions();
      }
    } else if (newVal === "input") {
      newFormInline.value.is_multiple = false;
      newFormInline.value.extend = "";
      // 字典选项由父组件管理，不需要在这里清空
    }
  }
);

// 组件挂载时，如果是编辑模式且是 select 类型，加载字典选项
onMounted(() => {
  if (
    newFormInline.value.input_type === "select" &&
    newFormInline.value.extend
  ) {
    const extendValue =
      typeof newFormInline.value.extend === "string"
        ? newFormInline.value.extend
        : newFormInline.value.extend?.dict_type_code;
    if (extendValue) {
      loadFormDictOptions(extendValue);
    }
  }
});

// 监听 extend 变化，当是 select 类型时自动加载字典选项
watch(
  () => [newFormInline.value.extend, newFormInline.value.input_type],
  ([extend, inputType], [oldExtend, oldInputType]) => {
    // 只在值真正变化时才加载
    if (inputType === "select" && extend) {
      const extendValue =
        typeof extend === "string" ? extend : extend?.dict_type_code;
      const oldExtendValue =
        oldExtend &&
        (typeof oldExtend === "string"
          ? oldExtend
          : (oldExtend as any)?.dict_type_code);
      // 只有当 extend 值变化或 input_type 从非 select 变为 select 时才加载
      if (
        extendValue &&
        extendValue !== oldExtendValue &&
        (extendValue !== loadedDictType.value || oldInputType !== "select")
      ) {
        loadFormDictOptions(extendValue);
      }
    } else if (inputType !== "select") {
      // 如果不是 select 类型，清空已加载记录
      loadedDictType.value = "";
    }
  }
);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="dynamicRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="所属组" prop="config_group_id">
          <el-select
            v-model="newFormInline.config_group_id"
            placeholder="请选择所属组"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="group in groupList"
              :key="group.config_group_id"
              :label="group.config_group_name"
              :value="group.config_group_id"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="配置标题" prop="config_name">
          <el-input
            v-model="newFormInline.config_name"
            clearable
            placeholder="请输入配置标题"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="配置标识" prop="config_key">
          <el-input
            v-model="newFormInline.config_key"
            :disabled="isEdit"
            clearable
            placeholder="请输入配置标识"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="配置值" prop="config_value">
          <!-- Input 单行类型 -->
          <el-input
            v-if="
              newFormInline.input_type === 'input' &&
              !newFormInline.is_multiline
            "
            v-model="newFormInline.config_value"
            clearable
            placeholder="请输入配置值"
          />
          <!-- Input 多行类型 -->
          <el-input
            v-else-if="
              newFormInline.input_type === 'input' && newFormInline.is_multiline
            "
            v-model="newFormInline.config_value"
            type="textarea"
            :rows="3"
            clearable
            placeholder="请输入配置值"
          />
          <!-- Select 类型：下拉框 -->
          <el-select
            v-else-if="newFormInline.input_type === 'select'"
            v-model="newFormInline.config_value"
            :placeholder="`请选择${newFormInline.config_name || '配置值'}`"
            :multiple="newFormInline.is_multiple"
            clearable
            style="width: 100%"
            :loading="loadingDictOptions"
          >
            <el-option
              v-for="opt in formDictOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="组件类型" prop="input_type">
          <el-select
            v-model="newFormInline.input_type"
            placeholder="请选择组件类型"
            style="width: 100%"
          >
            <el-option label="输入框" value="input" />
            <el-option label="下拉选择" value="select" />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.input_type === 'input'"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="是否多行">
          <el-radio-group v-model="newFormInline.is_multiline">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.input_type === 'select'"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="字典类型" prop="extend">
          <el-select
            v-model="newFormInline.extend"
            placeholder="请选择字典类型"
            clearable
            style="width: 100%"
            @change="loadFormDictOptions"
          >
            <el-option
              v-for="dict in dictTypeList"
              :key="dict.dict_type_id"
              :label="dict.dict_type_name"
              :value="dict.dict_type_code"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.input_type === 'select'"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="是否多选">
          <el-radio-group v-model="newFormInline.is_multiple">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="配置说明">
          <el-input
            v-model="newFormInline.description"
            type="textarea"
            :rows="3"
            placeholder="请输入配置说明"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
