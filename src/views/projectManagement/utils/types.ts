export interface FormItemProps {
  project_id?: number;
  project_no?: string;
  project_gcp_no?: string;
  project_name?: string;
  project_desc?: string;
  project_sponsor?: string;
  testing_unit?: string;
  project_start_date?: string;
  ae_version_value?: string;
  pi?: string;
  research_site_name?: string;
  research_site_no?: string;
  status?: number | string;
  source?: number;
  create_by?: number;
  created_at?: string;
  update_by?: number;
  updated_at?: string;
}

export interface DictItem {
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass?: string;
  listClass?: string;
  isDefault?: string;
  status?: string;
  expand?: string;
  default?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  params?: string;
  dataScope?: string;
  dictTypes?: any;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

