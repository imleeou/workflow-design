<script setup lang="ts">
import { ref, watch } from "vue";
import { NodeType } from "../type";
import PersonNode from "./nodes/PersonNode.vue";
import AddNode from "./nodes/AddNode.vue";
import ConditionNode from "./nodes/ConditionNode.vue";
import { WorkflowNodeTypeEnum } from "../constants";

const props = defineProps<{
		modelValue: NodeType;
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: NodeType): void;
	}>(),
	/** 保存节点数据 */
	nodeData = ref<NodeType>(props.modelValue);

watch(
	() => props.modelValue,
	val => {
		nodeData.value = val;
	},
	{
		deep: true
	}
);

watch(
	() => nodeData.value,
	val => {
		emits("update:modelValue", val);
	},
	{
		deep: true
	}
);
</script>

<template>
	<div class="node-wrap">
		<PersonNode
			v-if="
				props.modelValue.type === WorkflowNodeTypeEnum.Initiator ||
				props.modelValue.type === WorkflowNodeTypeEnum.Approver ||
				props.modelValue.type === WorkflowNodeTypeEnum.Copy
			"
			v-model="nodeData"
		></PersonNode>
		<ConditionNode v-else-if="props.modelValue.type === WorkflowNodeTypeEnum.Conditions" v-model="nodeData"></ConditionNode>
		<AddNode v-if="nodeData" v-model:node-children="nodeData.children"></AddNode>
	</div>
	<!-- NodeWrap 递归渲染 -->
	<NodeWrap v-if="nodeData?.children" v-model="nodeData.children"></NodeWrap>
</template>

<style scoped lang="scss">
@import "../variable.scss";
.node-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 100%;
}
</style>
