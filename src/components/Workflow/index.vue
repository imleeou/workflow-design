<script setup lang="ts">
import { ref, watch } from "vue";
import { WorkflowNodeType } from "./type";
import { INITIATOR_NODE_INFO } from "./constants";
import NodeWrap from "./modules/NodeWrap.vue";

interface Props {
	modelValue: WorkflowNodeType;
}
const props = defineProps<Props>(),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: WorkflowNodeType): void;
	}>();
/** 保存审批流config */
const workflowConfig = ref<WorkflowNodeType>(props.modelValue);

watch(
	() => props.modelValue,
	() => {
		workflowConfig.value = props.modelValue;
	},
	{
		deep: true
	}
);

watch(
	() => workflowConfig.value,
	val => {
		console.log("总数据更新", val);
		emits("update:modelValue", val);
	},
	{
		deep: true
	}
);

/** 初始化 */
const init = () => {
	if (!workflowConfig.value) {
		workflowConfig.value = {
			...INITIATOR_NODE_INFO
		};
		emits("update:modelValue", workflowConfig.value);
	}
};
init();
</script>

<template>
	<div class="workflow-container">
		<div class="container-scroll">
			<NodeWrap v-if="workflowConfig" v-model="workflowConfig"></NodeWrap>
			<div class="process-end">
				<div class="button">流程结束</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "./variable.scss";
.workflow-container {
	width: 100%;
	height: 100%;
	background-color: $workflow-bg;
	display: flex;
	overflow: auto;
	.container-scroll {
		padding: 50px 0;
		flex-grow: 1;
		height: auto;
		transition: all 0.3s ease-in-out;
		transform-origin: 50% 0 0;
		box-sizing: border-box;
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
}
</style>
