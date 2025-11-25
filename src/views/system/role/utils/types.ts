interface FormItemProps {
  role_id?: number;
  role_name: string;
  role_key: string;
  role_sort: number;
  status: number;
  remark: string;
  admin?: string;
  data_scope?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
