// 完整版菜单比较多，将 rank 抽离出来，在此方便维护

const home = 0, // 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从非 0 开始
  ganttastic = 1,
  components = 2,
  able = 3,
  table = 4,
  form = 5,
  list = 6,
  result = 7,
  error = 8,
  frame = 9,
  permission = 10,
  system = 11,
  monitor = 12,
  tabs = 13,
  formdesign = 14;

export {
  home,
  ganttastic,
  components,
  able,
  table,
  form,
  list,
  result,
  error,
  frame,
  permission,
  system,
  monitor,
  tabs,
  formdesign
};
