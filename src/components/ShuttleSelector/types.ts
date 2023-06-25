import { WorkflowPersonTypeEnum } from "./constants";

/** 人员数据类型 */
export interface PersonInfoType {
	id: number;
	/** 名称 */
	name: string;
	/** 类型 */
	type: WorkflowPersonTypeEnum;
	/** 父节点id */
	parentId?: number;
	/** 子节点 */
	children?: PersonInfoType[];
}
