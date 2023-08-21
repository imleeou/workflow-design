<script setup lang="ts">
import { computed, ref } from "vue";
import { NodeType, WorkflowApproveRadioType, WorkflowNodeType } from "../../types";
import { Close, ArrowRight } from "@element-plus/icons-vue";
import { PERSON_NODE_RENDER_INFO, WORKFLOW_APPROVER_RADIO_MAP, WorkflowNodeTypeEnum } from "../../constants";

const props = defineProps<{
		/** 节点信息 */
		modelValue: NodeType;
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: WorkflowNodeType): void;
	}>();
/** 删除图标是否显示 */
const isShowCloseIcon = ref(false);
const propAssignType = computed(() => {
	return props.modelValue.config?.assignType || "";
});

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

/** 需要主动选择的类型 */
const needSelectTypeLabels = WORKFLOW_APPROVER_RADIO_MAP.filter((item: WorkflowApproveRadioType) => !!item.select).map(
	(item: WorkflowApproveRadioType) => item.label
);
/** 获取人员类型label */
const getPersonTypeLabel = computed(() => {
	const assign = WORKFLOW_APPROVER_RADIO_MAP.find((item: WorkflowApproveRadioType) => item.label === propAssignType.value);
	return assign ? (needSelectTypeLabels.includes(propAssignType.value) ? `${assign.text}：` : assign.text) : "";
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
				<span v-if="getPersonTypeLabel">{{ getPersonTypeLabel }}</span>
				<span v-if="props.modelValue.nodePerson?.length">
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
				</span>
				<span v-if="!props.modelValue.nodePerson?.length && !getPersonTypeLabel">
					{{ currentNodeRender.placeholder }}
				</span>
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
	.pick {
		p {
			display: inline-block;
		}
	}
}
</style>
