<script setup lang="ts">
import { ref } from "vue";
import { PersonType, WorkflowNodeType } from "../../types";
import ShuttleSelector from "@/components/ShuttleSelector/index.vue";
interface Props {
	nodeConfig: WorkflowNodeType;
}

const props = defineProps<Props>(),
	emits = defineEmits<{
		(e: "configChange", nodeConfig: WorkflowNodeType): void;
	}>();
const selected = ref<PersonType[]>(props.nodeConfig?.nodePerson || []),
	selectorVisible = ref(false),
	shuttleSelectorRef = ref<InstanceType<typeof ShuttleSelector>>();

/** 选择人员 */
const select = () => {
	selectorVisible.value = true;
};

/** 删除人员或部门 */
const deleteSelect = (u: PersonType) => {
	selected.value = selected.value.filter(item => item.id !== u.id);
	shuttleSelectorRef.value?.deleteSelected(u);
	setData(selected.value.map(item => ({ id: item.id, name: item.name, type: item.type } as PersonType)));
};

/** 设置数据 */
const setData = (users: PersonType[]) => {
	emits("configChange", {
		...props.nodeConfig,
		nodePerson: [...users]
	} as WorkflowNodeType);
};

/** 选择人员确认 */
const selectorConfirm = (checkList: PersonType[]) => {
	selected.value = checkList;
	setData(checkList.map(item => ({ id: item.id, name: item.name, type: item.type } as PersonType)));
};
</script>

<template>
	<div class="drawer-sub-title">发起人选择</div>
	<div class="select-initiator">
		<div class="tip">选择能发起该审批的人员/部门，不选则默认开放给所有人</div>
		<el-button type="primary" @click="select">选择人员</el-button>
		<div class="users">
			<el-tag v-for="u in selected" :key="u.id" class="user-tag" closable @close="deleteSelect(u)">{{ u.name }}</el-tag>
		</div>
	</div>
	<ShuttleSelector ref="shuttleSelectorRef" v-model="selectorVisible" @confirm="selectorConfirm"></ShuttleSelector>
</template>

<style scoped lang="scss">
@import "../../variable.scss";
.select-initiator {
	.tip {
		margin-bottom: 10px;
		font-size: 12px;
		color: $workflow-gray-color;
	}
	.users {
		margin-top: 10px;
		.user-tag {
			margin-right: 10px;
			margin-bottom: 10px;
		}
	}
}
</style>
