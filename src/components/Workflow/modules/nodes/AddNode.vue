<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { WORKFLOW_ADD_NODE_TYPE_LIST, WorkflowNodeTypeEnum } from "../../constants";
import { AddNodeType, NodeType, WorkflowNodeType } from "../../type";
import { getUniqueId } from "../../utils";
import { ref } from "vue";

const props = withDefaults(
		defineProps<{
			placement?:
				| "top"
				| "top-start"
				| "top-end"
				| "bottom"
				| "bottom-start"
				| "bottom-end"
				| "left"
				| "left-start"
				| "left-end"
				| "right"
				| "right-start"
				| "right-end";
			trigger?: "click" | "hover" | "focus" | "contextmenu";
			/** 延迟关闭 */
			hideAfter?: number;
			/** 子节点数据 */
			nodeChildren: WorkflowNodeType;
			/** 父节点数据 */
			parentNode: NodeType;
		}>(),
		{
			placement: "bottom-start",
			trigger: "hover",
			hideAfter: 0
		}
	),
	emits = defineEmits<{
		(e: "update:nodeChildren", nodeChildrenValue: WorkflowNodeType): void;
	}>(),
	/** 是否显示popover */
	popoverVisible = ref(false);

const addNode = (node: AddNodeType) => {
	const defaultConfig: NodeType = JSON.parse(JSON.stringify(node.defaultConfig));
	// 关闭popover
	popoverVisible.value = false;
	defaultConfig.id = getUniqueId(defaultConfig.type);
	// 路由分支
	if (defaultConfig.type === WorkflowNodeTypeEnum.Parallel || defaultConfig.type === WorkflowNodeTypeEnum.Conditions) {
		defaultConfig.branchs = defaultConfig.branchs?.map(item => {
			return {
				...item,
				parentId: defaultConfig.id,
				id: getUniqueId(WorkflowNodeTypeEnum.ParallelBranch)
			} as NodeType;
		});
	}
	emits("update:nodeChildren", {
		...defaultConfig,
		parentId: props.parentNode.id,
		children: props.nodeChildren ? { ...props.nodeChildren } : undefined
	});
};
</script>

<template>
	<div class="add-node">
		<el-popover
			v-model:visible="popoverVisible"
			:placement="props.placement"
			width="400px"
			:trigger="props.trigger"
			:hide-after="props.hideAfter"
		>
			<template #reference>
				<div class="add-button">
					<el-icon><Plus /></el-icon>
				</div>
			</template>
			<div class="node-list">
				<div v-for="(n, index) in WORKFLOW_ADD_NODE_TYPE_LIST" :key="index" class="node-select" @click="addNode(n)">
					<div class="icon">
						<i :class="['wf-iconfont', n.icon]" :style="{ color: n.color }"></i>
					</div>
					<span class="node-name">{{ n.name }}</span>
				</div>
			</div>
		</el-popover>
	</div>
</template>

<style scoped lang="scss">
@import "../../variable.scss";
.add-node {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	width: $workflow-node-width;
	padding: 25px 0 35px;
	&::after {
		position: absolute;
		top: 0;
		left: 50%;
		z-index: -1;
		width: 2px;
		height: 100%;
		content: "";
		background-color: $workflow-line-color;
		transform: translateX(-50%);
	}
	.add-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		cursor: pointer;
		background-color: $workflow-add-btn-bg;
		border-radius: 50%;
		transition: all 0.3s;
		&:hover {
			background-color: $workflow-add-btn-hover-bg;
		}
		.el-icon {
			font-size: 20px;
			color: #ffffff;
		}
	}
}

.node-list {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	.node-select {
		width: 45%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px 10px;
		overflow: hidden;
		cursor: pointer;
		background-color: #f8f9f9;
		border: 1px solid #f8f9f9;
		border-radius: $workflow-node-radius;
		margin: 5px 0;
		&:hover {
			background-color: #ffffff;
			box-shadow: 0 0 10px 0 #d6d6d6;
		}
		&:last-child {
			margin-right: 0;
		}
		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 50px;
			height: 50px;
			border: 1px solid #ebeef5;
			border-radius: 50%;
			.wf-iconfont {
				font-size: 26px;
				color: #c0c4cc;
			}
		}
		.node-name {
			margin-left: 10px;
			font-size: 16px;
		}
	}
}
</style>
