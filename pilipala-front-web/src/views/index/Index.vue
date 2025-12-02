<template>
  <div>
    <div class="command-panel">
      <div class="carousel">
        <div
          class="carousel-panel"
          :style="{
            width: carouselWidth + 'px',
            height: carouselWidth * 0.493 + 'px',
          }"
        >
          <el-carousel
            :height="carouselWidth * 0.6 + 'px'"
            indicator-position="none"
            arrow="never"
            @change="carouselChange"
            ref="carouselRef"
          >
            <el-carousel-item
              v-for="(item, index) in carouselVideoList"
              :key="item"
              :name="index + ''"
            >
              <div class="roll-image">
                <router-link :to="`/video/${item.videoId}`" target="_blank">
                  <img
                    :src="`${proxy.Api.sourcePath}${item.videoCover}`"
                    alt=""
                  />
                </router-link>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div
          class="carousel-botton"
          :style="{
            background: `linear-gradient(to top, ${maskColor} 65%, transparent 100%)`,
            width: carouselWidth + 'px',
          }"
        >
          <div class="bottom-content" v-if="carouselVideoList.length > 0">
            <div class="name-op">
              <router-link
                class="video-name"
                :to="`/video/${carouselVideoList[carouselIndex].videoId}`"
                target="_blank"
              >
                {{ carouselVideoList[carouselIndex].videoName }}
              </router-link>

              <div class="change-btn">
                <span class="iconfont icon-right" @click="preCarousel"></span>
                <span class="iconfont icon-left" @click="nextCarousel"></span>
              </div>
            </div>

            <div class="dtos">
              <div
                v-for="item in carouselVideoList.length"
                :key="item"
                :class="['dto-item', carouselIndex == item - 1 ? 'active' : '']"
                @click="setCarousel(item)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="video-list">
        <div v-for="item in commendVideoList" :key="item">
          <VideoItem :data="item"></VideoItem>
        </div>
      </div>
    </div>

    <VideoList style="margin-top: 100px"></VideoList>
  </div>
</template>

<script setup>
import { useNavAction } from "@/stores/navActionStore";
const navActionStore = useNavAction();
import ColorThief from "colorthief";
import VideoList from "@/views/videoList/VideoList.vue";
import { mitter } from "@/eventBus/eventBus.js";
import { ref, getCurrentInstance, onMounted, onUnmounted } from "vue";
const { proxy } = getCurrentInstance();
import { useRouter } from "vue-router";
const router = useRouter();
import VideoItem from "../../components/VideoItem.vue";

const carouselWidth = ref();
const carouselVideoList = ref([]);
const commendVideoList = ref([]);
const loadRecommendVideo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.loadRecommendVideo,
  });
  if (!result) {
    return;
  }

  const allCommendVideoList = result.data;
  if (allCommendVideoList.length > proxy.carouselMaxCount) {
    carouselVideoList.value = allCommendVideoList.slice(
      0,
      proxy.carouselMaxCount
    );
    commendVideoList.value = allCommendVideoList.slice(
      proxy.carouselMaxCount,
      proxy.carouselMaxCount + 6
    );
  } else {
    carouselVideoList.value = allCommendVideoList;
  }
};

const resetCarouselWidth = () => {
  let width =
    (document.documentElement.clientWidth - proxy.bodyPadding * 2) * 0.42;
  if (width < 400) {
    width = 400;
  }
  carouselWidth.value = width;
};

const carouselIndex = ref(0);
const carouselChange = (e) => {
  carouselIndex.value = e;
  const current = carouselVideoList.value[e];
  if (current) {
    extractMainColor(`${proxy.Api.sourcePath}${current.videoCover}`);
  }
};

const carouselRef = ref();
const preCarousel = () => {
  carouselRef.value.prev();
};
const nextCarousel = () => {
  carouselRef.value.next();
};

const setCarousel = (index) => {
  carouselRef.value.setActiveItem(index - 1 + "");
};

const maskColor = ref("rgb(53, 75, 98)");
const extractMainColor = async (imageUrl) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const colorThief = new ColorThief();
  const color = colorThief.getColor(img);
  maskColor.value = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

onMounted(async () => {
  navActionStore.setFixedHeader(false);
  navActionStore.setFixedCategory(false);
  navActionStore.setShowHeader(true);
  navActionStore.setShowCategory(true);
  navActionStore.setForceFixedHeader(false);
  mitter.on("windowResize", () => resetCarouselWidth());
  await loadRecommendVideo();
  resetCarouselWidth();
  if (carouselVideoList.value.length > 0) {
    extractMainColor(
      `${proxy.Api.sourcePath}${carouselVideoList.value[0].videoCover}`
    );
  }
});

onUnmounted(() => {
  mitter.off("windowResize");
});

router.afterEach((to) => {
  if (to.path === "/") {
    navActionStore.setShowHeader(true);
    navActionStore.setShowCategory(true);
  }
});
</script>

<style lang="scss" scoped>
.command-panel {
  display: flex;
  margin-top: 20px;

  .carousel-panel {
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

    .roll-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .roll-image:hover img {
      transform: scale(1.03);
    }
  }

  .carousel-botton {
    border-radius: 0 0 10px 10px;
    margin-top: -60px;
    height: 150px;
    position: relative;
    padding: 15px 20px;
    box-sizing: border-box;
    z-index: 2;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .bottom-content {
      top: -10px;
      position: relative;
      z-index: 3;

      .name-op {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .video-name {
          flex: 1;
          color: #fff;
          text-decoration: none;
          font-size: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .change-btn {
          width: 60px;
          display: flex;
          justify-content: space-between;

          .iconfont {
            cursor: pointer;
            color: #fff;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.15);
            padding: 5px 8px;
            border-radius: 5px;
            transition: 0.3s;
            margin-left: -20px;
          }
          .iconfont:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }

      .dtos {
        display: flex;
        .dto-item {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          margin-right: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .active {
          background: #fff;
          transform: scale(1.5);
        }
      }
    }
  }

  .video-list {
    margin-left: 20px;
    flex: 1;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>