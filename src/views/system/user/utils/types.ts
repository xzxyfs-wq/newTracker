interface FormItemProps {
  user_id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  higherDeptOptions: Record<string, unknown>[];
  postOptions: any[];
  roleOptions: any[];
  dept_id: number | string;
  nick_name: string;
  username: string;
  phone: string | number;
  email: string;
  status: number;
  role_ids?: number[];
  post_id?: number | string;
  barcode?: string;
  salt?: string;
  project_auth?: number;
  user_login_type?: number;
}
interface FormProps {
  formInline: FormItemProps;
}

interface RoleFormItemProps {
  username: string;
  nick_name: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
