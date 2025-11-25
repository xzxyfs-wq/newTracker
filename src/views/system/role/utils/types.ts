interface FormItemProps {
  role_id?: number;
  role_name: string;
  role_key: string;
  role_sort: number;
  status: number;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
