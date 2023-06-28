import { WorkflowPersonEnum } from "../Workflow/constants";

/** 类型对应弹窗标题 */
export const WorkflowPersonMap = {
	[WorkflowPersonEnum.Person]: "选择人员",
	[WorkflowPersonEnum.Department]: "选择部门",
	[WorkflowPersonEnum.Role]: "选择角色"
};

/** 默认面包屑数据 */
export const DEFAULT_BREADCRUMB = [
	{
		text: "全部",
		id: 0
	}
];
