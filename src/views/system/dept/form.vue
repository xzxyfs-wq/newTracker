<script setup lang="ts">
import { ref, computed } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higher_dept_options: [],
    parent_id: undefined,
    dept_name: "",
    sort: 0,
    status: 1,
    remark: "",
    dept_path: "",
    dept_type: 1
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

// 处理上级部门变化事件
function handleParentIdChange(value: number | undefined) {
  if (value && value !== 0) {
    // 有上级部门时，部门类型必须是公司
    newFormInline.value.dept_type = 2;
  }
}

// 处理部门类型变化事件
function handleDeptTypeChange(value: number) {
  if (value === 1) {
    // 科室类型时，清空上级部门
    newFormInline.value.parent_id = undefined;
  }
}

// 计算部门类型选择器是否禁用
const isDeptTypeDisabled = computed(() => {
  return !!(
    newFormInline.value.parent_id && newFormInline.value.parent_id !== 0
  );
});

// 计算是否显示上级部门选择器
const showParentDept = computed(() => {
  return newFormInline.value.dept_type !== 1;
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
      <re-col v-if="showParentDept">
        <el-form-item label="上级部门">
          <el-tree-select
            v-model="newFormInline.parent_id"
            class="w-full"
            :data="
              newFormInline.higher_dept_options.filter(
                item => item.dept_type === 2
              )
            "
            :props="{
              value: 'dept_id',
              label: 'dept_name',
              children: 'children'
            }"
            placeholder="请选择上级部门"
            clearable
            filterable
            check-strictly
            @change="handleParentIdChange"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="dept_name">
          <el-input
            v-model="newFormInline.dept_name"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门类型">
          <el-select
            v-model="newFormInline.dept_type"
            placeholder="请选择部门类型"
            :disabled="isDeptTypeDisabled"
            @change="handleDeptTypeChange"
          >
            <el-option label="科室" :value="1" />
            <el-option label="公司" :value="2" />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="排序">
          <el-input-number
            v-model="newFormInline.sort"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="-1"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
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
