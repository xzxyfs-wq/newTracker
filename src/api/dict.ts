import { http, request } from "@/utils/http";

/** 字典项 */
export type DictItem = {
  /** 字典值 */
  value?: string | number;
  /** 字典标签 */
  label?: string;
  /** 字典编码 */
  code?: string;
  /** 字典类型 */
  type?: string;
  [key: string]: any;
};

/** 字典数据返回结果 */
export type DictResult = {
  code: number;
  msg?: string;
  data?: DictItem[] | any;
};

export default {
  /** 根据类型获取字典数据 */
  getDictByType: (type: string) => {
    return http.request<DictResult>("get", `/api/v1/dict/databytype/${type}`);
  }
};
