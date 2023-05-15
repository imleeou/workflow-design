<script setup lang="ts">
import { ref } from "vue";
import { NodeType } from "../type";
import PersonNode from "./nodes/PersonNode.vue";
import { WorkflowNodeTypeEnum } from "../constants";

const props = defineProps<{
		modelValue: NodeType;
	}>(),
	/** 保存节点数据 */
	nodeData = ref<NodeType>(props.modelValue);

console.log("WorkflowNodeTypeEnum", WorkflowNodeTypeEnum.Approver);
</script>

<template>
	<div class="node-wrap">
		<PersonNode v-model="nodeData"></PersonNode>
		<AddNode></AddNode>
	</div>
</template>

<style scoped lang="scss">
@import "../variable.scss";
</style>
