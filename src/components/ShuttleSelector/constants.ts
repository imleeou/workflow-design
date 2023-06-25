/** 人员/部门/角色 枚举 */
export enum WorkflowPersonTypeEnum {
	/** 人员 */
	Person = "user",
	/** 部门 */
	Department = "department",
	/** 角色 */
	Role = "role"
}

/** 类型对应弹窗标题 */
export const WorkflowPersonMap = {
	[WorkflowPersonTypeEnum.Person]: "选择人员",
	[WorkflowPersonTypeEnum.Department]: "选择部门",
	[WorkflowPersonTypeEnum.Role]: "选择角色"
}