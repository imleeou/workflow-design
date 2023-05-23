import { WorkflowPersonTypeEnum } from "./constants";

/** 人员数据类型 */
export interface PersonInfoType {
	id: string;
	/** 名称 */
	name: string;
	/** 类型 */
	type: WorkflowPersonTypeEnum.Person;
}

/** 部门数据类型 */
export interface DepartmentInfoType extends Omit<PersonInfoType, "type"> {
	/** 是否有子部门 */
	hasChild: boolean;
	/** 是否有人员 */
	hasPerson: boolean;
	type: WorkflowPersonTypeEnum.Department;
}

/** 角色数据类型 */
export interface RoleInfoType extends Omit<PersonInfoType, "type"> {
	type: WorkflowPersonTypeEnum.Role;
}
