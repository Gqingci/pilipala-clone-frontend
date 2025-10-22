<template>
  <div>
    <template v-for="item in dataList" :key="item"
      ><VideoItem :data="item" :layoutType="1" :margin-top="20"></VideoItem
    ></template>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from "vue";
const { proxy } = getCurrentInstance();

const videoInfo = inject("videoInfo");
const dataList = ref([]);
const loadDataList = async () => {
  let result = await proxy.Request({
    url: proxy.Api.loadRecommendVideo,
    // url: proxy.Api.getVideoRecommend,
    params: {
      // keysword: videoInfo.value.videoName,
      // videoId: videoInfo.value.videoId,
    },
  });
  if (!result) {
    return;
  }
  dataList.value = result.data;
};
loadDataList();
</script>

<style lang="scss" scoped>
</style>