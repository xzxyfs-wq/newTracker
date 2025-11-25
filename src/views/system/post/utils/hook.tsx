import { ElMessage } from "element-plus";
import { postApi } from "@/api/system";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { isAllEmpty, deviceDetection } from "@pureadmin/utils";

export function usePost() {
  const form = reactive({
    post_name: "",
    status: null
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();
  const postFormRef = ref();
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1
  });

  const columns: TableColumnList = [
    {
      label: "岗位名称",
      prop: "post_name",
      minWidth: 180,
      align: "left"
    },
    {
      label: "岗位编码",
      prop: "post_code",
      minWidth: 120
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
    pagination.currentPage = 1;
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      // 构建搜索参数
      const searchParams: any = {
        post_id: 0, // 默认获取所有岗位
        page: pagination.currentPage,
        page_size: pagination.pageSize
      };

      // 如果填写了岗位名称，添加到搜索参数
      if (!isAllEmpty(form.post_name)) {
        searchParams.post_name = form.post_name;
      }

      // 如果选择了状态，添加到搜索参数
      if (!isAllEmpty(form.status)) {
        searchParams.status = form.status;
      }

      const response = await postApi.getPostList(searchParams);
      // 接口返回格式：{ success: true, data: { list: [], count: 0, page: 1, page_size: 10 } }
      if (response?.success) {
        dataList.value = response.data?.list || [];
        pagination.total = response.data?.count || 0;
        pagination.currentPage = response.data?.page || 1;
        pagination.pageSize = response.data?.page_size || 10;
      } else {
        dataList.value = [];
        pagination.total = 0;
      }
    } catch (error) {
      console.error("获取岗位列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}岗位`,
      props: {
        formInline: row || {
          post_name: "",
          post_code: "",
          sort: 0,
          status: 1,
          remark: "",
          post_id: undefined
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: postFormRef, formInline: null }),
      beforeSure: async (done, { options }) => {
        const FormRef = postFormRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          ElMessage.success(`操作成功`);
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            try {
              let res;
              if (!curData.post_id) {
                res = await postApi.addPost(curData);
              } else {
                res = await postApi.updatePost(curData);
              }
              if (!res?.success) {
                throw new Error(res?.error || `${title}岗位失败`);
              }
              chores();
            } catch (error) {
              console.error(`${title}岗位失败:`, error);
              ElMessage.error(`${title}岗位失败 ${error?.message}`);
            }
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    try {
      await postApi.deletePost({ post_id: row.post_id });
      ElMessage.success(`操作成功`);
      onSearch();
    } catch (error) {
      console.error("删除岗位失败:", error);
      ElMessage.error(`删除岗位失败 ${error?.message}`);
    }
  }

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改岗位 */
    openDialog,
    /** 删除岗位 */
    handleDelete,
    /** 分页 */
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
