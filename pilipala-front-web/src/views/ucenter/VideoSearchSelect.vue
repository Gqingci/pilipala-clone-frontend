<template>
  <div class="search-panel">
    <el-select
      clearable
      placeholder="选择视频搜索"
      v-model="searchForm.videoId"
      @change="loadData"
      ><el-option
        :value="item.videoId"
        :label="item.videoName"
        v-for="item in allVideoList"
        :key="item"
      ></el-option
    ></el-select>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const searchForm = ref({});
const allVideoList = ref([]);
const loadAllVideo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.ucLoadAllVideo,
  });
  if (!result) {
    return;
  }
  allVideoList.value = result.data;
};
loadAllVideo();

const emit = defineEmits(["loadData"]);
const loadData = (e) => {
  emit("loadData", e);
};
</script>

<style lang="scss" scoped>
.search-panel {
  width: 200px;
  height: 40px;
  float: right;
}
</style>
