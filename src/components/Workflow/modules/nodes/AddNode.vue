<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
</script>

<template>
  <div class="add-node">
    <el-popover placement="right" :width="400" trigger="click">
      <template #reference>
        <div class="add-button">
          <el-icon><Plus /></el-icon>
        </div>
      </template>
      123
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
@import "../../variable.scss";
.add-node {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $workflow-node-width;
  padding: 25px 0 35px;
  &::after {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: -1;
    width: 2px;
    height: 100%;
    content: "";
    background-color: $workflow-line-color;
    transform: translateX(-50%);
  }
  .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background-color: $workflow-add-btn-bg;
    border-radius: 50%;
    transition: all 0.3s;
    &:hover {
      background-color: $workflow-add-btn-hover-bg;
    }
    .el-icon {
      font-size: 20px;
      color: #ffffff;
    }
  }
}
</style>
