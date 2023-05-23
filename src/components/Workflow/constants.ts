import { AddNodeType, NodeType } from "./type";

/** 发起人类型枚举 */
export enum WorkflowPersonEnum {
	/** 人员 */
	Person = 1,
	/** 部门 */
	Department = 2
}

/** 发起人类型映射 */
export const WorkflowPersonMap = {
	[WorkflowPersonEnum.Person]: "人员",
	[WorkflowPersonEnum.Department]: "部门"
};

/** 节点类型枚举 */
export enum WorkflowNodeTypeEnum {
	/** 发起人 */
	Initiator = "INITIATOR",
	/** 审批人 */
	Approver = "APPROVER",
	/** 抄送人 */
	Copy = "COPY",
	/** 条件路由 */
	Conditions = "CONDITIONS",
	/** 条件分支 */
	ConditionBranch = "CONDITION",
	/** 并行路由 */
	Parallel = "PARALLELS",
	/** 并行分支 */
	ParallelBranch = "PARALLEL"
}

/** 节点类型映射 */
export const WorkflowNodeTypeMap = {
	[WorkflowNodeTypeEnum.Initiator]: "发起人",
	[WorkflowNodeTypeEnum.Approver]: "审批人",
	[WorkflowNodeTypeEnum.Copy]: "抄送人",
	[WorkflowNodeTypeEnum.Conditions]: "条件路由",
	[WorkflowNodeTypeEnum.ConditionBranch]: "条件分支",
	[WorkflowNodeTypeEnum.Parallel]: "并行路由",
	[WorkflowNodeTypeEnum.ParallelBranch]: "并行分支"
};

/** 发起人节点初始信息 */
export const INITIATOR_NODE_INFO: NodeType = {
	name: WorkflowNodeTypeMap[WorkflowNodeTypeEnum.Initiator],
	type: WorkflowNodeTypeEnum.Initiator,
	id: "INITIATOR-ROOT",
	children: undefined,
	parentId: ""
};

/** 人员节点渲染信息 */
export const PERSON_NODE_RENDER_INFO = {
	[WorkflowNodeTypeEnum.Initiator]: {
		icon: "icon-initiator",
		color: "#7a939d",
		placeholder: "所有人"
	},
	[WorkflowNodeTypeEnum.Approver]: {
		icon: "icon-approver",
		color: "#f78f5f",
		placeholder: "请选择审批人"
	},
	[WorkflowNodeTypeEnum.Copy]: {
		icon: "icon-copy",
		color: "#409eff",
		placeholder: "请选择抄送人"
	}
};

/** 添加节点的 节点类型数据 */
export const WORKFLOW_ADD_NODE_TYPE_LIST: AddNodeType[] = [
	{
		type: WorkflowNodeTypeEnum.Approver,
		name: "审批人",
		icon: "icon-approver",
		color: "#ff943e",
		defaultConfig: {
			name: "审核人",
			type: WorkflowNodeTypeEnum.Approver,
			config: undefined
		}
	},
	{
		type: WorkflowNodeTypeEnum.Copy,
		name: "抄送人",
		icon: "icon-copy",
		color: "#3296fa",
		defaultConfig: {
			name: "抄送人",
			type: WorkflowNodeTypeEnum.Copy,
			config: undefined
		}
	},
	{
		type: WorkflowNodeTypeEnum.ConditionBranch,
		name: "条件分支",
		icon: "icon-conditions",
		color: "#15bc83",
		defaultConfig: {
			name: "条件路由",
			type: WorkflowNodeTypeEnum.Conditions,
			config: undefined,
			branchs: [
				{
					id: "",
					name: "条件1",
					type: WorkflowNodeTypeEnum.ConditionBranch,
					priorityLevel: 1,
					children: undefined,
					config: undefined
				},
				{
					id: "",
					name: "条件2",
					type: WorkflowNodeTypeEnum.ConditionBranch,
					priorityLevel: 2,
					children: undefined,
					config: undefined
				}
			],
			children: undefined
		}
	},
	{
		type: WorkflowNodeTypeEnum.ParallelBranch,
		name: "并行分支",
		icon: "icon-parallel",
		color: "#718dff",
		defaultConfig: {
			name: "并行路由",
			type: WorkflowNodeTypeEnum.Parallel,
			config: undefined,
			branchs: [
				{
					id: "",
					name: "分支1",
					type: WorkflowNodeTypeEnum.ParallelBranch,
					children: undefined,
					config: undefined
				},
				{
					id: "",
					name: "分支2",
					type: WorkflowNodeTypeEnum.ParallelBranch,
					children: undefined,
					config: undefined
				}
			],
			children: undefined
		}
	}
];
