<template>
  <div
    class="main-container"
    :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
    }"
  >
    <div
      class="header"
      v-show="navActionStore.showHeader"
      :style="{
        'background-image': `url(${
          backgroundImage
            ? backgroundImage
            : proxy.Utils.getLocalImage('banner_bg.png')
        })`,
      }"
    >
      <LayoutHeader :hotSearchList="hotSearchList"></LayoutHeader>
    </div>
    <div
      class="header-fixed"
      v-if="
        (navActionStore.fixedHeader && showFixedHeader) ||
        navActionStore.forceFixedHeader
      "
      :style="{
        width: proxy.bodyMaxWidth + 'px',
        minWidth: proxy.bodyMinWidth + 'px',
      }"
    >
      <LayoutHeader theme="dark" :hotSearchList="hotSearchList" />
    </div>
    <div
      class="category-fixed"
      v-show="navActionStore.fixedCategory && showFixedCategory"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
      @mouseover="lineCategoryMouseHandler(1)"
      @mouseout="lineCategoryMouseHandler(0)"
    >
      <div class="category-fixed-inner">
        <Category :showType="1" :mouseOver="mouseOver"></Category>
      </div>
    </div>
    <div
      class="body-container"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
    >
      <div class="category" v-show="navActionStore.showCategory">
        <Category :showType="0" />
      </div>
      <div class="body-main"><router-view></router-view></div>
      <Account />
    </div>
  </div>
</template>

<script setup>
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();
import { mitter } from "@/eventBus/eventBus";
import Account from "../account/Account.vue";
import LayoutHeader from "../layout/LayoutHeader-bar.vue";
import {
  ref,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  computed,
  watch,
} from "vue";
const { proxy } = getCurrentInstance();
import Category from "./Category.vue";
import { useNavAction } from "@/stores/navActionStore";
const navActionStore = useNavAction();
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();

const mouseOver = ref(false);
const lineCategoryMouseHandler = (type) => {
  mouseOver.value = type == 1;
};

onMounted(() => {
  window.addEventListener("scroll", windowScrollHandle);
  window.addEventListener("resize", windowResizeHandler);
});

onUnmounted(() => {
  window.removeEventListener("scroll", windowScrollHandle);
  window.removeEventListener("resize", windowResizeHandler);
});

const showFixedHeader = ref(false);
const showFixedCategory = ref(false);

const showFixedTopHandler = (curScrollTop) => {
  if (curScrollTop <= 20) {
    showFixedHeader.value = false;
  } else {
    showFixedHeader.value = true;
  }
  if (curScrollTop > 300) {
    showFixedCategory.value = true;
  } else {
    showFixedCategory.value = false;
  }
};
const windowScrollHandle = () => {
  let curScrollTop = window.scrollY;
  showFixedTopHandler(curScrollTop);
  mitter.emit("windowScroll", curScrollTop);
};

const windowResizeHandler = () => {
  mitter.emit("windowResize");
};

const backgroundImage = computed(() => {
  const background = categoryStore.currentPCategory?.background;
  return background ? proxy.Api.sourcePath + background : null;
});

const getNoReadCount = async () => {
  if (Object.keys(loginStore.userInfo).length == 0) {
    return;
  }
  let result = await proxy.Request({
    url: proxy.Api.getNoReadCount,
  });
  if (!result) {
    return;
  }
  loginStore.saveMessageNoReadCount(result.data);
};

const hotSearchList = ref([]);
const getSearchKeywordTop = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getSearchKeywordTop,
  });
  if (!result) {
    return;
  }
  hotSearchList.value = result.data;
};
getSearchKeywordTop();

watch(
  () => loginStore.userInfo,
  (newVal, oldVal) => {
    if (newVal) {
      getNoReadCount();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style>
body {
  background: #ededed !important;
}
</style>
<style lang="scss" scoped>
.main-container {
  position: relative;
  margin: 0px auto;
  background: #fff;
  min-height: calc(100vh);
  .header {
    margin: 0px auto;
    height: 180px;
    background-color: #7c9ce1;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    position: relative;
    background-image: url(../../assets/images/banner_bg.png);
  }

  .header-fixed {
    position: fixed;
    width: 100%;
    z-index: 1001;
    top: 0px;
    background: #fff;
    height: 64px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  .category-fixed {
    position: fixed;
    z-index: 1000;
    top: 64px;
    width: 100%;
    background: #fff;
    padding: 10px 150px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    .category-fixed-inner {
      margin: 0px auto;
    }
  }

  .body-container {
    padding: 0px var(--bodyPadding);
    .category {
      margin-top: 20px;
    }
  }
}
</style> 