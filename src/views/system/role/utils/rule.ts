import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  role_name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  role_key: [{ required: true, message: "权限字符为必填项", trigger: "blur" }],
  role_sort: [{ required: true, message: "角色顺序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "change" }]
});
