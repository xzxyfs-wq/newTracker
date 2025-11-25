import { http } from "@/utils/http";

/** 样本处理流程列表返回结果 */
export type TaskTypeListResult = {
  code: number;
  msg?: string;
  data: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    count: number;
    /** 当前页数 */
    page_index: number;
    /** 每页显示条目个数 */
    page_size: number;
  };
};

/** 通用操作返回结果 */
export type TaskTypeOperationResult = {
  code: number;
  msg?: string;
  data?: any;
};

export default {
  /** 获取样本处理流程列表 */
  getTaskTypeList: (params?: object) => {
    return http.request<TaskTypeListResult>("get", "/api/admin/task_types", {
      params
    });
  },

  /** 获取样本处理流程详情 */
  getTaskType: (taskTypeId: number) => {
    return http.request<TaskTypeOperationResult>(
      "get",
      `/api/admin/task_type/${taskTypeId}`
    );
  },

  /** 新增样本处理流程 */
  addTaskType: (data: object) => {
    return http.request<TaskTypeOperationResult>(
      "post",
      "/api/admin/task_type",
      {
        data
      }
    );
  },

  /** 修改样本处理流程 */
  updateTaskType: (data: object) => {
    return http.request<TaskTypeOperationResult>(
      "put",
      "/api/admin/task_type",
      {
        data
      }
    );
  },

  /** 修改状态（启用/禁用） */
  updateStatus: (data: { task_type_id: number }) => {
    return http.request<TaskTypeOperationResult>(
      "put",
      "/api/admin/task_type/status",
      {
        data
      }
    );
  },

  /** 修改显示状态（显示/隐藏） */
  updateDisplayStatus: (data: { task_type_id: number }) => {
    return http.request<TaskTypeOperationResult>(
      "put",
      "/api/admin/task_type/display",
      {
        data
      }
    );
  },

  /** 删除样本处理流程 */
  deleteTaskType: (taskTypeId: number) => {
    return http.request<TaskTypeOperationResult>(
      "delete",
      `/api/admin/task_type/${taskTypeId}`
    );
  },

  getTaskTypeCode: () => {
    return http.request<TaskTypeOperationResult>(
      "get",
      "/api/v1/dict/databytype/task_type_code"
    );
  }
};
