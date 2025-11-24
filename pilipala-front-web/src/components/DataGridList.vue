<template>
  <div>
    <div v-if="dataSource.list != null && dataSource.list.length == 0">
      <NoData msg="暂无相关视频哦~"></NoData>
    </div>
    <div
      class="data-list"
      :style="{ 'grid-template-columns': `repeat(${gridCount}, 1fr)` }"
    >
      <template v-for="item in dataSource.list">
        <slot :data="item"></slot>
      </template>
    </div>
    <div class="pagination" v-if="showPagination && dataSource.pageTotal >= 1">
      <el-pagination
        v-if="dataSource.pageTotal >= 1"
        background
        :total="dataSource.totalCount"
        :current-page.sync="dataSource.pageNo"
        layout="prev, pager, next"
        @current-change="handlePageNoChange"
        :page-size="dataSource.pageSize"
        prev-text="上一页"
        next-text="下一页"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gridCount: {
    type: Number,
    default: 5,
  },
  dataSource: {
    type: Object,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>

<style lang="scss" scoped>
.data-list {
  display: grid;
  grid-gap: 20px;
}

.pagination {
  margin-top: 20px;
  padding: 10px 0px 5px 0px;
  text-align: center;
  overflow: hidden;
  height: 50px;
  display: flex;
  justify-content: center;

  ::v-deep(.el-pager li) {
    background-color: #fff;
    border-color: #fff;
    color: #303133;
  }

  ::v-deep(.el-pager li.active) {
    background-color: #00a1d6 !important;
    border-color: #00a1d6 !important;
    color: #fff !important;
  }

  ::v-deep(.el-pager li:not(.active):hover) {
    border-color: #00a1d6;
  }
}
</style>