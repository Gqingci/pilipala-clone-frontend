<template>
  <div>
    <div
      class="data-empty"
      v-if="dataSource.list != null && dataSource.list.length == 0"
    >
      <img src="../assets/images/article_empty.png" />
      <div style="margin-top: 20px">{{ props.text }}</div>
    </div>
    <div class="data-list-panel">
      <template v-for="item in dataSource.list">
        <slot :data="item"></slot>
      </template>
    </div>
    <div class="pagination" v-if="showPagination && dataSource.pageTotal > 1">
      <el-pagination
        background
        :total="dataSource.totalCount"
        :current-page.sync="dataSource.pageNo"
        layout="prev,pager,next"
        @current-change="handlePageNoChange"
        :page-size="dataSource.pageSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: "暂无稿件",
  },
});

const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>

<style lang="scss" scoped>
.data-empty {
  margin-top: 20px;
  text-align: center;
}

.data-list-panel {
  max-height: calc(100% - 50px);
  overflow: auto;
}

.pagination {
  padding: 10px 0px 5px 0px;
  text-align: right;
  overflow: hidden;
  height: 50px;

  :deep(.el-pagination) {
    float: right;
  }
}
</style>