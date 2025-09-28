<template>
  <div
    class="main-container"
    :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
    }"
  >
    <div class="header">
      <LayoutHeader></LayoutHeader>
    </div>
    <div class="header-fixed" v-if="showFixedHeader">
      <LayoutHeader theme="dark" />
    </div>
    <div class="header-inner">
      <Account />
    </div>
  </div>
</template>

<script setup>
import Account from "./account/Account.vue";
import LayoutHeader from "./LayoutHeader-bar.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

onMounted(() => {
  window.addEventListener("scroll", windowScrollHandle);
});

const showFixedHeader = ref(false);
const windowScrollHandle = () => {
  let curScrollTop = window.scrollY;
  if (curScrollTop <= 20) {
    showFixedHeader.value = false;
  } else {
    showFixedHeader.value = true;
  }
};
</script>

<style>
body {
  background: #ededed !important;
}
</style>
<style lang="scss" scoped>
.main-container {
  background: #fff;
  margin: 0px auto;
  min-height: calc(100vh);
}

.header {
  margin: 0px auto;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  width: 100%;
  height: 180px;
  background-image: url("../assets/images/banner_bg.png");
}

.header-fixed {
  position: fixed;
  width: 100%;
  top: 0px;
  background: #fff;
}

.header-inner {
  height: 4000px;
  border: black;
}
</style>  