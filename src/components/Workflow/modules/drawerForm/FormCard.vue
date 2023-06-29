<script setup lang="ts">
const props = defineProps<{
	title?: string;
	card?: boolean;
}>();
</script>

<template>
	<div :class="['form-card', card && 'card-style']">
		<div class="title">
			<span v-if="!$slots.title">{{ props.title }}</span>
			<template v-else>
				<slot name="title"> </slot>
			</template>
		</div>
		<div class="card-content">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
$border: 1px solid #dddddd;
.form-card {
	width: 100%;
	overflow-x: hidden;

	> .title {
		width: 100%;
		padding: 15px 0;
		font-size: 16px;
		font-weight: 600;
		color: #333333;
	}
	> .card-content {
		padding: 0 5px;
	}
	&.card-style {
		border: $border;
		border-radius: 4px;
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
		> .title {
			background-color: #f9fcfc;
			border-bottom: $border;
			padding-left: 15px;
		}
		> .card-content {
			padding: 0 15px;
		}
	}
}
</style>
