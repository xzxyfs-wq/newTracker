import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive<FormRules>({
  post_name: [{ required: true, message: "岗位名称为必填项", trigger: "blur" }],
  post_code: [{ required: true, message: "岗位编码为必填项", trigger: "blur" }]
});

