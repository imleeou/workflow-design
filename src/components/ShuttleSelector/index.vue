<script setup lang="ts">
import { computed, ref, watch } from "vue";
import axios from "axios";
import { WorkflowPersonMap, WorkflowPersonTypeEnum } from "./constants";
import { PersonInfoType } from "./types";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{
		modelValue: boolean;
		/** 选择类型 */
		type?: WorkflowPersonTypeEnum;
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", value: boolean): void;
	}>();
const dialogTableVisible = ref(props.modelValue),
	/** 组织架构数据 */
	orgData = ref<PersonInfoType[]>([]),
	// 待选项
	pendingOption = ref<PersonInfoType[]>([]),
	queryKey = ref("");

const title = computed(() => {
	return props.type ? WorkflowPersonMap[props.type] : "选择部门或人员";
});

const close = () => {
	emits("update:modelValue", false);
};

/** 获取公司组织架构 */
const getCompanyOrg = async () => {
	const { data } = await axios.get("/json/company.json");
	orgData.value = data;
	pendingOption.value = data;
};
getCompanyOrg();

watch(
	() => props.modelValue,
	(nv: boolean) => {
		dialogTableVisible.value = nv;
	}
);
</script>

<template>
	<el-dialog v-model="dialogTableVisible" :title="title" width="840" @close="close">
		<div class="dialog-body">
			<div class="list">
				<el-input v-model="queryKey" placeholder="输入名称关键词" :suffix-icon="Search" />
				<ul class="options">
					<li v-for="item in pendingOption" :key="item.id" class="option">{{ item.name }}</li>
				</ul>
			</div>
			<div class="selected"></div>
		</div>
	</el-dialog>
</template>

<style scoped lang="scss">
.dialog-body {
	width: 800px;
	height: 500px;
	border-radius: 5px;
	border: 1px solid #ccc;
	display: flex;
	align-items: center;
	.list,
	.selected {
		width: 50%;
		height: 100%;
		flex-shrink: 0;
	}
	.list {
		.options {
			list-style: none;
			.option {
				padding: 5px 10px;
				&:hover {
					background-color: #f5f5f5;
					cursor: pointer;
				}
			}
		}
	}
	.selected {
		border-left: 1px solid #ccc;
	}
}
</style>
