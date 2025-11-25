interface FormItemProps {
  /** 字典ID */
  dict_id?: number;
  /** 字典键（数据标签） */
  dict_key: string;
  /** 数据键值 */
  dict_value: string;
  /** 显示排序 */
  dict_sort: number;
  /** 状态 */
  status: number;
  /** 备注 */
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
