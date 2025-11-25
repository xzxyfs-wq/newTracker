<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    higherDeptOptions: [],
    postOptions: [],
    roleOptions: [],
    dept_id: "",
    nick_name: "",
    username: "",
    phone: "",
    email: "",
    status: 1,
    project_auth: 1,
    role_ids: [],
    post_id: "",
    barcode: "",
    salt: "",
    user_login_type: 0
  })
});

const ruleFormRef = ref();
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
    label-width="80px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户昵称" prop="nick_name">
          <el-input
            v-model="newFormInline.nick_name"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="工号" prop="barcode">
          <el-input
            v-model="newFormInline.barcode"
            clearable
            placeholder="请输入工号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="归属部门" prop="dept_id">
          <el-tree-select
            v-model="newFormInline.dept_id"
            class="w-full"
            :data="newFormInline.higherDeptOptions"
            :props="{
              value: 'dept_id',
              label: 'dept_name',
              children: 'children'
            }"
            check-strictly
            clearable
            filterable
            placeholder="请选择归属部门"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="岗位" prop="post_id">
          <el-select
            v-model="newFormInline.post_id"
            placeholder="请选择岗位"
            class="w-full"
            clearable
          >
            <el-option
              v-for="item in newFormInline.postOptions"
              :key="item.post_id"
              :label="item.post_name"
              :value="item.post_id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色" prop="role_ids">
          <el-select
            v-model="newFormInline.role_ids"
            placeholder="请选择角色"
            class="w-full"
            clearable
            multiple
          >
            <el-option
              v-for="item in newFormInline.roleOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户状态">
          <el-radio-group v-model="newFormInline.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="-1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所有项目权限">
          <template #label>
            <span style="line-height: 1.1">所有项目权限</span>
          </template>
          <el-radio-group v-model="newFormInline.project_auth">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="-1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
