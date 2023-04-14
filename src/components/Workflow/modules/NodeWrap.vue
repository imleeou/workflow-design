<script setup lang="ts">
import { ref } from "vue";
import { NodeType } from "../type";
import PersonNode from "./PersonNode.vue";

const props = defineProps<{
    modelValue: NodeType;
  }>(),
  /** 保存节点数据 */
  nodeData = ref<NodeType>(props.modelValue);
</script>

<template>
  <PersonNode v-model="nodeData"></PersonNode>
</template>

<style scoped lang="scss">
@import "../variable.scss";


</style>
