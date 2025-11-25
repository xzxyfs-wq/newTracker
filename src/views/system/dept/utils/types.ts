interface FormItemProps {
  higher_dept_options: Record<string, unknown>[];
  parent_id: number;
  dept_name: string;
  sort: number;
  status: number;
  remark: string;
  dept_path?: string;
  dept_type?: number;
  dept_id?: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
