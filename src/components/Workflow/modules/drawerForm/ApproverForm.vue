<script setup lang="ts">
import { computed, ref, watch } from "vue";
import FormCard from "./FormCard.vue";
import { WORKFLOW_APPROVER_RADIO_MAP } from "../../constants";
import { PersonType, WorkflowNodeType } from "../../types";
import ShuttleSelectorTrigger from "@/components/ShuttleSelector/SelectorTrigger.vue";

const props = defineProps<{
		nodeConfig: WorkflowNodeType;
	}>(),
	emits = defineEmits<{
		(e: "configChange", nodeConfig: WorkflowNodeType): void;
	}>();

const config = ref<{
		autoApprove: boolean;
		directEnd: boolean;
		assignType: string;
	}>({
		autoApprove: props.nodeConfig?.config?.autoApprove || false,
		directEnd: props.nodeConfig?.config?.directEnd || false,
		assignType: props.nodeConfig?.config?.assignType || ""
	}),
	nodePerson = ref<PersonType[]>(props.nodeConfig?.nodePerson || []),
	shuttleSelectorTriggerRef = ref<InstanceType<typeof ShuttleSelectorTrigger>>();

const approverChange = (val: string | number | boolean) => {
	console.log("approverChange", val);
	shuttleSelectorTriggerRef.value?.clearChecked();
};

/** 指定人员或部门或角色的类型 */
const selectorType = computed(() => {
	return config.value.assignType ? WORKFLOW_APPROVER_RADIO_MAP.find(s => s.label === config.value.assignType)?.select : "";
});

/** 选择人员确认 */
const selectorConfirm = () => {
	emits("configChange", {
		...props.nodeConfig,
		nodePerson: [...nodePerson.value],
		config: { ...config.value }
	} as WorkflowNodeType);
};

watch(
	() => config.value,
	() => {
		selectorConfirm();
	},
	{
		deep: true
	}
);
</script>

<template>
	<FormCard title="选择审批对象">
		<el-radio-group v-model="config.assignType" @change="approverChange">
			<el-radio v-for="r in WORKFLOW_APPROVER_RADIO_MAP" :key="r.text + r.label" :label="r.label" class="card-radio">{{
				r.text
			}}</el-radio>
		</el-radio-group>
		<ShuttleSelectorTrigger
			v-if="selectorType"
			ref="shuttleSelectorTriggerRef"
			v-model="nodePerson"
			:selector-type="selectorType"
			@confirm="selectorConfirm"
			>选择人员</ShuttleSelectorTrigger
		>
	</FormCard>
	<FormCard title="自动审批">
		<span class="label">该节点是否自动通过：</span>
		<el-switch v-model="config.autoApprove" inline-prompt active-text="是" inactive-text="否" width="60" />
	</FormCard>
	<FormCard title="如果审批被驳回">
		<el-radio-group v-model="config.directEnd">
			<el-radio :label="false">驳回至上个节点</el-radio>
			<el-radio :label="true">直接结束流程</el-radio>
		</el-radio-group>
	</FormCard>
</template>

<style scoped lang="scss">
.card-radio {
	width: 33.33%;
	margin-right: 0;
}

.label {
	font-size: 14px;
	color: #606266;
}
</style>
