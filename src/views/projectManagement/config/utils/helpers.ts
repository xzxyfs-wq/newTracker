/**
 * 工具函数
 */

/**
 * 获取编号类型标签
 */
export function getSlotTypeLabel(slotType: number | string | undefined): string {
  const typeMap: Record<number | string, string> = {
    "-1": "入组号",
    1: "筛选号"
  };
  return typeMap[slotType as number] || "未知";
}

/**
 * 获取角色名称
 */
export function getRoleName(role: string): string {
  const roleMap: Record<string, string> = {
    manager: "项目经理",
    data_manager: "数据管理员",
    monitor: "监察员",
    statistician: "统计员"
  };
  return roleMap[role] || role;
}

