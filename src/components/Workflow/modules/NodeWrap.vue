<script setup lang="ts">
import { ref, watch } from "vue";
import { NodeType, WorkflowNodeType } from "../type";
import PersonNode from "./nodes/PersonNode.vue";
import AddNode from "./nodes/AddNode.vue";
import ConditionNode from "./nodes/ConditionNode.vue";
import ParallelBranchNode from "./nodes/ParallelBranchNode.vue";
import DrawerWrap from "./DrawerWrap.vue";
import { WorkflowNodeTypeEnum } from "../constants";

const props = defineProps<{
		modelValue: NodeType;
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: NodeType): void;
	}>(),
	/** 保存节点数据 */
	nodeData = ref<NodeType>(props.modelValue),
	drawerWrapShow = ref<boolean>(false),
	/** 当前修改的节点信息 */
	currentDrawerNode = ref<WorkflowNodeType>();

const clickNode = (node: NodeType) => {
	drawerWrapShow.value = true;
	currentDrawerNode.value = node;
};

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
			@click="clickNode(nodeData)"
		></PersonNode>
		<ConditionNode v-else-if="props.modelValue.type === WorkflowNodeTypeEnum.Conditions" v-model="nodeData"></ConditionNode>
		<ParallelBranchNode
			v-else-if="props.modelValue.type === WorkflowNodeTypeEnum.Parallel"
			v-model="nodeData"
		></ParallelBranchNode>
		<AddNode v-if="nodeData" v-model:node-children="nodeData.children" :parent-node="nodeData"></AddNode>
	</div>
	<!-- NodeWrap 递归渲染 -->
	<NodeWrap v-if="nodeData?.children" v-model="nodeData.children"></NodeWrap>
	<!-- 节点对应表单抽屉 -->
	<DrawerWrap v-if="drawerWrapShow" v-model="drawerWrapShow" :node-config="currentDrawerNode"></DrawerWrap>
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
