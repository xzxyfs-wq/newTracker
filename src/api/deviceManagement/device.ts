import { http } from "@/utils/http";

/** 设备项 */
export type DeviceItem = {
  device_id?: number;
  device_name?: string;
  device_barcode?: string;
  device_type_id?: number;
  device_type_name?: string;
  device_type_code?: string;
  room_id?: number;
  room_name?: string;
  device_model?: string;
  device_no?: string;
  brand?: string;
  sort?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

/** 设备列表返回结果 */
export type DeviceListResult = {
  code: number;
  msg?: string;
  data: {
    /** 列表数据 */
    list: DeviceItem[];
    /** 总条目数 */
    count: number;
    /** 当前页数 */
    page_index: number;
    /** 每页显示条目个数 */
    page_size: number;
  };
};

/** 设备详情返回结果 */
export type DeviceDetailResult = {
  code: number;
  msg?: string;
  data?: DeviceItem;
};

/** 新增设备请求参数 */
export type AddDeviceParams = {
  device_name: string;
  device_barcode: string;
  device_type_id: number;
  room_id: number;
  device_model?: string;
  device_no?: string;
  brand?: string;
  sort?: number;
  status?: number;
  [key: string]: any;
};

/** 修改设备请求参数 */
export type UpdateDeviceParams = {
  device_id: number;
  device_name: string;
  device_barcode: string;
  device_type_id: number;
  room_id: number;
  device_model?: string;
  device_no?: string;
  brand?: string;
  sort?: number;
  status?: number;
  [key: string]: any;
};

/** 新增/修改设备返回结果 */
export type DeviceOperationResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 删除设备返回结果 */
export type DeleteDeviceResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 设备类型返回结果 */
export type DeviceTypeResult = {
  code: number;
  msg?: string;
  data?: Array<{
    device_type_code: string;
    device_type_id: number;
    device_type_name: string;
    [key: string]: any;
  }>;
};

/** 字典数据项 */
export type DictItem = {
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  [key: string]: any;
};

/** 字典数据返回结果 */
export type DictResult = {
  code: number;
  msg?: string;
  data?: DictItem[];
};

export default {
  /** 获取设备管理列表 */
  getDeviceList: (params?: object) => {
    return http.request<DeviceListResult>("get", "/api/admin/devices", {
      params
    });
  },

  /** 获取设备类型列表 */
  getDeviceTypeList: () => {
    return http.request<DeviceTypeResult>("get", "/api/admin/device_type_all");
  },

  /** 获取设备详情 */
  getDevice: (deviceId: number) => {
    return http.request<DeviceDetailResult>(
      "get",
      `/api/admin/device/${deviceId}`
    );
  },

  /** 新增设备 */
  addDevice: (data: AddDeviceParams) => {
    return http.request<DeviceOperationResult>("post", "/api/admin/device", {
      data
    });
  },

  /** 修改设备 */
  updateDevice: (data: UpdateDeviceParams) => {
    return http.request<DeviceOperationResult>("put", "/api/admin/device", {
      data
    });
  },

  /** 删除设备 */
  deleteDevice: (deviceId: number) => {
    return http.request<DeleteDeviceResult>(
      "delete",
      `/api/admin/device/${deviceId}`
    );
  },

  /** 获取储位列表 */
  getStoreList: (params?: {
    page_index?: number;
    page_size?: number;
    is_all_list?: number;
    fridge_id?: number;
    device_type_code?: string;
    is_store?: number;
    parent_id?: number;
  }) => {
    return http.request<DeviceListResult>("get", "/api/admin/stores", {
      params
    });
  },

  /** 获取层列表 */
  getFloorList: (params?: {
    parent_id?: number;
    device_type_code?: string;
    is_floor?: number;
    page_size?: number;
  }) => {
    return http.request<DeviceListResult>("get", "/api/admin/floors", {
      params
    });
  },

  /** 新增储位 */
  addStore: (data?: { parent_device_id: number; device_name: string }) => {
    return http.request<DeviceOperationResult>(
      "post",
      "/api/admin/device/store",
      {
        data
      }
    );
  },

  /** 修改储位 */
  updateStore: (data?: { device_id: number; device_name: string }) => {
    return http.request<DeviceOperationResult>(
      "put",
      "/api/admin/device/store",
      {
        data
      }
    );
  },

  /** 删除储位 */
  deleteStore: (deviceId: number) => {
    return http.request<DeleteDeviceResult>(
      "delete",
      `/api/admin/device/store/${deviceId}`
    );
  },

  /** 切换设备状态 */
  switchStatus: (device_id: number) => {
    return http.request<DeviceOperationResult>(
      "put",
      "/api/admin/device/status",
      { data: { device_id } }
    );
  },

  /** 获取离心机类型列表 */
  getCentrifugeTypeList: () => {
    return http.request<DictResult>(
      "get",
      "/api/v1/dict/databytype/centrifuge_type"
    );
  },

  /** 获取试管类型列表 */
  getTransferTypeList: () => {
    return http.request<DictResult>(
      "get",
      "/api/v1/dict/databytype/transfer_type_map"
    );
  }
};
