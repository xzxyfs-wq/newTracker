import { serviceCall } from "@/utils/http";

/** 获取系统管理-用户管理列表 */
export const getUserList = (params?: object) => {
  return serviceCall<responseResult>({ action: "GetUserList", params });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = (params?: object) => {
  return serviceCall({ action: "GetAllRoleList", params });
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (params?: object) => {
  return serviceCall({ action: "GetRoleIds", params });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (params?: object) => {
  return serviceCall({ action: "GetMenuList", params });
};

/** 部门列表返回结果 */
type DeptListResult = {
  code: number;
  msg?: string;
  data?: Array<any>;
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (params?: object) => {
  return serviceCall({ action: "GetDeptList", params });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (params?: object) => {
  return serviceCall({ action: "GetOnlineLogsList", params });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (params?: object) => {
  return serviceCall({ action: "GetLoginLogsList", params });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (params?: object) => {
  return serviceCall({ action: "GetOperationLogsList", params });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (params?: object) => {
  return serviceCall({ action: "GetSystemLogsList", params });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (params?: object) => {
  return serviceCall({ action: "GetSystemLogsDetail", params });
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (params?: object) => {
  return serviceCall({ action: "GetRoleMenu", params });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (params?: object) => {
  return serviceCall({ action: "GetRoleMenuIds", params });
};
interface responseResultWithPage {
  success: boolean;
  error?: string;
  data: {
    list: any[];
    count: number;
    page: number;
    page_size: number;
  };
}
interface responseResult {
  success: boolean;
  error?: string;
  data: any[];
}

/** 获取系统管理-角色管理列表 */
export const getRoleList = (params?: object) => {
  return serviceCall({ action: "GetRoleList", params });
};

/** 系统管理-角色管理 API */
export const roleApi = {
  getRoleList: (params?: object) => {
    return serviceCall<responseResultWithPage>({
      action: "get_role_list",
      mod: "role",
      params
    });
  },
  addRole: (params?: object) => {
    return serviceCall<responseResult>({
      action: "insert_role",
      mod: "role",
      params
    });
  },
  updateRole: (params?: object) => {
    return serviceCall<responseResult>({
      action: "update_role",
      mod: "role",
      params
    });
  },
  deleteRole: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_role",
      mod: "role",
      params
    });
  }
};

/** 新增角色 */
export const addRole = (params?: object) => {
  return serviceCall({ action: "AddRole", params });
};

/** 编辑角色 */
export const updateRole = (params?: object) => {
  return serviceCall({ action: "UpdateRole", params });
};

/** 删除角色 */
export const deleteRole = (params?: object) => {
  return serviceCall({ action: "DeleteRole", params });
};
/** 系统管理-字典管理 API */
export const dictApi = {
  getDictTypeList: (params?: object) => {
    return serviceCall<responseResultWithPage>({
      action: "get_dict_type_list",
      mod: "dict",
      params
    });
  },
  addDictType: (params?: object) => {
    return serviceCall<responseResult>({
      action: "create_dict_type",
      mod: "dict",
      params
    });
  },
  updateDictType: (params?: object) => {
    return serviceCall<responseResult>({
      action: "update_dict_type",
      mod: "dict",
      params
    });
  },
  deleteDictType: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_dict_type",
      mod: "dict",
      params
    });
  },
  getDictDataList: (params?: object) => {
    return serviceCall<responseResultWithPage>({
      action: "get_dict_data_list",
      mod: "dict",
      params
    });
  },
  getDictByType: (params?: object) => {
    return serviceCall<responseResult>({
      action: "get_dict_data_by_type",
      mod: "dict",
      params
    });
  },
  addDictData: (params?: object) => {
    return serviceCall<responseResult>({
      action: "create_dict_data",
      mod: "dict",
      params
    });
  },
  updateDictData: (params?: object) => {
    return serviceCall<responseResult>({
      action: "update_dict_data",
      mod: "dict",
      params
    });
  },
  deleteDictData: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_dict_data",
      mod: "dict",
      params
    });
  }
};

/** 系统管理-参数管理 API */
export const configApi = {
  getConfigList: (params?: object) => {
    return serviceCall<responseResultWithPage>({
      action: "get_config_list",
      mod: "config",
      params
    });
  },
  addConfig: (params?: object) => {
    return serviceCall<responseResult>({
      action: "insert_config",
      mod: "config",
      params
    });
  },
  updateConfig: (params?: object) => {
    return serviceCall<responseResult>({
      action: "update_config_by_keys",
      mod: "config",
      params
    });
  },
  deleteConfig: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_config",
      mod: "config",
      params
    });
  },
  createConfigGroup: (params?: object) => {
    return serviceCall<responseResult>({
      action: "create_config_group",
      mod: "config",
      params
    });
  },
  getConfigGroupList: (params?: object) => {
    return serviceCall<responseResult>({
      action: "get_config_group_list",
      mod: "config",
      params
    });
  },
  deleteConfigGroup: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_config_group",
      mod: "config",
      params
    });
  },
  getConfig: (params?: object) => {
    return serviceCall<responseResult>({
      action: "get_config",
      mod: "config",
      params
    });
  }
};

/** 系统管理-部门管理 API */
export const deptApi = {
  getDeptList: (params?: object) => {
    return serviceCall<responseResult>({
      action: "get_dept_list",
      mod: "dept",
      params
    });
  },

  addDept: (params?: object) => {
    return serviceCall<responseResult>({
      action: "insert_dept",
      mod: "dept",
      params
    });
  },
  updateDept: (params?: object) => {
    return serviceCall<responseResult>({
      action: "update_dept",
      mod: "dept",
      params
    });
  },
  deleteDept: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_dept",
      mod: "dept",
      params
    });
  }
};

/** 系统管理-岗位管理 API */
export const postApi = {
  getPostList: (params?: object) => {
    return serviceCall<responseResultWithPage>({
      action: "get_post_list",
      mod: "post",
      params
    });
  },
  addPost: (params?: object) => {
    return serviceCall<responseResult>({
      action: "insert_post",
      mod: "post",
      params
    });
  },
  updatePost: (params?: object) => {
    return serviceCall<responseResult>({
      action: "update_post",
      mod: "post",
      params
    });
  },
  deletePost: (params?: object) => {
    return serviceCall<responseResult>({
      action: "delete_post",
      mod: "post",
      params
    });
  }
};
