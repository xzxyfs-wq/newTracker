import { http } from "@/utils/http";

/** 院区配置项 */
export type HospitalDistrictItem = {
  /** 院区ID */
  hospital_district_id: number;
  /** 院区编号 */
  hospital_district_no: string;
  /** 院区名称 */
  hospital_district_name: string;
  /** 是否使用 */
  is_use: number;
  /** 状态 */
  status: number;
  /** 院区IDs */
  hospital_district_ids: any;
  /** 创建人 */
  create_by: number;
  /** 创建时间 */
  created_at: string;
  /** 更新人 */
  update_by: number;
  /** 更新时间 */
  updated_at: string;
};

/** 院区列表返回结果 */
export type HospitalDistrictListResult = {
  code: number;
  msg?: string;
  data: {
    /** 列表数据 */
    list: HospitalDistrictItem[];
    /** 总条目数 */
    count: number;
    /** 当前页数 */
    page_index: number;
    /** 每页显示条目个数 */
    page_size: number;
  };
};

/** 启用/停用院区返回结果 */
export type SwitchStatusResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 新增院区请求参数 */
export type AddHospitalParams = {
  /** 院区编号 */
  hospital_district_no: string;
  /** 院区名称 */
  hospital_district_name: string;
};

/** 修改院区请求参数 */
export type UpdateHospitalParams = {
  /** 院区ID */
  hospital_district_id: number;
  /** 院区编号 */
  hospital_district_no: string;
  /** 院区名称 */
  hospital_district_name: string;
};

/** 新增/修改院区返回结果 */
export type HospitalOperationResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 删除院区返回结果 */
export type DeleteHospitalResult = {
  code: number;
  msg?: string;
  data?: any;
};

export default {
  /** 获取院区配置列表 */
  getHospitalList: (params?: object) => {
    return http.request<HospitalDistrictListResult>(
      "get",
      "/api/admin/hospital_districts",
      {
        params
      }
    );
  },

  /** 新增院区 */
  addHospital: (data: AddHospitalParams) => {
    return http.request<HospitalOperationResult>(
      "post",
      "/api/admin/hospital_district",
      {
        data
      }
    );
  },

  /** 修改院区 */
  updateHospital: (data: UpdateHospitalParams) => {
    return http.request<HospitalOperationResult>(
      "put",
      "/api/admin/hospital_district",
      {
        data
      }
    );
  },

  /** 启用/停用院区 */
  switchStatus: (data?: { hospital_district_ids: number[] }) => {
    return http.request<SwitchStatusResult>(
      "post",
      "/api/admin/hospital_district/switch_status",
      {
        data
      }
    );
  },

  /** 删除院区 */
  deleteHospital: (hospital_district_id: number) => {
    return http.request<DeleteHospitalResult>(
      "delete",
      "/api/admin/hospital_district/" + hospital_district_id
    );
  }
};
