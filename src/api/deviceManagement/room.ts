import { http } from "@/utils/http";

/** 房间项 */
export type RoomItem = {
  /** 房间ID */
  room_id?: number;
  /** 房间名称 */
  room_name?: string;
  /** 房间编号 */
  room_no?: string;
  /** 排序 */
  order_by?: number;
  /** 院区ID */
  hospital_district_id?: number;
  /** 院区名称 */
  hospital_district_name?: string;
  /** 状态 */
  status?: number;
  /** 创建时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
  [key: string]: any;
};

/** 房间列表返回结果 */
export type RoomListResult = {
  code: number;
  msg?: string;
  data: {
    /** 列表数据 */
    list: RoomItem[];
    /** 总条目数 */
    count: number;
    /** 当前页数 */
    page_index: number;
    /** 每页显示条目个数 */
    page_size: number;
  };
};

/** 房间详情返回结果 */
export type RoomDetailResult = {
  code: number;
  msg?: string;
  data?: RoomItem;
};

/** 新增房间请求参数 */
export type AddRoomParams = {
  /** 房间名称 */
  room_name: string;
  /** 房间编号 */
  room_no?: string;
  /** 排序 */
  order_by?: number;
  /** 院区ID */
  hospital_district_id?: number;
  /** 院区名称 */
  hospital_district_name?: string;
  [key: string]: any;
};

/** 修改房间请求参数 */
export type UpdateRoomParams = {
  /** 房间ID */
  room_id: number;
  /** 房间名称 */
  room_name: string;
  /** 房间编号 */
  room_no?: string;
  /** 排序 */
  order_by?: number;
  /** 院区ID */
  hospital_district_id?: number;
  /** 院区名称 */
  hospital_district_name?: string;
  [key: string]: any;
};

/** 新增/修改房间返回结果 */
export type RoomOperationResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 删除房间返回结果 */
export type DeleteRoomResult = {
  code: number;
  msg?: string;
  data?: any;
};

export default {
  /** 获取房间列表 */
  getRoomList: (params?: object) => {
    return http.request<RoomListResult>("get", "/api/admin/rooms", {
      params
    });
  },

  /** 获取所有房间列表 */
  getAllRoomList: () => {
    return http.request<RoomListResult>("get", "/api/admin/room_all");
  },

  /** 获取所有院区列表 */
  getAllHospitalDistrictList: () => {
    return http.request<{
      code: number;
      msg?: string;
      data: Array<{
        hospital_district_id: number;
        hospital_district_name: string;
        [key: string]: any;
      }>;
    }>("get", "/api/admin/hospital_district_all");
  },

  /** 获取房间详情 */
  getRoom: (roomId: number) => {
    return http.request<RoomDetailResult>("get", `/api/admin/room/${roomId}`);
  },

  /** 新增房间 */
  addRoom: (data: AddRoomParams) => {
    return http.request<RoomOperationResult>("post", "/api/admin/room", {
      data
    });
  },

  /** 修改房间 */
  updateRoom: (data: UpdateRoomParams) => {
    return http.request<RoomOperationResult>("put", "/api/admin/room", {
      data
    });
  },

  /** 删除房间 */
  deleteRoom: (roomId: number) => {
    return http.request<DeleteRoomResult>(
      "delete",
      `/api/admin/room/${roomId}`
    );
  }
};
