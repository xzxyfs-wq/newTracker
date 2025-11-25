import { http } from "@/utils/http";

/** 项目列表返回结果 */
export type ProjectListResult = {
  code: number;
  msg?: string;
  data?: {
    list: Array<any>;
    count?: number;
    total?: number;
    [key: string]: any;
  };
};

/** 项目详情返回结果 */
export type ProjectDetailResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 项目操作返回结果 */
export type ProjectOperationResult = {
  code: number;
  msg?: string;
  data?: any;
};

/** 新增项目请求参数 */
export type AddProjectParams = {
  project_no: string;
  project_gcp_no: string;
  project_name: string;
  project_desc?: string;
  project_sponsor?: string;
  testing_unit?: string;
  project_start_date?: string;
  ae_version_value?: string;
  status?: number | string;
  pi?: string;
  research_site_name?: string;
  research_site_no?: string;
  [key: string]: any;
};

/** 修改项目请求参数 */
export type UpdateProjectParams = {
  project_id: number;
  project_no: string;
  project_gcp_no: string;
  project_name: string;
  project_desc?: string;
  project_sponsor?: string;
  testing_unit?: string;
  project_start_date?: string;
  ae_version_value?: string;
  status?: number | string;
  pi?: string;
  research_site_name?: string;
  research_site_no?: string;
  [key: string]: any;
};

