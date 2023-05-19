<script setup lang="ts">
import { ref } from "vue";
import { NodeType } from "../type";
import PersonNode from "./nodes/PersonNode.vue";
import AddNode from "./nodes/AddNode.vue";
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
		<AddNode v-model:node-children="nodeData.children"></AddNode>
	</div>
	<!-- NodeWrap 递归渲染 -->
	<NodeWrap v-if="nodeData.children" v-model="nodeData.children"></NodeWrap>
</template>

<style scoped lang="scss">
@import "../variable.scss";
</style>
