<script setup>
import { messageConfig } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

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
