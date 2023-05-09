<script setup lang="ts">
import { computed, ref } from "vue";
import { NodeType } from "../../type";
import { Close } from "@element-plus/icons-vue";
import { WorkflowNodeTypeEnum } from "../../constants";

const props = defineProps<{
  /** 节点信息 */
  modelValue: NodeType;
}>();
/** 删除图标是否显示 */
const isShowCloseIcon = ref(false);

/** 鼠标滑入滑出
 * @param direction 0: 滑入 1: 滑出
 */
const mouseOperation = (direction: 0 | 1) => {
  isShowCloseIcon.value = !direction;
};

/** 选择提示 */
const pickTip = computed(() => {
  const TIP_SET = {
    [WorkflowNodeTypeEnum.Initiator]: "所有人",
    [WorkflowNodeTypeEnum.Approver]: "请指定审批人",
    [WorkflowNodeTypeEnum.Copy]: "请设置抄送人",
  };
  return TIP_SET[props.modelValue.type as keyof typeof TIP_SET];
});
</script>

<template>
  <div
    class="node person-node"
    @mouseenter="mouseOperation(0)"
    @mouseleave="mouseOperation(1)"
  >
    <div class="node-header">
      <!-- TODO: 人员节点样式 -->
      <p class="node-name">{{ props.modelValue.name }}</p>
      <el-icon v-show="isShowCloseIcon" class="close-icon"><Close /></el-icon>
    </div>
    <div class="node-content">
      <div class="pick">{{ pickTip }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../variable.scss";

.person-node {
  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
