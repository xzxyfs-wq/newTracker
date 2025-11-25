<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import projectApi from "@/api/projectManagement";
import { getAllRoleList, getDeptList } from "@/api/system";
import { getUserList } from "@/api/system";

defineOptions({
  name: "ProjectUserForm"
});

const props = defineProps<{
  projectId?: number;
  existingUserIds?: number[];
}>();

const emit = defineEmits<{
  (e: "success"): void;
}>();

// 表单数据
const formRef = ref();
const selectedUserIds = ref<number[]>([]);
const selectedDeptId = ref<number | undefined>();
const selectedRoleId = ref<number | undefined>();
const activeFilterTab = ref<"dept" | "role">("dept");

// 数据源
const allUsers = ref<any[]>([]);
const filteredUsers = ref<any[]>([]);
const departmentTree = ref<any[]>([]);
const roleList = ref<any[]>([]);

// 加载部门树
async function loadDepartmentTree() {
  try {
    const response = await getDeptList();
    if (response?.success && response?.data) {
      // 转换为树形结构
      departmentTree.value = buildTree(response.data);
    }
  } catch (error) {
    console.error("加载部门树失败:", error);
  }
}

// 构建树形结构
function buildTree(data: any[]): any[] {
  const map = new Map();
  const roots: any[] = [];

  // 创建映射
  data.forEach(item => {
    map.set(item.dept_id, { ...item, children: [] });
  });

  // 构建树
  data.forEach(item => {
    const node = map.get(item.dept_id);
    if (item.parent_id === 0 || !item.parent_id) {
      roots.push(node);
    } else {
      const parent = map.get(item.parent_id);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}

// 加载角色列表
async function loadRoleList() {
  try {
    const response = await getAllRoleList();
    if (response?.success && response?.data) {
      roleList.value = response.data;
    }
  } catch (error) {
    console.error("加载角色列表失败:", error);
  }
}

// 加载用户列表
async function loadUserList() {
  try {
    const response = await getUserList({});
    if (response?.success && response?.data?.list) {
      // 排除已存在的项目人员
      const existingIds = props.existingUserIds || [];
      allUsers.value = response.data.list
        .filter((user: any) => !existingIds.includes(user.user_id))
        .map((user: any) => ({
          key: user.user_id,
          label: `${user.username}${user.nickname ? `(${user.nickname})` : ""}`,
          user_id: user.user_id,
          username: user.username,
          nickname: user.nickname,
          dept_id: user.dept_id,
          role_id: user.role_id
        }));
      applyFilters();
    }
  } catch (error) {
    console.error("加载用户列表失败:", error);
  }
}

// 应用筛选
function applyFilters() {
  let filtered = [...allUsers.value];

  // 根据当前选中的 tab 应用筛选
  if (activeFilterTab.value === "dept") {
    // 按部门筛选
    if (selectedDeptId.value) {
      filtered = filtered.filter(user => user.dept_id === selectedDeptId.value);
    }
  } else {
    // 按角色筛选
    if (selectedRoleId.value) {
      filtered = filtered.filter(user => user.role_id === selectedRoleId.value);
    }
  }

  filteredUsers.value = filtered;
}

// 监听筛选条件变化
watch([selectedDeptId, selectedRoleId, activeFilterTab], () => {
  applyFilters();
});

// 切换筛选方式时，清空另一个筛选条件
function handleTabChange(tabName: string | number) {
  const tab = tabName as "dept" | "role";
  if (tab === "dept") {
    selectedRoleId.value = undefined;
  } else if (tab === "role") {
    selectedDeptId.value = undefined;
  }
}

// 提交表单
async function handleSubmit() {
  if (selectedUserIds.value.length === 0) {
    ElMessage.warning("请至少选择一个用户");
    return false;
  }

  try {
    const response = await projectApi.addProjectUser({
      project_id: props.projectId,
      user_ids: selectedUserIds.value
    });

    if (response?.success) {
      ElMessage.success("新增项目人员成功");
      emit("success");
      return true;
    }
    return false;
  } catch (error) {
    console.error("新增项目人员失败:", error);
    ElMessage.error("新增项目人员失败");
    return false;
  }
}

// 重置表单
function handleReset() {
  selectedUserIds.value = [];
  selectedDeptId.value = undefined;
  selectedRoleId.value = undefined;
  activeFilterTab.value = "dept";
}

// 初始化
onMounted(() => {
  loadDepartmentTree();
  loadRoleList();
  loadUserList();
});

// 暴露方法
defineExpose({
  handleSubmit,
  handleReset
});
</script>

<template>
  <div class="project-user-form">
    <el-form ref="formRef" :model="{}">
      <el-tabs v-model="activeFilterTab" @tab-change="handleTabChange">
        <el-tab-pane label="按部门筛选" name="dept"> </el-tab-pane>
        <el-tab-pane label="按角色筛选" name="role"> </el-tab-pane>
      </el-tabs>
      <div class="mb-4 w-[250px]">
        <el-select
          v-if="activeFilterTab === 'role'"
          v-model="selectedRoleId"
          placeholder="请选择角色"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="role in roleList"
            :key="role.role_id"
            :label="role.role_name"
            :value="role.role_id"
          />
        </el-select>
        <el-tree-select
          v-if="activeFilterTab === 'dept'"
          v-model="selectedDeptId"
          :data="departmentTree"
          :props="{
            value: 'dept_id',
            label: 'dept_name',
            children: 'children'
          }"
          placeholder="请选择部门"
          clearable
          style="width: 100%"
        />
      </div>
      <el-form-item>
        <el-transfer
          v-model="selectedUserIds"
          :data="filteredUsers"
          :props="{
            key: 'key',
            label: 'label'
          }"
          :titles="['可选人员', '已选人员']"
          filterable
          filter-placeholder="搜索用户名"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.project-user-form {
  :deep(.el-transfer__buttons) {
    display: inline-flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 15px;
    .el-button {
      margin: 0;
    }
  }
}
</style>
