import { http } from "@/utils/http";

export type UserResult = {
  success?: boolean;
  code?: number;
  msg?: string;
  /** token */
  token?: string;
  /** 过期时间（ISO 格式字符串） */
  expire?: string;
  /** 过期秒数 */
  expire_seconds?: number;
  /** 用户名 */
  user_name?: string;
  /** 昵称 */
  last_name?: string;
  /** 角色key */
  rolekey?: string;
  /** 按钮级别权限 */
  permissions?: Array<string> | null;
  /** 用户ID */
  user_id?: number;
  /** 用户登录类型 */
  user_login_type?: number;
  /** 站点编号 */
  site_no?: string;
  /** 站点名称 */
  site_name?: string;
  /** 事件调度器警告时间 */
  EventSchedulersWarnTime?: string;
  /** 样本交付模式 */
  SampleDeliveryMode?: string;
  /** 是否有全名权限 */
  HasFullNameAuth?: boolean;
  /** 项目权限 */
  project_auth?: number;
  /** 医院区域ID */
  hospital_district_id?: number;
  /** 身份证号 */
  identify_no?: string;
  /** 链接用户ID */
  link_user_id?: string;
  /** 签名数据ID */
  sign_data_id?: string;
  /** 当前系统时间 */
  current_system_time?: string;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    token?: string;
    /** `token`（兼容旧字段名） */
    accessToken?: string;
    /** 用于调用刷新`token`的接口时所需的`token` */
    refreshToken: string;
    /** `token`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};
