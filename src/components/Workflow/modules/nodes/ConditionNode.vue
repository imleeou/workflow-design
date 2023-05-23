<script setup lang="ts">
import { watch, ref } from "vue";
import { ArrowLeft, ArrowRight, Close } from "@element-plus/icons-vue";
import { WorkflowNodeType, NodeType } from "../../types";
import AddNode from "./AddNode.vue";
import { WorkflowNodeTypeEnum } from "../../constants";
import NodeWrap from "../NodeWrap.vue";
import { getUniqueId } from "../../utils";
const props = defineProps<{
		modelValue: WorkflowNodeType;
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: WorkflowNodeType): void;
		/** 点击条件节点 */
		(e: "nodeClick", nodeConfig: WorkflowNodeType): void;
	}>();

const nodeConfig = ref<WorkflowNodeType>(props.modelValue),
	hoverItem = ref<WorkflowNodeType>();

watch(
	() => nodeConfig.value,
	val => {
		emits("update:modelValue", val);
	},
	{
		deep: true
	}
);

/** 添加条件 */
const addCondition = () => {
	const len = nodeConfig.value?.branchs?.length || 0;
	nodeConfig.value?.branchs?.push({
		id: getUniqueId(WorkflowNodeTypeEnum.ConditionBranch),
		name: `条件${len + 1}`,
		priorityLevel: len + 1,
		type: WorkflowNodeTypeEnum.ConditionBranch,
		children: undefined,
		config: undefined
	});
};

/** 移入移出实现hover
 * @param flag 0:移入 1:移出
 */
const handleHover = (item: WorkflowNodeType, flag = 0) => {
	hoverItem.value = flag ? undefined : item;
};

/** 删除节点 */
const deleteBranchNode = (item: WorkflowNodeType) => {
	if (nodeConfig.value?.branchs && nodeConfig.value?.branchs?.length > 2) {
		nodeConfig.value.branchs = nodeConfig.value.branchs
			.filter(condition => condition?.id !== item?.id)
			.map((c, ind) => {
				if (c) {
					c.priorityLevel = ind + 1;
					c.name = `条件${ind + 1}`;
				}
				return c;
			});
	}
	if (nodeConfig.value?.branchs?.length === 2) {
		// 另一个条件节点
		const retain = JSON.parse(JSON.stringify(nodeConfig.value?.branchs.find(c => c?.id !== item?.id)));
		// 保存路由节点下面的子节点
		let nodeConfigChildren: WorkflowNodeType = nodeConfig.value?.children
			? JSON.parse(JSON.stringify(nodeConfig.value.children))
			: undefined;
		// 递归
		const findLastChildNode = (node: NodeType) => {
			if (node.children) {
				findLastChildNode(node.children);
			} else {
				if (nodeConfigChildren) {
					nodeConfigChildren.parentId = node.id;
				}
				node.children = nodeConfigChildren;
			}
		};
		//递归retain, 如果有子节点，将子节点赋值给retain的最后一级子节点为undefined的childNode
		findLastChildNode(retain);
		if (retain.children) {
			retain.children.parentId = nodeConfig.value?.parentId;
		}
		emits("update:modelValue", retain?.children);
	}
};

/** 设置优先级
 * @param flag 0:左移 1: 右移
 * @param item 当前节点
 */
const setPriorityLevel = (flag: number, item: WorkflowNodeType) => {
	const index = nodeConfig.value?.branchs?.findIndex(c => c?.priorityLevel === item?.priorityLevel);
	if (nodeConfig.value?.branchs && index !== undefined && index !== -1) {
		const temp = nodeConfig.value.branchs[index];
		const idx = flag ? index + 1 : index - 1;
		nodeConfig.value.branchs[index] = nodeConfig.value?.branchs[idx];
		nodeConfig.value.branchs[idx] = temp;
		nodeConfig.value.branchs.forEach((nd, index) => {
			nd!.priorityLevel = index + 1;
		});
	}
};

/** 点击条件节点 */
const clickNode = (item: WorkflowNodeType) => {
	emits("nodeClick", item);
};
</script>

