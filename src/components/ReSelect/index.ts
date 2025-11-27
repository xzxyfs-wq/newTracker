import reSelect from "./index.vue";
import { withInstall } from "@pureadmin/utils";

/** 选择器组件（扩展 el-select，支持 defaultReturn 属性） */
export const ReSelect = withInstall(reSelect);

export default ReSelect;
