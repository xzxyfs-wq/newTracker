import ReTableComponent from "./src/index.vue";
import { withInstall } from "@pureadmin/utils";

/** 封装了 PureTableBar 和 pure-table 的便捷表格组件 */
export const ReTable = withInstall(ReTableComponent);

export default ReTable;
