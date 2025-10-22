<template>
  <div class="category-video-body">
    <div
      :class="['category-list', categoryFixed ? 'category-fixed' : '']"
      id="category-list"
    >
      <div class="category-title">
        {{ categoryStore.currentPCategory.categoryName }}
      </div>
      <div
        :class="['category-item', !route.params.categoryCode ? 'active' : '']"
        @click="jump()"
      >
        首页
      </div>
      <div
        :class="[
          'category-item',
          route.params.categoryCode == item.categoryCode ? 'active' : '',
        ]"
        :key="item"
        v-for="item in categoryStore.currentPCategory.children"
        @click="jump(item)"
      >
        {{ item.categoryName }}
      </div>
    </div>
    <VideoList></VideoList>
  </div>
</template>

<script setup>
import { mitter } from "@/eventBus/eventBus";
import VideoList from "./VideoList.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();
import { useNavAction } from "@/stores/navActionStore";
const navActionStore = useNavAction();

const jump = (item = { categoryCode: "" }) => {
  if (!item.categoryCode) {
    router.push({
      name: "categoryVideo",
    });
    return;
  }
  router.push({
    name: "subCategoryVideo",
    params: {
      categoryCode: item.categoryCode,
    },
  });
};

const categoryFixed = ref(false);
const categoryTopDistance = ref(170);

let initScrollTop = 0;
let scrollDown = true;

const scrollHandler = (curScrollTop) => {
  categoryFixed.value = true;
  if (curScrollTop - initScrollTop > 0) {
    scrollDown = true;
  } else {
    scrollDown = false;
  }
  initScrollTop = curScrollTop;
  if (curScrollTop >= categoryTopDistance.value) {
    if (scrollDown) {
      navActionStore.setFixedHeader(false);
    } else {
      navActionStore.setFixedHeader(true);
    }
  } else {
    categoryFixed.value = false;
    navActionStore.setFixedHeader(false);
  }
  console.log(navActionStore.FixedHeader);
};

onMounted(() => {
  categoryTopDistance.value = document
    .querySelector("#category-list")
    .getBoundingClientRect().top;

  navActionStore.setFixedHeader(false);
  navActionStore.setFixedCategory(false);
  navActionStore.setShowHeader(true);
  navActionStore.setShowCategory(true);
  navActionStore.setForceFixedHeader(false);
  mitter.on("windowScroll", (curScrollTop) => {
    scrollHandler(curScrollTop);
  });
});

onUnmounted(() => {
  mitter.off("windowScroll");
});
</script>

<style lang="scss" scoped>
.category-video-body {
  margin-top: 30px;
  .category-list {
    display: flex;
    align-items: center;
    line-height: 30px;
    position: sticky;
    top: 0px;
    height: 60px;
    background: #fff;
    z-index: 2;
    .category-title {
      font-size: 24px;
      margin-right: 40px;
      cursor: pointer;
    }
    .category-item {
      margin-right: 40px;
      font-size: 15px;
      cursor: pointer;
      border-bottom: 3px solid #fff;
      &:hover {
        color: var(--blue);
        border-color: var(--blue);
      }
      &.active {
        color: var(--blue);
        border-color: var(--blue);
      }
    }
    &.category-fixed {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>