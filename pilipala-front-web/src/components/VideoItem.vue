<template>
  <div>
    <div
      :class="['video-item', layoutType === 1 ? 'video-item2' : '']"
      :style="{ 'margin-top': layoutType === 1 ? '20px' : '0px' }"
    >
      <router-link :to="`/video/${data.videoId}`" target="_blank">
        <div class="cover">
          <Cover :source="data.videoCover"></Cover>
          <div class="shade">
            <div class="play-count" v-show="layoutType === 0">
              <div class="iconfont icon-bofangliang">
                <span style="margin-left: 3px">{{ data.playCount }}</span>
              </div>
              <div class="iconfont icon-danmu">
                <span style="margin-left: 3px">{{ data.danmuCount }}</span>
              </div>
            </div>
            <div class="play-time">{{ data.playTiem }}</div>
          </div>
        </div>
      </router-link>
      <div class="video-info">
        <router-link
          class="title"
          :to="`/video/${data.videoId}`"
          v-html="data.videoName"
          target="_blank"
        ></router-link>
        <router-link class="user-name" :to="`/user/${data.userId}`"
          ><span class="iconfont icon-upzhu"> {{ data.username }}</span
          ><span v-if="layoutType === 0">
            · {{ proxy.Utils.formatDate(data.createTime) }}</span
          ></router-link
        >
        <div class="play-count" v-show="layoutType === 1">
          <div class="iconfont icon-bofangliang">
            {{ data.playCount }}
          </div>
          <div class="iconfont icon-danmu">{{ data.danmuCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
import Cover from "./Cover.vue";

const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
  //0:上下布局 1:左右布局
  layoutType: {
    type: Number,
    default: 0,
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
    .image-style {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 5px;
    }
    .shade {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      padding: 8px 8px 6px;
      width: 100%;
      height: 38px;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
      background-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.8) 100%
      );
      color: #fff;
      opacity: 1;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .play-count {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 16px;
        .iconfont {
          display: inline-flex;
          align-items: center;
          line-height: 1;
          font-size: 13px;
          &::before {
            font-size: 16px;
            margin-right: 2px;
          }
        }
        .icon-danmu {
          display: inline-flex;
          align-items: center;
          line-height: 1;
          margin-left: 15px;
        }
      }
    }
  }
  .video-info {
    cursor: pointer;
    .title {
      height: 40px;
      color: var(--text2);
      font-size: 14px;
      margin-top: 10px;
      display: -webkit-box;
      overflow: hidden;
      text-decoration: none;
      -webkit-box-orient: vertical;
      text-overflow: -o-ellipsis-lastline;
      text-overflow: ellipsis;
      word-break: break-word !important;
      word-break: break-all;
      line-break: anywhere;
      -webkit-line-clamp: 2;
      cursor: pointer;
      &:hover {
        color: var(--blue);
      }
      :deep(.highlight) {
        color: red !important;
      }
    }
    .user-name {
      margin-top: 5px;
      color: #9499a0;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        color: var(--blue);
      }
      .iconfont {
        &::before {
          font-size: 18px;
          margin-right: 3px;
          float: left;
        }
        font-size: 13px;
      }
    }
  }
}

.video-item2 {
  display: flex;
  .cover {
    width: 190px;
    .shade {
      justify-content: end;
    }
  }
  .video-info {
    flex: 1;
    margin-left: 15px;
    .title {
      margin-top: 0px;
    }
    .play-count {
      display: flex;
      width: 100%;
      margin-top: 5px;
      color: #9499a0;
      .iconfont {
        font-size: 14px;
        &::before {
          font-size: 16px;
          margin-right: 2px;
        }
      }
      .icon-danmu {
        margin-left: 15px;
      }
    }
  }
}
</style>
