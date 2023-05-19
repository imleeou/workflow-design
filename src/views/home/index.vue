<script setup lang="ts">
import { ref } from "vue";
import { WorkflowNodeType } from "@/components/Workflow/type";
import Workflow from "@/components/Workflow/index.vue";

/** 保存审批流数据 */
const workflowData = ref<WorkflowNodeType>();

const save = () => {
  console.log("保存");
};
</script>

<template>
  <header class="header">
    <el-button @click="save">保存</el-button>
    <el-button type="primary">发布</el-button>
  </header>
  <Workflow v-model="workflowData"></Workflow>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}
</style>
