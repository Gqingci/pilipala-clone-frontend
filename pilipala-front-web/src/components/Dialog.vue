<template>
  <el-dialog
    :show-close="showClose"
    :draggable="draggable"
    :model-value="show"
    :close-on-click-modal="false"
    class="cust-dialog"
    :top="top"
    :width="width"
    @close="close"
  >
    <template #header="{ close, titleId, titleClass }">
      <div v-if="title" class="title">{{ title }}</div>
      <slot v-else name="header"></slot>
    </template>
    <div
      class="dialog-body"
      :style="{
        'max-height': maxHeight + 'px',
        padding: padding + 'px',
      }"
    >
      <slot></slot>
    </div>
    <template v-if="(buttons && buttons.length > 0) || showCancel">
      <div class="dialog-footer">
        <el-button
          tabindex="-1"
          v-for="btn in buttons"
          :type="btn.type || 'primary'"
          @click="btn.click"
          >{{ btn.text }}</el-button
        >
        <el-button tabindex="-1" link @click="close" v-if="showCancel"
          >取消</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const props = defineProps({
  draggable: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  top: {
    type: String,
    default: "25vh",
  },
  width: {
    type: String,
    default: "30%",
  },
  buttons: {
    type: Array,
  },
  padding: {
    type: Number,
    default: 15,
  },
});

const maxHeigh = window.innerHeight - props.top - 120;
const emit = defineEmits();
const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.cust-dialog {
  padding: 0px !important;
  margin-bottom: 5px !important;
  .el-dialog__header {
    padding: 16px;
  }
  .title {
    font-size: 20px;
  }
  .dialog-body {
    min-height: 80px;
    overflow: auto;
    overflow-x: hidden;
    padding: 20px;
  }
  .dialog-footer {
    border-top: 1px solid #ddd;
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
