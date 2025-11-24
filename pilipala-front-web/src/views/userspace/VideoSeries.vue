<template>
  <div class="video-list-panel">
    <div class="video-title">视频列表</div>
    <VueDraggable
      class="video-list"
      v-model="videoSeriesList"
      @update="changeSort"
      handle=".move-handler"
      draggable=".list-item"
    >
      <template v-for="(item, index) in videoSeriesList" :key="item.seriesId">
        <div
          class="video-item-add"
          @click="showVideoSeries"
          v-if="item.seriesId == 'add'"
        >
          <div class="iconfont icon-add"></div>
          <div class="add-info">新建视频列表</div>
        </div>
        <div class="list-item" v-else>
          <div class="cover">
            <div class="move-handler iconfont icon-move" v-if="myself"></div>
            <Cover :source="item.cover" @click="jump(item)"></Cover>
          </div>
          <div class="list-name">{{ item.seriesName }}</div>
          <div class="create-time">
            {{ proxy.Utils.formatDate(item.updateTime) }}
          </div>
        </div>
      </template>
    </VueDraggable>
    <div class="no-data" v-if="videoSeriesList.length == 0">
      <div v-if="myself">
        你可以将自己上传的视频整理成“视频列表” 方便别人查看，快去创建视频列表吧~
      </div>
      <div v-else>该用户暂未上传视频列表哦~</div>
      <img src="@/assets/images/empty-channel.png" />
      <el-button class="no-data-btn" @click="showVideoSeries" v-if="myself"
        >新建视频列表</el-button
      >
    </div>
    <VideoSeriesEdit
      ref="videoSeriesEditRef"
      @reload="loadVideoSeries"
    ></VideoSeriesEdit>
  </div>
</template>

<script setup>
import VideoSeriesEdit from "./VideoSeriesEdit.vue";
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();
import { VueDraggable } from "vue-draggable-plus";
import { ref, getCurrentInstance, computed } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const myself = computed(() => {
  return loginStore.userInfo.id == route.params.userId;
});

const videoSeriesList = ref([]);
const loadVideoSeries = async () => {
  let result = await proxy.Request({
    url: proxy.Api.uHomeSeriesLoadVideoSeries,
    params: {
      userId: route.params.userId,
    },
  });
  if (!result) {
    return;
  }
  videoSeriesList.value = result.data;
  if (myself.value) {
    videoSeriesList.value.unshift({ seriesId: "add" });
  }
};
loadVideoSeries();

const changeSort = async () => {
  let seriesIds = videoSeriesList.value.map((item) => {
    return item.seriesId;
  });
  seriesIds.splice(0, 1);
  let result = await proxy.Request({
    url: proxy.Api.uHomeSeriesChangeVideoSeriesSort,
    params: {
      seriesIds: seriesIds.join(","),
    },
  });
  if (!result) {
    return;
  }
};

const jump = (item) => {
  router.push(`/user/${route.params.userId}/series/${item.seriesId}`);
};

const videoSeriesEditRef = ref();
const showVideoSeries = () => {
  videoSeriesEditRef.value.show();
};
</script>

<style lang="scss" scoped>
.video-list-panel {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  .video-title {
    font-size: 18px;
  }
  .video-list {
    margin-top: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    .video-item-add {
      border-radius: 5px;
      width: 100%;
      height: 150px;
      border: 2px dashed #ddd;
      text-align: center;
      color: var(--text3);
      cursor: pointer;
      .icon-add {
        font-size: 40px;
        padding-top: 40px;
      }
    }
    .list-item {
      .cover {
        position: relative;
        .move-handler {
          width: 100%;
          height: 30px;
          cursor: move;
          position: absolute;
          left: 0px;
          top: 0px;
          background: #fff;
          z-index: 100;
          border-radius: 5px 5px 0px 0px;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          display: none;
        }
        &:hover {
          .move-handler {
            display: flex;
          }
        }
      }
      .list-name {
        margin-top: 5px;
      }
      .create-time {
        margin-top: 5px;
        color: var(--text3);
      }
    }
  }
  .no-data {
    color: #6d757a;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    margin: 20px;

    .no-data-btn {
      width: 150px;
      height: 40px;
      margin-top: 10px;
      background-color: #00a1d6 !important;
      color: #fff !important;
      border: none !important;
    }
  }
}
</style>