<template>
	<div :class="['branch-node', nodeConfig?.error && 'branch-node-error']">
		<div
			v-for="(item, index) in nodeConfig?.branchs"
			:key="index"
			:class="[
				'branch-node-item',
				index === 0 && 'start',
				nodeConfig?.branchs && index === nodeConfig?.branchs?.length - 1 && 'end'
			]"
		>
			<template v-if="index === 0 || (nodeConfig?.branchs && index === nodeConfig?.branchs?.length - 1)">
				<div
					class="hide-line top-hide-line"
					:style="{ left: index === 0 ? '-1px' : 'unset', right: index === 0 ? 'unset' : '-1px' }"
				></div>
				<div
					class="hide-line bottom-hide-line"
					:style="{ left: index === 0 ? '-1px' : 'unset', right: index === 0 ? 'unset' : '-1px' }"
				></div>
			</template>
			<div class="branch-node-content">
				<div class="branch-node-wrap">
					<div
						:class="['node', item?.error && 'node-error']"
						@mouseenter="() => handleHover(item)"
						@mouseleave="() => handleHover(item, 1)"
						@click="clickNode(item)"
					>
						<div class="node-header">
							<span class="name"><i class="wf-iconfont icon-conditions"></i> {{ item?.name }}</span>
							<span v-if="!(hoverItem && hoverItem?.priorityLevel === item?.priorityLevel)" class="level"
								>优先级{{ item?.priorityLevel }}</span
							>
							<div v-else class="button-group">
								<el-icon class="icon" @click.stop="deleteBranchNode(item)"><Close /></el-icon>
							</div>
						</div>
						<div class="node-content">
							<div class="pick">
								<p v-if="!item?.config?.conditions?.length">请设置条件</p>
								<p v-else>123</p>
							</div>
						</div>
						<template v-if="hoverItem && hoverItem?.priorityLevel === item?.priorityLevel">
							<div v-if="index !== 0" class="left lv-btn" @click.stop="setPriorityLevel(0, item)">
								<el-icon class="icon"><ArrowLeft /></el-icon>
							</div>
							<div
								v-if="nodeConfig?.branchs && index !== nodeConfig?.branchs?.length - 1"
								class="right lv-btn"
								@click.stop="setPriorityLevel(1, item)"
							>
								<el-icon class="icon"><ArrowRight /></el-icon>
							</div>
						</template>
					</div>
					<AddNode v-if="item" v-model:node-children="item.children" :parent-node="item"></AddNode>
				</div>
				<NodeWrap v-if="item?.children" v-model="item.children" :parent-id="item.id"></NodeWrap>
			</div>
		</div>
		<div class="add-condition-button" @click="addCondition">添加条件</div>
	</div>
</template>

<style scoped lang="scss">
@import "../../variable.scss";
.branch-node {
	position: relative;
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-start;
	.branch-node-item {
		position: relative;
		z-index: 1;
		padding: 30px 50px;
		background-color: $workflow-bg;
		border-top: 2px solid $workflow-line-color;
		border-bottom: 2px solid $workflow-line-color;
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
		.hide-line {
			position: absolute;
			width: 50%;
			height: 5px;
			background-color: #f5f5f5;
		}
		.top-hide-line {
			top: -3px;
		}
		.bottom-hide-line {
			bottom: -3px;
		}
	}
	.add-condition-button {
		position: absolute;
		top: -20px;
		left: 50%;
		z-index: 2;
		height: 40px;
		padding: 0 10px;
		font-size: 14px;
		line-height: 40px;
		cursor: pointer;
		user-select: none;
		background-color: #ffffff;
		border-radius: $workflow-node-radius;
		box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
		transition: all 0.2s;
		transform: translateX(-50%);
		&:hover {
			box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
			transform: translateX(-50%) scale(1.1);
		}
	}
	.branch-node-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 100%;
	}
	.node {
		position: relative;
		.lv-btn {
			position: absolute;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 10px;
			height: 100%;
			box-shadow: 0 0 3px 0 rgb(0 0 0 / 10%);
			.el-icon {
				font-size: 12px;
			}
			&:hover {
				background-color: #f0f0f0;
			}
			&.left {
				left: 0;
			}
			&.right {
				right: 0;
			}
		}
		.node-header {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.name {
				max-width: 100%;
				overflow: hidden;
				color: $workflow-condition-title-color;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.level {
				flex-shrink: 0;
				font-size: 12px;
				color: #999999;
			}
			.button-group {
				display: flex;
				justify-content: flex-end;
				background-color: #ffffff;
				.icon {
					width: 12px;
					height: 12px;
					font-size: 12px;
					color: #999999;
					cursor: pointer;
					transition: all 0.2s;
					&:hover {
						color: #ff4949;
					}
				}
			}
		}
	}
}
.branch-node-error {
	.branch-node-item {
		border-color: rgb(223 150 150);
		&::after {
			background-color: rgb(223 150 150);
		}
	}
	.add-node::after {
		background-color: rgb(223 150 150);
	}
}
.symbol {
	font-weight: bold;
	color: $workflow-condition-title-color;
}
</style>