/** 删除项目返回结果 */
export type DeleteProjectResult = {
  code: number;
  msg?: string;
  data?: any;
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

// Mock 数据
const mockProjectList = [
  {
    project_id: 3,
    project_no: "3",
    project_gcp_no: "3",
    project_name: "3",
    project_sponsor: "",
    testing_unit: "",
    project_desc: "",
    project_start_date: "2025-11-17",
    status: 1,
    source: -1,
    create_username: "超级管理员",
    update_username: "超级管理员",
    ae_version: "",
    ae_version_value: "",
    search: "",
    page_limit: 0,
    is_unset_lock: 0,
    create_by: 1,
    created_at: "2025-11-17 12:07:25",
    update_by: 0,
    updated_at: "2025-11-17 12:07:25",
    is_director: 0,
    operate_limit: 0,
    admin_user_id: 0,
    pi: "",
    research_site_name: "",
    research_site_no: ""
  },
  {
    project_id: 2,
    project_no: "2",
    project_gcp_no: "2",
    project_name: "2",
    project_sponsor: "",
    testing_unit: "",
    project_desc: "",
    project_start_date: "2025-10-27",
    status: 1,
    source: -1,
    create_username: "超级管理员",
    update_username: "超级管理员",
    ae_version: "",
    ae_version_value: "",
    search: "",
    page_limit: 0,
    is_unset_lock: 0,
    create_by: 1,
    created_at: "2025-11-17 12:06:10",
    update_by: 0,
    updated_at: "2025-11-17 12:06:10",
    is_director: 0,
    operate_limit: 0,
    admin_user_id: 0,
    pi: "",
    research_site_name: "",
    research_site_no: ""
  },
  {
    project_id: 1,
    project_no: "1",
    project_gcp_no: "1",
    project_name: "1",
    project_sponsor: "",
    testing_unit: "",
    project_desc: "",
    project_start_date: "2025-11-15",
    status: 1,
    source: -1,
    create_username: "超级管理员",
    update_username: "超级管理员",
    ae_version: "",
    ae_version_value: "",
    search: "",
    page_limit: 0,
    is_unset_lock: 0,
    create_by: 1,
    created_at: "2025-11-15 08:07:50",
    update_by: 0,
    updated_at: "2025-11-15 08:07:50",
    is_director: 0,
    operate_limit: 0,
    admin_user_id: 0,
    pi: "",
    research_site_name: "",
    research_site_no: ""
  }
];

type Result = {
  success: boolean;
  data?: any;
  message?: string;
};

export default {
  /** 获取项目管理列表 */
  getProjectList: (params?: {
    project_name?: string;
    project_no?: string;
    project_gcp_no?: string;
    page_index?: number;
    page_size?: number;
    is_all_list?: number;
  }) => {
    return http.request<ProjectListResult>("get", "/api/admin/projects", {
      params
    });
  },

  /** 获取项目详情 */
  getProject: (projectId: number) => {
    return http.request<ProjectDetailResult>(
      "get",
      `/api/admin/project/${projectId}`
    );
  },

  /** 新增项目 */
  addProject: (data: AddProjectParams) => {
    return http.request<ProjectOperationResult>("post", "/api/admin/project", {
      data
    });
  },

  /** 修改项目 */
  updateProject: (data: UpdateProjectParams) => {
    return http.request<ProjectOperationResult>("put", "/api/admin/project", {
      data
    });
  },

  /** 删除项目 */
  deleteProject: (projectId: number) => {
    return http.request<DeleteProjectResult>(
      "delete",
      `/api/admin/project/${projectId}`
    );
  },

  /** 获取项目样本类型列表 */
  getSampleTypeList: (params?: {
    project_id: number;
    page_index?: number;
    page_size?: number;
  }) => {
    return http.request<ProjectListResult>("get", "/api/admin/sample_types", {
      params
    });
  },

  /** 根据项目ID获取项目方案列表 */
  getProjectPlans: (projectId: number) => {
    return http.request<ProjectListResult>(
      "get",
      `/api/admin/project_plan_all/${projectId}`
    );
  },

  /** 新增项目方案 */
  addProjectPlan: (data: {
    project_id: number;
    plan_no: string;
    pk_plan_no?: string;
    copy_project_plan_id?: number;
  }) => {
    return http.request<ProjectOperationResult>(
      "post",
      "/api/admin/project_plan",
      {
        data
      }
    );
  },

  /** 修改项目方案 */
  updateProjectPlan: (data: {
    project_plan_id: number;
    project_id: number;
    plan_no: string;
    pk_plan_no?: string;
  }) => {
    return http.request<ProjectOperationResult>(
      "put",
      "/api/admin/project_plan",
      {
        data
      }
    );
  },

  /** 获取项目方案树（周期/访视树） */
  getProjectPlanTree: (projectPlanId: number, params?: Record<string, any>) => {
    return http.request<ProjectOperationResult>(
      "get",
      `/api/admin/project_plan_tree/${projectPlanId}`,
      {
        params
      }
    );
  },

  /** 获取周期事件列表 */
  getCycleEventList: (params: {
    project_plan_id: number;
    project_id: number;
    cycle_id: number;
  }) => {
    return http.request<ProjectOperationResult>(
      "get",
      "/api/admin/visit_event_list",
      {
        params
      }
    );
  },

  /** 获取访视事件列表 */
  getVisitEventList: (visitId: number) => {
    return http.request<ProjectOperationResult>(
      "get",
      `/api/admin/visit_events/${visitId}`
    );
  },

  /** 获取事件详情 */
  getVisitEvent: (eventId: number) => {
    return http.request<ProjectOperationResult>(
      "get",
      `/api/admin/visit_event/${eventId}`
    );
  },

  /** 根据项目ID获取受试者编号列表 */
  getSlots: (
    projectId: number,
    params?: {
      currentPage?: number;
      pageSize?: number;
      slot_no?: string;
      slot_type?: number;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock 数据 - 根据用户提供的数据结构
        const mockSlots = [
          {
            slot_id: 681,
            slot_no: "RZH001",
            slot_type: -1,
            last_number: 1,
            project_id: projectId,
            project_no: "GCP20251114001",
            project_gcp_no: "FABHP20251114",
            project_name: "测试项目",
            project_source: 1,
            project_plan_id: 186,
            plan_no: "1.0",
            format: "RZH###",
            is_use: 1,
            is_active: 1,
            is_lock: -1,
            patient_user_id: 39,
            patient_name: "胡八一",
            patient_birth_date: "2002-11-06",
            patient_sex: "1",
            identify_no: "320681197705201001",
            bind_source: 1,
            current_cycle: "C1",
            current_visit: "D2",
            current_hospital_district: "测试院区1",
            random_no: "",
            his_patient_id: "",
            his_patient_no: "",
            is_patient_name_not_null: 0,
            is_unset_lock: 0,
            slot_type_list: null,
            not_equal_slot_id: 0,
            create_by: 39,
            created_at: "2025-11-14 14:34:39",
            update_by: 39,
            updated_at: "2025-11-14 14:49:36",
            is_director: 0,
            operate_limit: 0,
            admin_user_id: 0
          },
          {
            slot_id: 682,
            slot_no: "RZH002",
            slot_type: -1,
            last_number: 2,
            project_id: projectId,
            project_no: "GCP20251114001",
            project_gcp_no: "FABHP20251114",
            project_name: "测试项目",
            project_source: -1,
            project_plan_id: 0,
            plan_no: "",
            format: "RZH###",
            is_use: -1,
            is_active: 1,
            is_lock: -1,
            patient_user_id: 0,
            patient_name: "",
            patient_birth_date: "",
            patient_sex: "",
            identify_no: "",
            bind_source: -1,
            current_cycle: "",
            current_visit: "",
            current_hospital_district: "",
            random_no: "",
            his_patient_id: "",
            his_patient_no: "",
            is_patient_name_not_null: 0,
            is_unset_lock: 0,
            slot_type_list: null,
            not_equal_slot_id: 0,
            create_by: 39,
            created_at: "2025-11-14 14:34:39",
            update_by: 0,
            updated_at: "2025-11-14 14:34:39",
            is_director: 0,
            operate_limit: 0,
            admin_user_id: 0
          },
          {
            slot_id: 683,
            slot_no: "RZH003",
            slot_type: -1,
            last_number: 3,
            project_id: projectId,
            project_no: "GCP20251114001",
            project_gcp_no: "FABHP20251114",
            project_name: "测试项目",
            project_source: -1,
            project_plan_id: 0,
            plan_no: "",
            format: "RZH###",
            is_use: -1,
            is_active: 1,
            is_lock: -1,
            patient_user_id: 0,
            patient_name: "",
            patient_birth_date: "",
            patient_sex: "",
            identify_no: "",
            bind_source: -1,
            current_cycle: "",
            current_visit: "",
            current_hospital_district: "",
            random_no: "",
            his_patient_id: "",
            his_patient_no: "",
            is_patient_name_not_null: 0,
            is_unset_lock: 0,
            slot_type_list: null,
            not_equal_slot_id: 0,
            create_by: 39,
            created_at: "2025-11-14 14:34:39",
            update_by: 0,
            updated_at: "2025-11-14 14:34:39",
            is_director: 0,
            operate_limit: 0,
            admin_user_id: 0
          },
          {
            slot_id: 684,
            slot_no: "RZH004",
            slot_type: -1,
            last_number: 4,
            project_id: projectId,
            project_no: "GCP20251114001",
            project_gcp_no: "FABHP20251114",
            project_name: "测试项目",
            project_source: -1,
            project_plan_id: 0,
            plan_no: "",
            format: "RZH###",
            is_use: -1,
            is_active: 1,
            is_lock: -1,
            patient_user_id: 0,
            patient_name: "",
            patient_birth_date: "",
            patient_sex: "",
            identify_no: "",
            bind_source: -1,
            current_cycle: "",
            current_visit: "",
            current_hospital_district: "",
            random_no: "",
            his_patient_id: "",
            his_patient_no: "",
            is_patient_name_not_null: 0,
            is_unset_lock: 0,
            slot_type_list: null,
            not_equal_slot_id: 0,
            create_by: 39,
            created_at: "2025-11-14 14:34:39",
            update_by: 0,
            updated_at: "2025-11-14 14:34:39",
            is_director: 0,
            operate_limit: 0,
            admin_user_id: 0
          },
          {
            slot_id: 685,
            slot_no: "RZH005",
            slot_type: -1,
            last_number: 5,
            project_id: projectId,
            project_no: "GCP20251114001",
            project_gcp_no: "FABHP20251114",
            project_name: "测试项目",
            project_source: -1,
            project_plan_id: 0,
            plan_no: "",
            format: "RZH###",
            is_use: -1,
            is_active: 1,
            is_lock: -1,
            patient_user_id: 0,
            patient_name: "",
            patient_birth_date: "",
            patient_sex: "",
            identify_no: "",
            bind_source: -1,
            current_cycle: "",
            current_visit: "",
            current_hospital_district: "",
            random_no: "",
            his_patient_id: "",
            his_patient_no: "",
            is_patient_name_not_null: 0,
            is_unset_lock: 0,
            slot_type_list: null,
            not_equal_slot_id: 0,
            create_by: 39,
            created_at: "2025-11-14 14:34:39",
            update_by: 0,
            updated_at: "2025-11-14 14:34:39",
            is_director: 0,
            operate_limit: 0,
            admin_user_id: 0
          }
        ];

        // 应用查询过滤
        let filteredSlots = [...mockSlots];

        if (params?.slot_no) {
          filteredSlots = filteredSlots.filter(item =>
            item.slot_no?.includes(params.slot_no!)
          );
        }

        if (params?.slot_type !== undefined) {
          filteredSlots = filteredSlots.filter(
            item => item.slot_type === params.slot_type
          );
        }

        if (params?.start_date) {
          filteredSlots = filteredSlots.filter(item => {
            if (!item.created_at) return false;
            const itemDate = new Date(item.created_at).setHours(0, 0, 0, 0);
            const startDate = new Date(params.start_date!).setHours(0, 0, 0, 0);
            return itemDate >= startDate;
          });
        }

        if (params?.end_date) {
          filteredSlots = filteredSlots.filter(item => {
            if (!item.created_at) return false;
            const itemDate = new Date(item.created_at).setHours(
              23,
              59,
              59,
              999
            );
            const endDate = new Date(params.end_date!).setHours(
              23,
              59,
              59,
              999
            );
            return itemDate <= endDate;
          });
        }

        // 如果传入了分页参数，返回分页格式
        if (params?.currentPage && params?.pageSize) {
          const { currentPage = 1, pageSize = 10 } = params;
          const start = (currentPage - 1) * pageSize;
          const end = start + pageSize;
          const list = filteredSlots.slice(start, end);

          resolve({
            success: true,
            data: {
              list,
              total: filteredSlots.length,
              currentPage,
              pageSize
            }
          });
        } else {
          // 兼容旧格式：返回数组
          resolve({
            success: true,
            data: filteredSlots
          });
        }
      }, 300);
    });
  },

  /** 新增受试者编号配置 */
  addSlot: (data?: any): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟新增成功
        resolve({
          success: true,
          message: "新增受试者编号配置成功",
          data: {
            slot_id: Date.now(),
            ...data,
            created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
            updated_at: new Date().toISOString().replace("T", " ").slice(0, 19)
          }
        });
      }, 300);
    });
  },

  /** 编辑受试者编号配置 */
  updateSlot: (data?: any): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟编辑成功
        resolve({
          success: true,
          message: "编辑受试者编号配置成功"
        });
      }, 300);
    });
  },

  /** 删除受试者编号配置 */
  deleteSlot: (slotId: number): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟删除成功
        resolve({
          success: true,
          message: "删除受试者编号配置成功"
        });
      }, 300);
    });
  },

  /** 获取编号类型字典 */
  getSlotTypeDict: (): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock 字典数据
        const dictData = [
          {
            dictCode: 371,
            dictSort: 0,
            dictLabel: "入组号",
            dictValue: "-1",
            dictType: "slot_type",
            cssClass: "",
            listClass: "",
            isDefault: "",
            status: "0",
            expand: "",
            default: "",
            createBy: "4",
            updateBy: "",
            remark: "",
            params: "",
            dataScope: "",
            dictTypes: null,
            createdAt: "2022-08-31T14:31:33+08:00",
            updatedAt: "2022-08-31T14:31:33+08:00",
            deletedAt: null
          },
          {
            dictCode: 372,
            dictSort: 0,
            dictLabel: "筛选号",
            dictValue: "1",
            dictType: "slot_type",
            cssClass: "",
            listClass: "",
            isDefault: "",
            status: "0",
            expand: "",
            default: "",
            createBy: "4",
            updateBy: "",
            remark: "",
            params: "",
            dataScope: "",
            dictTypes: null,
            createdAt: "2022-08-31T14:31:45+08:00",
            updatedAt: "2022-08-31T14:31:45+08:00",
            deletedAt: null
          }
        ];

        resolve({
          success: true,
          data: dictData
        });
      }, 100);
    });
  },

  /** 根据项目ID获取项目人员列表 */
  getProjectUsers: (projectId: number): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock 数据
        const mockUsers = [
          {
            project_user_id: 409,
            project_id: projectId,
            project_name:
              "update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试",
            project_no: "GCP20251114001",
            user_id: 2,
            dept_id: 0,
            username: "Shik",
            nick_name: "石康博",
            role_name: "All",
            is_director: -1,
            admin_permission: 1,
            project_ids: null,
            hospital_district_ids: null,
            create_by: 39,
            created_at: "2025-11-18 10:57:32",
            update_by: 39,
            updated_at: "2025-11-18 10:57:46"
          },
          {
            project_user_id: 407,
            project_id: projectId,
            project_name:
              "update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试",
            project_no: "GCP20251114001",
            user_id: 8,
            dept_id: 0,
            username: "lmz",
            nick_name: "李木子",
            role_name: "All",
            is_director: 1,
            admin_permission: -1,
            project_ids: null,
            hospital_district_ids: null,
            create_by: 39,
            created_at: "2025-11-14 14:46:48",
            update_by: 39,
            updated_at: "2025-11-14 14:46:53"
          },
          {
            project_user_id: 406,
            project_id: projectId,
            project_name:
              "update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试",
            project_no: "GCP20251114001",
            user_id: 35,
            dept_id: 0,
            username: "shy",
            nick_name: "苏恒义",
            role_name: "All",
            is_director: -1,
            admin_permission: -1,
            project_ids: null,
            hospital_district_ids: null,
            create_by: 39,
            created_at: "2025-11-14 14:34:08",
            update_by: 39,
            updated_at: "2025-11-14 14:46:57"
          },
          {
            project_user_id: 405,
            project_id: projectId,
            project_name:
              "update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试update1.2.3.7升级测试",
            project_no: "GCP20251114001",
            user_id: 39,
            dept_id: 0,
            username: "shaoj",
            nick_name: "邵健",
            role_name: "All",
            is_director: 1,
            admin_permission: -1,
            project_ids: null,
            hospital_district_ids: null,
            create_by: 39,
            created_at: "2025-11-14 14:33:23",
            update_by: 0,
            updated_at: "2025-11-14 14:33:23"
          }
        ];

        resolve({
          success: true,
          data: mockUsers
        });
      }, 300);
    });
  },

  /** 新增项目人员 */
  addProjectUser: (data?: any): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "新增项目人员成功"
        });
      }, 300);
    });
  },

  /** 更新项目人员 */
  updateProjectUser: (data?: any): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "更新项目人员成功"
        });
      }, 300);
    });
  },

  /** 删除项目人员 */
  deleteProjectUser: (projectUserId: number): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "删除项目人员成功"
        });
      }, 300);
    });
  },

  /** 获取患者信息列表 */
  getPatientList: (data?: any): Promise<ResultTable> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock 数据
        const mockPatientList = [
          {
            patient_user_id: 39,
            patient_name: "胡八一",
            sex: "1",
            birth_date: "2002-11-06",
            patient_identify_no: "320681197705201001",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 39,
            created_at: "2025-11-13 15:22:15",
            update_by: 39,
            updated_at: "2025-11-13 15:22:29"
          },
          {
            patient_user_id: 38,
            patient_name: "李兰芳",
            sex: "2",
            birth_date: "1971-10-12",
            patient_identify_no: "130682199909091232",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 39,
            created_at: "2025-10-14 16:53:09",
            update_by: 39,
            updated_at: "2025-10-14 17:01:42"
          },
          {
            patient_user_id: 37,
            patient_name: "阿1",
            sex: "1",
            birth_date: "2025-06-25",
            patient_identify_no: "130682199909091231",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 1,
            created_at: "2025-06-25 13:13:04",
            update_by: 1,
            updated_at: "2025-06-25 13:13:14"
          },
          {
            patient_user_id: 36,
            patient_name: "徐永安",
            sex: "1",
            birth_date: "2025-06-13",
            patient_identify_no: "430682200001016221",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 1,
            created_at: "2025-06-13 16:10:12",
            update_by: 1,
            updated_at: "2025-06-13 16:10:30"
          },
          {
            patient_user_id: 35,
            patient_name: "钢索",
            sex: "2",
            birth_date: "2025-05-27",
            patient_identify_no: "371681199308226396",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 1,
            created_at: "2025-05-27 14:06:54",
            update_by: 1,
            updated_at: "2025-05-29 10:42:09"
          },
          {
            patient_user_id: 34,
            patient_name: "铁壁",
            sex: "1",
            birth_date: "2025-05-20",
            patient_identify_no: "340882196407212990",
            his_patient_id: "",
            his_patient_no: "0000635506",
            create_by: 1,
            created_at: "2025-05-27 14:06:34",
            update_by: 1,
            updated_at: "2025-05-27 14:08:58"
          },
          {
            patient_user_id: 33,
            patient_name: "演示526",
            sex: "1",
            birth_date: "2025-05-26",
            patient_identify_no: "130682200004188911",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 1,
            created_at: "2025-05-26 16:45:06",
            update_by: 1,
            updated_at: "2025-05-26 16:49:51"
          },
          {
            patient_user_id: 32,
            patient_name: "赵启",
            sex: "1",
            birth_date: "2025-05-19",
            patient_identify_no: "310110196804040859",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 57,
            created_at: "2025-05-19 17:08:27",
            update_by: 57,
            updated_at: "2025-05-19 17:08:44"
          },
          {
            patient_user_id: 31,
            patient_name: "演示02",
            sex: "1",
            birth_date: "2025-05-12",
            patient_identify_no: "420682199909095122",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 79,
            created_at: "2025-05-12 15:38:50",
            update_by: 79,
            updated_at: "2025-05-12 15:39:09"
          },
          {
            patient_user_id: 30,
            patient_name: "演示01",
            sex: "1",
            birth_date: "2025-05-12",
            patient_identify_no: "430682200001016225",
            his_patient_id: "",
            his_patient_no: "",
            create_by: 79,
            created_at: "2025-05-12 15:37:24",
            update_by: 79,
            updated_at: "2025-05-12 15:38:10"
          }
        ];

        // 计算年龄
        function calculateAge(birthDate: string): number {
          const today = new Date();
          const birth = new Date(birthDate);
          let age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
          ) {
            age--;
          }
          return age;
        }

        // 处理数据，添加年龄和性别显示
        let filteredList = mockPatientList.map((item: any) => ({
          ...item,
          patient_id: item.patient_user_id,
          patient_no: item.his_patient_no || `P${item.patient_user_id}`,
          gender: item.sex === "1" ? "男" : "女",
          age: calculateAge(item.birth_date),
          project_name: "测试项目" // 模拟项目名称
        }));

        // 模拟搜索过滤
        if (data?.patient_name) {
          filteredList = filteredList.filter((item: any) =>
            item.patient_name.includes(data.patient_name)
          );
        }
        if (data?.patient_no) {
          filteredList = filteredList.filter((item: any) =>
            item.patient_no.includes(data.patient_no)
          );
        }

        // 分页处理
        const pageSize = data?.pageSize || 10;
        const currentPage = data?.currentPage || 1;
        const total = filteredList.length;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const list = filteredList.slice(start, end);

        resolve({
          success: true,
          data: {
            list,
            total,
            pageSize,
            currentPage
          }
        });
      }, 300);
    });
  },

  /** 新增患者 */
  addPatient: (data?: any): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "新增患者成功"
        });
      }, 300);
    });
  },

  /** 更新患者 */
  updatePatient: (data?: any): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "更新患者成功"
        });
      }, 300);
    });
  },

  /** 删除患者 */
  deletePatient: (patientUserId: number): Promise<Result> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "删除患者成功"
        });
      }, 300);
    });
  }
};
