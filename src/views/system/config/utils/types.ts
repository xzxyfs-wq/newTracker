interface FormItemProps {
  config_id?: number;
  group_name?: string; // 所属组（前端字段，已废弃）
  config_group_id?: number; // 所属组ID（前端字段）
  config_group_name?: string; // 配置组名称（接口返回）
  config_name?: string; // 配置名称（接口返回）
  config_key: string; // 配置标识
  config_value: string; // 配置值
  component_type?: "input" | "select"; // 组件类型（前端字段）
  input_type?: "input" | "select"; // 输入类型（接口返回）
  is_multiline?: boolean; // 是否多行（仅input类型）
  is_multiple?: boolean; // 是否多选（仅select类型）
  dict_type_code?: string; // 字典类型代码（select类型使用字典作为数据源，已废弃，使用extend）
  extend?: string | { dict_type_code?: string; [key: string]: any }; // 扩展字段（字典类型代码或其他扩展信息）
  description?: string; // 配置说明（前端字段）
  remark?: string; // 备注（接口返回）
  status?: number;
  options?: Array<{ label: string; value: any }>; // 选项列表（select类型，从接口获取）
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
