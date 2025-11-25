<script setup lang="ts">
import { ref, computed } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    role_id: undefined,
    role_name: "",
    role_key: "",
    role_sort: 0,
    status: 0,
    remark: "",
    admin: "",
    data_scope: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const { switchStyle } = usePublicHooks();

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
    <el-row :gutter="10">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色名称" prop="role_name">
          <el-input
            v-model="newFormInline.role_name"
            clearable
            placeholder="请输入角色名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="权限字符" prop="role_key">
          <el-input
            v-model="newFormInline.role_key"
            clearable
            placeholder="请输入权限字符"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色顺序" prop="role_sort">
          <el-input-number
            v-model="newFormInline.role_sort"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
            placeholder="请输入角色顺序"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :dxs="24" :sm="24">
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="newFormInline.status"
            :active-value="0"
            :inactive-value="1"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="管理员" prop="admin">
          <el-input
            v-model="newFormInline.admin"
            clearable
            placeholder="请输入管理员"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="数据权限" prop="data_scope">
          <el-input
            v-model="newFormInline.data_scope"
            clearable
            placeholder="请输入数据权限"
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
