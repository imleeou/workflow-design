<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { NodeConfigType, PersonType, WorkflowNodeType } from "../../types";
import { WORKFLOW_APPROVER_RADIO_MAP } from "../../constants";
import ShuttleSelectorTrigger from "@/components/ShuttleSelector/SelectorTrigger.vue";

interface Props {
	nodeConfig: WorkflowNodeType;
}
const props = defineProps<Props>(),
	emits = defineEmits<{
		(e: "configChange", nodeConfig: WorkflowNodeType): void;
	}>();

const config = ref<NodeConfigType>({
		assignType: props.nodeConfig?.config?.assignType || ""
	}),
	shuttleSelectorTriggerRef = ref<InstanceType<typeof ShuttleSelectorTrigger>>();

const nodePerson = ref<PersonType[]>(props.nodeConfig?.nodePerson || []);

/** 指定人员或部门或角色的类型 */
const selectorType = computed(() => {
	return config.value.assignType ? WORKFLOW_APPROVER_RADIO_MAP.find(s => s.label === config.value.assignType)?.select : "";
});

const radioChange = (val: string | number | boolean) => {
	config.value.assignType = val as string;
	nodePerson.value = [];
	shuttleSelectorTriggerRef.value?.clearChecked();
	selectorConfirm();
};

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
	<FormCard title="选择抄送对象">
		<el-radio-group v-model="config.assignType" @change="radioChange">
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
</template>

<style scoped lang="scss">
.card-radio {
	width: 33.33%;
	margin-right: 0;
}
</style>
