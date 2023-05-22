<script setup lang="ts">
import { watch, ref } from "vue";
import { WorkflowNodeType, NodeType } from "../../type";
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
		id: getUniqueId(WorkflowNodeTypeEnum.ParallelBranch),
		name: `分支${len + 1}`,
		type: WorkflowNodeTypeEnum.ParallelBranch,
		children: undefined,
		config: undefined,
		parentId: nodeConfig.value?.id
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
	// 在删除前的分支数量
	const length = nodeConfig.value?.branchs?.length ?? 0;
	if (nodeConfig.value?.branchs && length > 2) {
		nodeConfig.value.branchs = nodeConfig.value.branchs
			.filter(condition => condition?.id !== item?.id)
			.map((c, ind) => {
				if (c) {
					c.name = `分支${ind + 1}`;
				}
				return c;
			});
	} else if (length === 2) {
		// 另一个条件节点
		const retain = JSON.parse(JSON.stringify(nodeConfig.value?.branchs!.find(c => c?.id !== item?.id)));
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
</script>

<template>
	<div class="branch-node">
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
					>
						<div class="node-header">
							<span class="name"><i class="wf-iconfont icon-parallel"></i> {{ item?.name }}</span>
							<div v-if="hoverItem && hoverItem?.id === item?.id" class="button-group">
								<el-icon class="icon" @click.stop="deleteBranchNode(item)"><Close /></el-icon>
							</div>
						</div>
						<div class="node-content">
							<div class="pick">并行任务（同时进行）</div>
						</div>
					</div>
					<AddNode v-if="item" v-model:node-children="item.children" :parent-id="item.id"></AddNode>
				</div>
				<NodeWrap v-if="item?.children" v-model="item.children" :parent-id="item.id"></NodeWrap>
			</div>
		</div>
		<div class="add-condition-button" @click="addCondition">添加分支</div>
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
		.node-header {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.name {
				max-width: 100%;
				overflow: hidden;
				color: $workflow-parallel-title-color;
				text-overflow: ellipsis;
				white-space: nowrap;
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
</style>
