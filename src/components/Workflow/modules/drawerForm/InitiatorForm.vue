<script setup lang="ts">
import { ref } from "vue";
import { WorkflowNodeType } from "../../types";
interface Props {
	nodeConfig: WorkflowNodeType;
}

const props = defineProps<Props>(),
	emits = defineEmits<{
		(e: "configChange", nodeConfig: WorkflowNodeType): void;
	}>();
const selected = ref<any[]>([]);

/** 选择人员 */
const select = () => {
	console.log("选择人员");
};

/** 删除人员或部门 */
const deleteSelect = (u: any) => {
	console.log("deleteSelect", u);
};

if (props.nodeConfig) {
	emits("configChange", props.nodeConfig);
}
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
