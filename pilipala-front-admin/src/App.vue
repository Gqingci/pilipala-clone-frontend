<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn";

import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  onBeforeMount,
} from "vue";
const { proxy } = getCurrentInstance();

const config = ref({
  max: 1,
});
</script>

<template>
  <el-config-provider :locale="zhCn" :message="config">
    <router-view />
  </el-config-provider>
</template>

<style scoped>
</style>
