interface FormItemProps {
  dict_type_id?: number;
  dict_type_name: string;
  dict_type_code: string;
  status: number;
  remark?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
