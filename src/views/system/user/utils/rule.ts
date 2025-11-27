import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isPhone, isEmail } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  nick_name: [{ required: true, message: "用户昵称为必填项", trigger: "blur" }],
  username: [{ required: true, message: "用户名称为必填项", trigger: "blur" }],
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
      // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
    }
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  dept_id: [
    {
      validator: (rule, value, callback) => {
        if (!value || value === 0 || value === "") {
          callback(new Error("归属部门为必填项"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  post_id: [{ required: true, message: "岗位为必填项", trigger: "change" }],
  role_ids: [{ required: true, message: "角色为必填项", trigger: "change" }],
  identify_no: [
    {
      validator: (rule, value, callback) => {
        if (value === "" || !value) {
          callback();
        } else {
          // 支持15位或18位身份证号码
          const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$|^[1-9]\d{7}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/;
          if (!idCardRegex.test(value)) {
            callback(new Error("请输入正确的证件号格式（15位或18位）"));
          } else {
            callback();
          }
        }
      },
      trigger: "blur"
    }
  ]
});
