import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { deptApi } from "@/api/system";
import dictApi from "@/api/dict";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";
export function useDept() {
  const form = reactive({
    name: "",
    status: null
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const statusOptions = ref<any[]>([]);
  const { tagStyle } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "dept_name",
      minWidth: 180,
      align: "left"
    },
    {
      label: "部门类型",
      prop: "dept_type",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size}>
          {row.dept_type === "1" || row.dept_type === 1 ? "科室" : "公司"}
        </el-tag>
      )
    },
    {
      label: "排序",
      prop: "sort",
      minWidth: 70
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === 1 ? "启用" : "停用"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "created_at"
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      // 构建搜索参数
      const searchParams: any = {
        dept_id: 0 // 默认获取所有部门
      };

      // 如果填写了部门名称，添加到搜索参数
      if (!isAllEmpty(form.name)) {
        searchParams.dept_name = form.name;
      }

      // 如果选择了状态，添加到搜索参数
      if (!isAllEmpty(form.status)) {
        searchParams.status = form.status;
      }

      const response = await deptApi.getDeptList(searchParams);
      // 接口返回格式：{ success: true, data: [...] } 树形结构数组
      let newData: any[] = [];
      if (response?.success) {
        const responseData = response.data as any;
        if (Array.isArray(responseData)) {
          newData = responseData;
        } else if (responseData?.list && Array.isArray(responseData.list)) {
          newData = responseData.list;
        }
      }
      dataList.value = newData;
    } catch (error) {
      console.error("获取部门列表失败:", error);
      dataList.value = [];
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          higher_dept_options: dataList.value,
          dept_id: row?.dept_id ?? 0,
          parent_id: row?.parent_id ?? undefined,
          dept_name: row?.dept_name ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1, // 1:正常, 0:停用
          remark: row?.remark ?? "",
          dept_path: row?.dept_path ?? "",
          dept_type: row?.dept_type ?? 2 // 1:科室, 2:公司
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`操作成功`, { type: "success" });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                await deptApi.addDept(curData);
              } else {
                await deptApi.updateDept(curData);
              }
              chores();
            } catch (error) {
              console.error(`${title}部门失败:`, error);
              message(`${title}部门失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    try {
      await deptApi.deleteDept({ dept_id: row.dept_id });
      message(`您删除了部门名称为${row.dept_name}的这条数据`, {
        type: "success"
      });
      onSearch();
    } catch (error) {
      console.error("删除部门失败:", error);
      message("删除部门失败", { type: "error" });
    }
  }

  onMounted(async () => {
    // await loadStatusOptions();
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    statusOptions,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange
  };
}
