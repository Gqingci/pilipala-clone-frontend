<script setup>
import { messageConfig } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  onBeforeMount,
} from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import VueCookies from "vue-cookies";
import { Api } from "@/utils/Api.js";
import Request from "@/utils/Request";
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();

const config = ref({
  max: 1,
});

const persistentLogin = async () => {
  const token = VueCookies.get("token");
  if (!token) {
    return;
  }
  let result = await Request({
    url: Api.persistentLogin,
  });

  if (!result) {
    return;
  }
  saveLoginInfo(result.data);
};

const saveLoginInfo = (loginInfo) => {
  if (!loginInfo) {
    loginStore.saveUserInfo({});
  } else {
    loginStore.saveUserInfo(loginInfo);
  }
};

onBeforeMount(() => {
  persistentLogin();
});
</script>

<template>
  <el-config-provider :locale="zhCn" :message="config">
    <router-view />
  </el-config-provider>
</template>

<style scoped>
</style>
