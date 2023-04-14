import { WorkflowPersonMap, WorkflowNodeTypeMap } from "./constants";

/** 审批流数据类型 */
export interface WorkflowData {
  /** 审批流id */
  id: number;
  /** 审批名称 */
  name: string;
  /** 发起人信息 */
  initiator?: PersonType[];
  /** 节点设置 */
  nodes: NodeType | RouteNodeType | null;
}

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
  nodeId?: number;
  /** 节点名称 */
  nodeName: string;
  /** 节点类型 */
  nodeType: keyof typeof WorkflowNodeTypeMap;
  /** 子节点 */
  childNode?: NodeType | RouteNodeType;
  /** 节点人员信息选择 */
  nodePerson?: PersonType[];
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
