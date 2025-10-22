<script setup>
import FingerprintJS from "@fingerprintJs/fingerprintjs";
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
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();
import { useSysSettingStore } from "@/stores/sysSettingStore";
const sysSettingStore = useSysSettingStore();

const config = ref({
  max: 1,
});

const getSysSetting = async () => {
  let result = await proxy.Request({
    url: Api.getSysSetting,
  });
  if (!result) {
    return;
  }
  sysSettingStore.saveSetting(result.data);
};

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

let categoryList = [];
let categoryMap = {};

const loadCategory = async () => {
  let result = await proxy.Request({
    url: Api.loadAllCategory,
  });
  if (!result) {
    return;
  }
  categoryList = result.data;
  result.data.forEach((element) => {
    categoryMap[element.categoryCode] = element;
    element.children.forEach((sub) => {
      categoryMap[sub.categoryCode] = sub;
    });
  });
  categoryStore.saveCategoryMap(categoryMap);
  categoryStore.saveCategoryList(categoryList);
};
loadCategory();

const getDeviceId = async () => {
  let deviceId = VueCookies.get("deviceId");
  if (!deviceId) {
    const fpPromise = await FingerprintJS.load();
    const result = await fpPromise.get();
    deviceId = result.visitorId;
    VueCookies.set("deviceId", deviceId, -1);
  }
  loginStore.saveDeviceId(deviceId);
};

onBeforeMount(() => {
  persistentLogin();
  getSysSetting();
  getDeviceId();
});
</script>

<template>
  <el-config-provider :locale="zhCn" :message="config">
    <router-view />
  </el-config-provider>
</template>

<style scoped>
</style>
