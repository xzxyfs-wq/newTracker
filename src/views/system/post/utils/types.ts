interface FormItemProps {
  post_name: string;
  post_code: string;
  sort: number;
  status: number;
  remark: string;
  post_id?: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };

