/** 发起人类型枚举 */
export enum WorkflowPersonEnum {
  /** 人员 */
  Person = 1,
  /** 部门 */
  Department = 2,
}

/** 发起人类型映射 */
export const WorkflowPersonMap = {
  [WorkflowPersonEnum.Person]: "人员",
  [WorkflowPersonEnum.Department]: "部门",
};

/** 节点类型枚举 */
export enum WorkflowNodeTypeEnum {
  /** 发起人 */
  Initiator = 'INITIATOR',
  /** 审批人 */
  Approver = 'APPROVER',
  /** 抄送人 */
  Copy = 'COPY',
  /** 条件路由 */
  Conditions = 'CONDITIONS',
  /** 条件分支 */
  ConditionBranch = 'CONDITION',
  /** 并行路由 */
  Parallel = 'PARALLELS',
  /** 并行分支 */
  ParallelBranch = 'PARALLEL',
}

/** 节点类型映射 */
export const WorkflowNodeTypeMap = {
  [WorkflowNodeTypeEnum.Initiator]: "发起人",
  [WorkflowNodeTypeEnum.Approver]: "审批人",
  [WorkflowNodeTypeEnum.Copy]: "抄送人",
  [WorkflowNodeTypeEnum.Conditions]: "路由",
  [WorkflowNodeTypeEnum.ConditionBranch]: "分支",
};
