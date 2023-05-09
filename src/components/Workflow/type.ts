import { WorkflowPersonMap, WorkflowNodeTypeMap } from "./constants";

/** 审批流数据类型 */
export type WorkflowData  = NodeType | undefined | null;

/** 人员信息类型 */
export interface PersonType {
  /** 人员id */
  id: number;
  /** 人员名称 */
  name: string;
  /** 人员类型 */
  type: keyof typeof WorkflowPersonMap;
}

/** 普通节点类型 */
export interface NodeType {
  /** 节点id */
  id: string;
  /** 父节点id */
  parentId: string;
  /** 节点名称 */
  name: string;
  /** 节点类型 */
  type: keyof typeof WorkflowNodeTypeMap;
  /** 子节点 */
  children?: NodeType | RouteNodeType;
  /** 节点人员信息选择 */
  nodePerson?: PersonType[];
  /** 是否校验错误 */
  error?: boolean;
}

/** 路由节点类型 */
export interface RouteNodeType extends NodeType {
  /** 条件列表 */
  conditionList?: ConditionType[];
  /** 条件节点 */
  conditionNode?: NodeType;
}

/** 条件数据类型 */
export interface ConditionType {
  /** 条件名称 */
  conditionName: string;
  /** 条件ID */
  conditionId: number;
  /** 条件值 */
  conditionValue: string;
}
