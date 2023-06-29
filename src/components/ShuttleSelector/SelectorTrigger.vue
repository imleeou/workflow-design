<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import Selector from "./index.vue";
import { WorkflowPersonEnum } from "../Workflow/constants";
import { WorkflowPersonMap } from "./constants";
import { PersonType } from "../Workflow/types";

const props = defineProps<{
		/** 选择器类型 */
		selectorType?: WorkflowPersonEnum;
		/** 选择数据 */
		modelValue: PersonType[];
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", value: PersonType[]): void;
		(e: "confirm"): void;
	}>();
const selectorVisible = ref(false),
	/** 选择器实例 */
	selectorRef = ref<InstanceType<typeof Selector>>();

/** 按钮文案 */
const buttonText = computed(() => {
	return props.selectorType ? WorkflowPersonMap[props.selectorType] : "选择部门或人员";
});

const visibleToggle = () => {
	selectorVisible.value = true;
};

/** 点击选择器确认 */
const selectorConfirm = (checkList: PersonType[]) => {
	emits("update:modelValue", checkList);
	selectorVisible.value = false;
	emits("confirm");
};

/** 删除选中项 */
const deleteSelect = (u: PersonType) => {
	const newList = props.modelValue.filter(item => item.id !== u.id);
	selectorRef.value?.deleteSelected(u);
	emits("update:modelValue", newList);
};

/** 清空数据 */
const clearChecked = () => {
	selectorRef.value?.clearChecked();
	emits("update:modelValue", []);
};

defineExpose({
	deleteSelect,
	clearChecked
});
</script>

<template>
	<div class="selector-trigger">
		<el-button type="primary" :icon="Plus" @click="visibleToggle">{{ buttonText }}</el-button>
		<div class="users">
			<el-tag v-for="u in modelValue" :key="u.id" class="user-tag" closable @close="deleteSelect(u)">{{ u.name }}</el-tag>
		</div>
	</div>
	<Selector
		ref="selectorRef"
		v-model="selectorVisible"
		:default-ids="modelValue?.map(p => p.id)"
		:type="selectorType"
		@confirm="selectorConfirm"
	></Selector>
</template>

<style scoped lang="scss">
.selector-trigger {
	width: 100%;
	margin: 5px 0;
	.users {
		margin-top: 10px;
		.user-tag {
			margin-right: 10px;
			margin-bottom: 10px;
		}
	}
}
</style>
