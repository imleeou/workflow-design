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
	/** 待选项数据 */
	pendingOption = ref<PersonInfoType[]>([]),
	queryKey = ref(""),
	checkList = ref([]),
	/** 存放层级面包屑 */
	breadcrumb = ref<
		{
			text: string;
			id: number;
		}[]
	>([
		{
			text: "全部",
			id: 0
		}
	]);

const title = computed(() => {
	return props.type ? WorkflowPersonMap[props.type] : "选择部门或人员";
});

/** 递归扁平化orgData */
const flatOrgData = (data: PersonInfoType[]): PersonInfoType[] => {
	return data.reduce((prev, cur) => {
		if (cur.children && cur.children.length) {
			return [...prev, cur, ...flatOrgData(cur.children)];
		} else {
			return [...prev, cur];
		}
	}, [] as PersonInfoType[]);
};

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

/** 点击下级 */
const junior = (item: PersonInfoType) => {
	const { children } = item;
	breadcrumb.value.push({ text: item.name, id: item.id });
	if (children && children.length) {
		pendingOption.value = children;
	}
};

/** 返回上级 */
const returnSuperior = () => {
	// 取面包屑倒数第二项的id
	const id = breadcrumb.value[breadcrumb.value.length - 2].id;
	setPendingOption(id);
	breadcrumb.value.pop();
};

/** 点击面包屑 */
const handleCrumb = (crumb: { text: string; id: number }) => {
	const { id } = crumb;
	setPendingOption(id);
	const index = breadcrumb.value.findIndex(item => item.id === id);
	breadcrumb.value.splice(index + 1);
};

/** 设置展示的数据 */
const setPendingOption = (id: number) => {
	if (id === 0) {
		pendingOption.value = orgData.value;
	} else {
		const data = flatOrgData(orgData.value);
		const item = data.find(item => item.id === id);
		if (item) {
			pendingOption.value = item.children || [];
		}
	}
};

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
				<el-input v-model="queryKey" class="query-input" placeholder="输入名称关键词" :suffix-icon="Search" />
				<div class="breadcrumb">
					<template v-for="(crumb, index) in breadcrumb" :key="index">
						<span class="text" @click="handleCrumb(crumb)">{{ crumb.text }}</span>
						<span v-if="index + 1 !== breadcrumb.length"> / </span>
					</template>
				</div>
				<div class="tools">
					<el-checkbox>全选</el-checkbox>
					<span v-if="breadcrumb?.length > 1" class="superiors" @click="returnSuperior">返回上级</span>
				</div>
				<div class="options">
					<el-checkbox-group v-model="checkList">
						<div v-for="item in pendingOption" :key="item.id" class="option">
							<el-checkbox :label="item.id" class="checkbox">
								<div class="label-content">
									<i
										:class="[
											'wf-iconfont',
											item.type === WorkflowPersonTypeEnum.Department ? 'icon-conditions' : 'icon-initiator'
										]"
									></i>
									<span>{{ item.name }}</span>
								</div>
							</el-checkbox>
							<span
								v-if="item.type === WorkflowPersonTypeEnum.Department && item.children && item.children.length"
								class="next"
								@click.stop="junior(item)"
								>下级</span
							>
						</div>
					</el-checkbox-group>
				</div>
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
		padding: 0 10px;
		.query-input {
			margin-top: 5px;
		}
		.options {
			.option {
				width: 100%;
				padding: 5px 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:hover {
					background-color: #f5f5f5;
					cursor: pointer;
				}
				.checkbox {
					flex-grow: 1;
					.label-content {
						span {
							margin-left: 5px;
						}
					}
				}
				.next {
					flex-shrink: 0;
					display: block;
					font-size: 14px;
					user-select: none;

					&:hover {
						color: #409eff;
					}
				}
			}
		}
		.tools {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.superiors {
				color: #409eff;
				cursor: pointer;
				user-select: none;
				&:hover {
					text-decoration: underline;
				}
			}
		}
		.breadcrumb {
			padding: 10px 0;
			.text:hover {
				color: #409eff;
				cursor: pointer;
			}
		}
	}
	.selected {
		border-left: 1px solid #ccc;
	}
}
</style>
