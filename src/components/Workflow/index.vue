<script setup lang="ts">
import { ref } from "vue";
import { NodeType, WorkflowData } from "./type";
import { WorkflowNodeTypeEnum } from "./constants";
import NodeWrap from "./modules/NodeWrap.vue";
import PersonNode from "./modules/nodes/PersonNode.vue";

interface Props {
  modelValue: WorkflowData;
}
const props = defineProps<Props>();
/** 保存审批流config */
const workflowConfig = ref<WorkflowData>(props.modelValue),
  /** 发起人节点数据 */
  initiatorNode = ref<NodeType>({
    nodeName: "发起人",
    nodeType: WorkflowNodeTypeEnum.Initiator,
  });

const init = () => {
  if (workflowConfig.value.initiator?.length && workflowConfig.value.nodes) {
    // 发起人节点回显数据
    initiatorNode.value = { ...workflowConfig.value.nodes };
  }
};
init();
</script>

<template>
  <div class="workflow-container">
    <PersonNode v-model="initiatorNode"></PersonNode>
  </div>
</template>

<style scoped lang="scss">
.workflow-container {
  width: 100%;
  padding: 50px 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
