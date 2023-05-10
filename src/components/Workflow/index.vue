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
    <div class="process-end">
      <div class="button">流程结束</div>
    </div>
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
  .process-end {
    padding-bottom: 50px;
    margin: 0 auto;
    .button {
      width: 100px;
      padding: 5px 10px;
      margin: 0 auto;
      text-align: center;
      background-color: #ffffff;
      border-radius: 20px;
      box-shadow: 0 0 10px 0 rgb(0 0 0 / 10%);
    }
  }
}
</style>
