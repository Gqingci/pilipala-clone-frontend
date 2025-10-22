<template>
  <div class="data-list">
    <DataLoadMoreList
      :dataSource="dataSource"
      @loadData="loadDataList"
      :loading="loadingData"
      ><template #default="{ data }">
        <VideoItem :data="data"></VideoItem></template
    ></DataLoadMoreList>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router";
const route = useRoute();
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();

const dataSource = ref({});
const loadingData = ref(false);

const loadDataList = async () => {
  let params = {
    pageNo: dataSource.value.pageNo,
  };
  Object.assign(params, categoryIdInfo.value);
  let result = await proxy.Request({
    url: proxy.Api.loadVideo,
    params,
  });
  loadingData.value = false;
  if (!result) {
    return;
  }
  const dataList = dataSource.value.list;
  dataSource.value = Object.assign({}, result.data);
  if (result.data.pageNo > 1) {
    dataSource.value.list = dataList.concat(result.data.list);
  }
};

const categoryMap = categoryStore.categoryMap;
const categoryIdInfo = ref({});
const convertCode2Id = (pCategoryCode, categoryCode) => {
  let pCategoryId = "";
  let categoryId = "";
  if (pCategoryCode) {
    pCategoryId = categoryMap[pCategoryCode]
      ? categoryMap[pCategoryCode].categoryId
      : "";
  }
  if (categoryCode) {
    categoryId = categoryMap[categoryCode]
      ? categoryMap[categoryCode].categoryId
      : "";
  }
  categoryIdInfo.value = {
    pCategoryId,
    categoryId,
  };
};

const initData = () => {
  convertCode2Id(route.params.pCategoryCode, route.params.categoryCode);
  loadDataList();
};
const categoryInit = ref(false);
watch(
  () => route.params,
  (newVal, oldVal) => {
    if (newVal) {
      if (!categoryInit.value) {
        return;
      }
      categoryStore.setCurrentPCategory(route.params.pCategoryCode);
      initData();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => categoryStore.categoryMap,
  (newVal, oldVal) => {
    if (!newVal || Object.keys(newVal).length == 0) {
      return;
    }
    categoryInit.value = true;
    categoryStore.setCurrentPCategory(route.params.pCategoryCode);
    initData();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
</style>