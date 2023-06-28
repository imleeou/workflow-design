<script setup lang="ts">
import { computed, ref } from "vue";
import { NodeType, WorkflowNodeType } from "../../types";
import { Close, ArrowRight } from "@element-plus/icons-vue";
import { PERSON_NODE_RENDER_INFO, WorkflowNodeTypeEnum } from "../../constants";

const props = defineProps<{
		/** 节点信息 */
		modelValue: NodeType;
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: WorkflowNodeType): void;
	}>();
/** 删除图标是否显示 */
const isShowCloseIcon = ref(false);

/** 鼠标滑入滑出
 * @param direction 0: 滑入 1: 滑出
 */
const mouseOperation = (direction: 0 | 1) => {
	isShowCloseIcon.value = !direction;
};

/** 删除人员节点 */
const deletePersonNode = () => {
	const child = props.modelValue?.children
		? ({
				...props.modelValue?.children
		  } as NodeType)
		: undefined;
	emits("update:modelValue", child);
};

/** 当前节点类型对应的渲染信息 */
const currentNodeRender = computed(() => {
	return PERSON_NODE_RENDER_INFO[props.modelValue?.type as keyof typeof PERSON_NODE_RENDER_INFO];
});
</script>

<template>
	<div class="node person-node" @mouseenter="mouseOperation(0)" @mouseleave="mouseOperation(1)">
		<div class="node-header" :style="{ backgroundColor: `${currentNodeRender.color}` }">
			<p class="node-name">
				<i :class="['wf-iconfont', currentNodeRender.icon]"></i>
				<span>{{ props.modelValue.name }}</span>
			</p>
			<el-icon
				v-show="isShowCloseIcon && modelValue.type !== WorkflowNodeTypeEnum.Initiator"
				class="close-icon"
				@click.stop="deletePersonNode"
				><Close
			/></el-icon>
		</div>
		<div class="node-content">
			<div class="pick">
				<p v-if="props.modelValue.nodePerson?.length">
					<template v-for="(person, index) in props.modelValue.nodePerson" :key="index">
						<span>{{ person.name }}</span>
						<span
							v-if="
								props.modelValue &&
								props.modelValue.nodePerson &&
								props.modelValue.nodePerson.length > 1 &&
								index !== props.modelValue.nodePerson.length - 1
							"
							>、</span
						>
					</template>
				</p>
				<p v-else>{{ currentNodeRender.placeholder }}</p>
			</div>
			<el-icon class="arrow-right"><ArrowRight /></el-icon>
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
