import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  dict_key: [{ required: true, message: "数据标签为必填项", trigger: "blur" }],
  dict_value: [
    { required: true, message: "数据键值为必填项", trigger: "blur" }
  ],
  dict_sort: [{ required: true, message: "显示排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "change" }]
});
