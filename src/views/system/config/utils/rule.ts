import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive<FormRules>({
  config_group_id: [
    { required: true, message: "所属组为必填项", trigger: "change" }
  ],
  config_name: [
    { required: true, message: "配置标题为必填项", trigger: "blur" }
  ],
  config_key: [
    { required: true, message: "配置标识为必填项", trigger: "blur" }
  ],
  config_value: [
    // 配置值非必填
  ],
  component_type: [
    { required: true, message: "组件类型为必填项", trigger: "change" }
  ]
});
