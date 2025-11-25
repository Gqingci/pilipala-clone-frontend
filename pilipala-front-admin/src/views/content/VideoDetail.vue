<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="70%"
      :showCancel="false"
      @close="closeWin"
      style="top: -150px"
    >
      <div class="video-detail">
        <div class="video-info">
          <el-tabs v-model="activeName">
            <el-tab-pane label="视频分P" name="video">
              <div class="video-tips">红色标题代表视频有更新哦~</div>
              <el-scrollbar :max-height="400" class="video-list">
                <div
                  :class="['video-item', index == currentP - 1 ? 'active' : '']"
                  v-for="(item, index) in videoFileList"
                  :key="item.videoId"
                  @click="selectVideo(index + 1)"
                >
                  <div class="playing" v-if="index == currentP - 1"></div>
                  <div
                    :class="['title', item.updateType == 1 ? 'update' : '']"
                    :title="item.title"
                  >
                    P{{ index + 1 }} {{ item.fileName }}
                  </div>
                  <div class="duration">
                    {{ proxy.Utils.convertSecondsToHMS(item.duration) }}
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>

            <el-tab-pane label="基本信息" name="base">
              <el-scrollbar :max-height="400">
                <div class="video-base-info">
                  <div class="info-row">
                    <div class="info-label">标题</div>
                    <div class="info-content title-text">
                      {{ videoInfo.videoName }}
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-label">发布人</div>
                    <div
                      class="info-content user-text"
                      @click="goUserHome(videoInfo.userId)"
                    >
                      {{ videoInfo.username }}
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-label">类型</div>
                    <div class="info-content">
                      <el-tag
                        :type="videoInfo.postType == 0 ? 'success' : 'warning'"
                        size="small"
                        effect="light"
                      >
                        {{ videoInfo.postType == 0 ? "自制" : "转载" }}
                      </el-tag>
                    </div>
                  </div>

                  <div v-if="videoInfo.postType == 1" class="info-row">
                    <div class="info-label">资源说明</div>
                    <div class="info-content">{{ videoInfo.originInfo }}</div>
                  </div>

                  <div class="info-row">
                    <div class="info-label">标签</div>
                    <div class="info-content tags-container">
                      <span
                        class="tag-item"
                        v-for="(tag, index) in videoInfo.tags.split(',')"
                        :key="index"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-label">简介</div>
                    <div class="info-content desc-text">
                      {{ videoInfo.introduction || "暂无简介" }}
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="video-play">
          <Player ref="playerRef" :autoplay="false"></Player>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { mitter } from "@/eventbus/eventBus.js";
import Player from "@/components/Player.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const userWeb = import.meta.env.VITE_USER_WEB;
const route = useRoute();
const router = useRouter();

const dialogConfig = reactive({
  show: false,
  title: "详情",
});

const videoInfo = ref({});
const activeName = ref("video");

const playerRef = ref();
const videoFileList = ref([]);
const currentP = ref(1);
const loadPList = async () => {
  let result = await proxy.Request({
    url: proxy.Api.loadVideoPList,
    params: {
      videoId: videoInfo.value.videoId,
    },
  });
  if (!result) {
    return;
  }
  videoFileList.value = result.data;
  nextTick(() => {
    playerRef.value.showPlayer(window.innerHeight - 450);
    selectVideoFile();
  });
};

const selectVideo = (index) => {
  currentP.value = index;
  selectVideoFile();
};

const selectVideoFile = () => {
  mitter.emit("changeP", videoFileList.value[currentP.value - 1].fileId);
};

const show = (data) => {
  dialogConfig.show = true;
  videoInfo.value = Object.assign({}, data);
  currentP.value = 1;
  loadPList();
};

const closeWin = () => {
  dialogConfig.show = false;
  playerRef.value.destroyPlayer();
};

const goUserHome = (id) => {
  const baseUrl = import.meta.env.VITE_USER_WEB;
  window.open(`${baseUrl}/user/${id}`, "_blank");
};

defineExpose({ show });
</script>

<style lang="scss" scoped>
.video-detail {
  display: flex;
  height: 100%;

  .video-info {
    width: 400px;
    padding-right: 15px;
    border-right: 1px solid #f0f0f0;
    margin-right: 15px;

    .video-base-info {
      padding: 10px 5px;

      .info-row {
        display: flex;
        margin-bottom: 15px;
        line-height: 1.6;
        font-size: 14px;

        .info-label {
          width: 70px;
          color: #909399;
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
          color: #303133;
          word-break: break-all;

          &.title-text {
            font-weight: 600;
            font-size: 15px;
            color: #1a1a1a;
          }

          &.user-text {
            color: #409eff;
            cursor: pointer;
          }

          &.desc-text {
            color: #606266;
            white-space: pre-wrap;
            text-align: justify;
          }

          .tag-item {
            margin-right: 5px;
            display: inline-block;
            background: #f4f4f5;
            padding: 0 8px;
            border-radius: 4px;
            color: #909399;
            font-size: 12px;
            border: 1px solid #e9e9eb;
          }
        }
      }
    }

    .video-tips {
      font-size: 13px;
      color: #f56c6c;
      margin-bottom: 10px;
      background: #fef0f0;
      padding: 5px 10px;
      border-radius: 4px;
    }

    .video-list {
      .video-item {
        padding: 8px 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-bottom: 5px;
        border-radius: 4px;
        transition: all 0.3s;

        .playing {
          width: 14px;
          height: 14px;
          margin-right: 8px;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url("@/assets/images/playing.gif");
        }

        .title {
          font-size: 14px;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #606266;
        }

        .update {
          color: #f56c6c;
        }

        .duration {
          margin-left: 10px;
          font-size: 12px;
          color: #999;
        }

        &:hover {
          background: #f5f7fa;
          .title {
            color: #409eff;
          }
        }

        &.active {
          background: #ecf5ff;
          .title {
            color: #409eff;
            font-weight: 500;
          }
        }
      }
    }
  }

  .video-play {
    flex: 1;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
</style>