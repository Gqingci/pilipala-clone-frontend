<template>
  <div>
    <div class="video-item">
      <router-link :to="`/video/${data.videoId}`" target="_blank">
        <div class="cover">
          <Cover :source="data.videoCover"></Cover>
        </div>
      </router-link>
      <div class="video-info">
        <router-link
          class="title"
          :to="`/video/${data.videoId}`"
          v-html="data.videoName"
          target="_blank"
        ></router-link>
        <div class="play-count">
          <div class="iconfont icon-bofangliang">
            {{ data.playCount }}
          </div>
          <div class="create-time">
            {{ proxy.Utils.formatDate(data.createTime) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});
</script>

<style lang="scss" scoped>
.video-item {
  width: 100%;
  overflow: hidden;
  .cover {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .video-info {
    cursor: pointer;
    .title {
      height: 35px;
      color: var(--text2);
      font-size: 13px;
      margin-top: 10px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      text-overflow: -o-ellipsis-lastline;
      text-overflow: ellipsis;
      word-break: break-word !important;
      word-break: break-all;
      line-break: anywhere;
      -webkit-line-clamp: 2;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        color: var(--blue);
      }
    }
    .play-count {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      color: var(--text3);
      font-size: 12px;
      .icon-bofangliang {
        font-size: 13px;
        &:before {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>