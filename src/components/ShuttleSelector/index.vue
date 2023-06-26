<script setup lang="ts">
import { computed, ref, watch } from "vue";
import axios from "axios";
import { DEFAULT_BREADCRUMB, WorkflowPersonMap, WorkflowPersonTypeEnum } from "./constants";
import { PersonInfoType } from "./types";
import { Search, Close } from "@element-plus/icons-vue";

const props = defineProps<{
		modelValue: boolean;
		/** 选择类型 */
		type?: WorkflowPersonTypeEnum;
		/** 初始选中值 */
		defaultIds?: number[];
	}>(),
	emits = defineEmits<{
		(e: "update:modelValue", value: boolean): void;
		(e: "confirm", checkList: PersonInfoType[]): void;
	}>();
const dialogTableVisible = ref(props.modelValue),
	/** 组织架构数据 */
	orgData = ref<PersonInfoType[]>([]),
	/** 待选项数据 */
	pendingOption = ref<PersonInfoType[]>([]),
	queryKey = ref(""),
	checkIds = ref<number[]>([...(props.defaultIds ?? [])]),
	/** 存放层级面包屑 */
	breadcrumb = ref<
		{
			text: string;
			id: number;
		}[]
	>([...DEFAULT_BREADCRUMB]);

const title = computed(() => {
	return props.type ? WorkflowPersonMap[props.type] : "选择部门或人员";
});

const flatData = computed(() => {
	return flatOrgData(orgData.value);
});

/** 选中项数据 */
const checkList = computed(() => {
	return flatData.value.filter(item => checkIds.value.includes(item.id));
});

/** 全选按钮中间状态 */
const isIndeterminate = computed(() => {
	return checkIds.value.length > 0 && checkIds.value.length < flatData.value.length;
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
		const item = flatData.value.find(item => item.id === id);
		pendingOption.value = item && item.children ? item.children : [];
	}
};

/** 点击确认 */
const confirm = () => {
	emits("update:modelValue", false);
	emits("confirm", checkList.value);
};

/** 点击取消 */
const cancel = () => {
	emits("update:modelValue", false);
};

/** 输入框筛选 */
const queryInput = (value: string) => {
	breadcrumb.value = [...DEFAULT_BREADCRUMB];
	if (!value) {
		pendingOption.value = orgData.value;
	} else {
		const result = flatData.value.filter(item => item.name.includes(value));
		pendingOption.value = result;
	}
};

/** 全选 */
const selectAll = (value: boolean) => {
	// 取消全选
	checkIds.value = value ? flatData.value.map(item => item.id) : [];
};

/** 删除选择项 */
const deleteSelected = (item: PersonInfoType) => {
	checkIds.value = checkIds.value.filter(id => id !== item.id);
};

/** 清空选中 */
const clearChecked = () => {
	checkIds.value = [];
};

/** 判断当前选项禁用状态 */
const disabledCheckBox = (item: PersonInfoType) => {
	return (
		(props.type === WorkflowPersonTypeEnum.Department && item.type !== WorkflowPersonTypeEnum.Department) ||
		(props.type === WorkflowPersonTypeEnum.Person && item.type !== WorkflowPersonTypeEnum.Person) ||
		(props.type === WorkflowPersonTypeEnum.Role && item.type !== WorkflowPersonTypeEnum.Role)
	);
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
				<el-input
					v-model="queryKey"
					class="query-input"
					placeholder="输入名称关键词"
					clearable
					:suffix-icon="Search"
					@input="queryInput"
				/>
				<div class="breadcrumb">
					<template v-for="(crumb, index) in breadcrumb" :key="index">
						<span class="text" @click="handleCrumb(crumb)">{{ crumb.text }}</span>
						<span v-if="index + 1 !== breadcrumb.length"> / </span>
					</template>
				</div>
				<div class="tools">
					<el-checkbox :disabled="!pendingOption?.length" :indeterminate="isIndeterminate" @change="selectAll">全选</el-checkbox>
					<span v-if="breadcrumb?.length > 1" class="superiors" @click="returnSuperior">返回上级</span>
				</div>
				<div class="options">
					<el-checkbox-group v-if="pendingOption.length" v-model="checkIds">
						<div v-for="item in pendingOption" :key="item.id" class="option">
							<el-checkbox :label="item.id" class="checkbox" :disabled="disabledCheckBox(item)">
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
					<el-empty v-else description="暂无数据" />
				</div>
			</div>
			<div class="selected">
				<div class="selected-tool">
					<span>已选择：{{ checkIds.length }}</span>
					<span class="clear" @click="clearChecked">清空</span>
				</div>
				<ul class="checked-list">
					<li v-for="(item, index) in checkList" :key="index" class="checked">
						<div class="label">
							<i
								:class="['wf-iconfont', item.type === WorkflowPersonTypeEnum.Department ? 'icon-conditions' : 'icon-initiator']"
							></i>
							<span>{{ item.name }}</span>
						</div>
						<el-icon class="close-icon" @click="deleteSelected(item)"><Close /></el-icon>
					</li>
				</ul>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel"> 取消 </el-button>
				<el-button type="primary" @click="confirm"> 确认 </el-button>
			</span>
		</template>
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
		padding: 0 10px;

		.selected-tool {
			display: flex;
			justify-content: space-between;
			padding: 20px 0;
			.clear {
				color: #409eff;
				cursor: pointer;
				user-select: none;
				&:hover {
					text-decoration: underline;
				}
			}
		}

		.checked-list {
			width: 100%;
			list-style: none;
			.checked {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 5px 0;
				&:hover {
					background-color: #f5f5f5;
					cursor: pointer;
				}
				.label {
					display: flex;
					align-items: center;
					span {
						margin-left: 5px;
					}
				}
				.close-icon {
					cursor: pointer;
					&:hover {
						font-weight: bold;
						transition: all 0.3s;
						transform: scale(1.2);
					}
				}
			}
		}
	}
}
</style>
