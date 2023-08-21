<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import { WorkflowApproveRadioType, WorkflowNodeType } from "../types";
import { ElNotification } from "element-plus";
import { WorkflowNodeTypeEnum, WORKFLOW_ID_REG, WORKFLOW_APPROVER_RADIO_MAP } from "../constants";
import InitiatorForm from "./drawerForm/InitiatorForm.vue";
import ApproverForm from "./drawerForm/ApproverForm.vue";
import CcForm from "./drawerForm/CcForm.vue";
import ConditionsForm from "./drawerForm/ConditionsForm.vue";

// 支持透传属性，详细属性参考ELDrawer的属性：https://element-plus.org/zh-CN/component/drawer.html#drawer-attributes
interface Props {
	modelValue: boolean;
	nodeConfig: WorkflowNodeType;
	title?: string;
	/** 取消按钮文字 */
	cancelButtonText?: string;
	/** 确认按钮文字 */
	confirmButtonText?: string;
	/** 确认按钮关闭前 */
	beforeConfirm?: () => Promise<boolean>;
	/** 宽度 */
	size?: string | number;
	/** 是否显示遮罩 */
	modal?: boolean;
	/** 控制是否在关闭 Drawer 之后将子元素全部销毁 */
	destroyOnClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
		cancelButtonText: "取消",
		confirmButtonText: "确定",
		size: "588px",
		modal: false,
		destroyOnClose: true,
		title: undefined,
		beforeConfirm: undefined
	}),
	emits = defineEmits<{
		(e: "update:modelValue", modelValue: boolean): void;
		(e: "dataChange", modelValue: WorkflowNodeType): void;
		/** 点击取消 */
		(e: "cancel"): void;
		/** 点击确认 */
		(e: "confirm"): void;
	}>();

const drawerShow = ref<boolean>(props.modelValue),
	attr = useAttrs(),
	confirmLoading = ref<boolean>(false),
	/** 暂存drawer的数据，在点击确认后提交 */
	saveDrawerData = ref<WorkflowNodeType>(),
	/** 基础信息，id、name */
	baseInfo = ref({
		id: props.nodeConfig?.id,
		name: props.nodeConfig?.name
	});

/** 校验表单 */
const validateForm = async (): Promise<boolean> => {
	let result = true;
	// 判断审批人 | 抄送人 是否指定人员
	if (saveDrawerData.value?.type === WorkflowNodeTypeEnum.Approver || saveDrawerData.value?.type === WorkflowNodeTypeEnum.Copy) {
		// 需要选择人员的选项
		const needSelect = WORKFLOW_APPROVER_RADIO_MAP.filter((i: WorkflowApproveRadioType) => !!i.select);
		const assType = saveDrawerData.value.config?.assignType;
		const radio = WORKFLOW_APPROVER_RADIO_MAP.find(r => r.label === assType);
		// 当选择的类型需要指定时
		if (assType && needSelect.find(n => n.label === assType) && !saveDrawerData.value.nodePerson?.length) {
			// 判断选择人员是否未空
			ElNotification({
				title: "指定项未选择",
				message: `请选择【${radio?.text}】`,
				type: "warning",
				duration: 2000
			});
			result = false;
		}
	}
	return result;
};

/** 点击取消 */
const cancel = () => {
	drawerShow.value = false;
	emits("cancel");
};

/** 点击确认 */
const confirm = async () => {
	try {
		confirmLoading.value = !!props.beforeConfirm;
		let res = props.beforeConfirm ? await props.beforeConfirm() : true;
		res = (await validateForm()) ? res : false;
		confirmLoading.value = false;
		if (!res) return;
		emits("confirm");
		const data = JSON.parse(JSON.stringify(saveDrawerData.value || props.nodeConfig));
		// 当基础信息id更改时，更新parentId
		if (data?.children) {
			data.children.parentId = baseInfo.value.id;
		}
		// 重置save数据
		saveDrawerData.value = undefined;
		emits("dataChange", {
			...data,
			...baseInfo.value
		} as WorkflowNodeType);
		drawerShow.value = false;
	} catch (error) {
		console.log("error", error);
	}
};

const componentId = computed(() => {
	/** 节点类型对应的Form表单 */
	const NODE_FORM_ENUM = {
		[WorkflowNodeTypeEnum.Initiator]: InitiatorForm,
		[WorkflowNodeTypeEnum.Approver]: ApproverForm,
		[WorkflowNodeTypeEnum.Copy]: CcForm,
		[WorkflowNodeTypeEnum.ConditionBranch]: ConditionsForm
	};

	return props.nodeConfig?.type && Object.keys(NODE_FORM_ENUM).includes(props.nodeConfig?.type.toString())
		? NODE_FORM_ENUM[props.nodeConfig.type as keyof typeof NODE_FORM_ENUM]
		: "";
});

/** 抽屉数据更改 */
const configChange = (val: WorkflowNodeType) => {
	console.log("configChange--->", val);
	saveDrawerData.value = val;
};

watch(
	() => drawerShow.value,
	(val: boolean) => {
		emits("update:modelValue", val);
	}
);
</script>

<template>
	<el-drawer
		v-model="drawerShow"
		:title="baseInfo?.name"
		:destroy-on-close="destroyOnClose"
		direction="rtl"
		:modal="modal"
		:size="size"
		v-bind="attr"
		:z-index="999"
		:append-to-body="true"
	>
		<div class="common-options">
			<div class="drawer-sub-title">常规</div>
			<el-form label-width="40px">
				<el-form-item label="ID">
					<el-input
						v-model="baseInfo!.id"
						placeholder="请输入节点ID"
						maxlength="50"
						:formatter="(value:string) => `${value.replace(WORKFLOW_ID_REG,'')}`"
						:disabled="nodeConfig!.type === WorkflowNodeTypeEnum.Initiator"
					>
						<template #suffix>
							<i class="process-iconfont icon-edit"></i>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input
						v-model="baseInfo!.name"
						placeholder="请输入节点名称"
						maxlength="50"
						:disabled="nodeConfig!.type === WorkflowNodeTypeEnum.Initiator"
					>
						<template #suffix> <i class="process-iconfont icon-edit"></i> </template
					></el-input>
				</el-form-item>
			</el-form>
		</div>
		<component :is="componentId" :node-config="nodeConfig" @config-change="configChange"></component>
		<template #footer>
			<el-button @click="cancel">{{ props.cancelButtonText }}</el-button>
			<el-button :loading="confirmLoading" type="primary" @click="confirm">{{ props.confirmButtonText }}</el-button>
		</template>
	</el-drawer>
</template>

<style lang="scss">
@import "../variable.scss";
.el-drawer__header {
	padding: 20px;
	margin-bottom: 0;
	box-shadow: $workflow-shadow;
}
.drawer-sub-title {
	width: 100%;
	padding: 15px 0;
	font-size: 16px;
	font-weight: 600;
	color: #333333;
}
</style>
