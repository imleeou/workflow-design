<script setup lang="ts">
import { ref } from "vue";
import { NodeType, WorkflowData } from "./type";
import { INITIATOR_NODE_INFO } from "./constants";
import NodeWrap from "./modules/NodeWrap.vue";

interface Props {
  modelValue: WorkflowData;
}
const props = defineProps<Props>();
/** 保存审批流config */
const workflowConfig = ref<WorkflowData>(props.modelValue);

/** 初始化 */
const init = () => {
  if (!workflowConfig.value) {
    workflowConfig.value = {
      ...INITIATOR_NODE_INFO,
    };
  }
};
init();
</script>

<template>
  <div class="workflow-container">
    <NodeWrap v-if="workflowConfig" v-model="workflowConfig"></NodeWrap>
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
