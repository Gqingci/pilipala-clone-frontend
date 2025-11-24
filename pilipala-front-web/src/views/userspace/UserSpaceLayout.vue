<template>
  <div>
    <div
      class="main-container"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
    >
      <LayoutHeader theme="dark"></LayoutHeader>
    </div>
    <div
      class="user-space-body-container"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
    >
      <div class="user-space-body">
        <div class="user-info-panel">
          <div class="avatar">
            <Avatar
              :width="60"
              :avatar="userInfo.avatar"
              @click="updateUserInfo"
            ></Avatar>
          </div>
          <div class="user-info">
            <div class="user-name">
              {{ userInfo.username }}
              <div
                :class="[
                  'iconfont',
                  userInfo.gender == 0 ? 'icon-sexw' : 'icon-sexm',
                ]"
                v-if="userInfo.gender == 0 || userInfo.gender == 1"
              ></div>
            </div>
            <div class="introduction">{{ userInfo.biography }}</div>
          </div>
          <div class="focus-panel" v-if="!myself">
            <div
              class="btn-focus btn-cancel-focus"
              @click="cancelFocusUser(currentUserId)"
              v-if="userInfo.haveFocus"
            >
              已关注
            </div>
            <div class="btn-focus" @click="focusUser(currentUserId)" v-else>
              关注
            </div>
          </div>
        </div>
        <div class="home-nav">
          <div class="nav-panel">
            <router-link
              :class="[
                'nav-item iconfont',
                item.icon,
                item.pathNames.includes(route.name) ? 'active' : '',
              ]"
              v-for="item in navList"
              :key="item"
              :to="item.path"
              >{{ item.name }}</router-link
            >
          </div>
          <div class="search">
            <el-input
              v-model="videoName"
              placeholder="搜索视频"
              style="width: 200px"
              @keyup.enter="searchVideo"
            >
              <template #suffix
                ><span
                  class="iconfont icon-search"
                  style="cursor: pointer"
                  @click="searchVideo"
                ></span
              ></template>
            </el-input>
          </div>
          <div class="count-info">
            <router-link
              v-if="myself"
              class="count-item"
              :to="`/user/${currentUserId}/focus`"
              ><div class="title-info">关注数</div>
              <div class="count-value">
                {{ userInfo.focusCount }}
              </div></router-link
            >
            <div class="count-item" v-else>
              <div class="title-info">关注数</div>
              <div class="count-value">
                {{ userInfo.focusCount }}
              </div>
            </div>
            <router-link
              v-if="myself"
              class="count-item"
              :to="`/user/${currentUserId}/fans`"
              ><div class="title-info">粉丝数</div>
              <div class="count-value">
                {{ userInfo.fansCount }}
              </div></router-link
            >
            <div class="count-item" v-else>
              <div class="title-info">粉丝数</div>
              <div class="count-value">
                {{ userInfo.fansCount }}
              </div>
            </div>
            <div class="count-item">
              <div class="title-info">获赞数</div>
              <div class="count-value">{{ userInfo.likeCount }}</div>
            </div>
            <div class="count-item">
              <div class="title-info">播放数</div>
              <div class="count-value">{{ userInfo.playCount }}</div>
            </div>
          </div>
        </div>
        <div class="user-space-content">
          <router-view @editUserInfo="updateUserInfo"></router-view>
        </div>
      </div>
    </div>
    <UserInfoEdit ref="userInfoEditRef" @reload="loadUserInfo"></UserInfoEdit>
  </div>
</template>

<script setup>
import UserInfoEdit from "@/views/userspace/UserInfoEdit.vue";
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();
import LayoutHeader from "@/views/layout/LayoutHeader-bar.vue";
import { ref, getCurrentInstance, computed, provide } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const currentUserId = route.params.userId;
const navList = ref([
  {
    name: "主页",
    path: "/user/" + currentUserId,
    icon: "icon-home",
    pathNames: ["uspaceHome", "uspaceFans", "uspaceFocus"],
  },
  {
    name: "投稿",
    path: "/user/" + currentUserId + "/video",
    icon: "icon-play",
    pathNames: ["uspaceMyVideo"],
  },
  {
    name: "视频列表",
    path: "/user/" + currentUserId + "/series",
    icon: "icon-playlist",
    pathNames: ["uspaceSeries", "uspaceSeriesDetail"],
  },
  {
    name: "收藏",
    path: "/user/" + currentUserId + "/collection",
    icon: "icon-collection",
    pathNames: ["uspaceCollection"],
  },
]);
const userInfo = ref({});
provide("userInfo", userInfo);
const loadUserInfo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.uHomeGetUserInfo,
    params: {
      userId: currentUserId,
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};
loadUserInfo();

const myself = computed(() => {
  return loginStore.userInfo.id == currentUserId;
});

const userInfoEditRef = ref();
const updateUserInfo = () => {
  userInfoEditRef.value.show(userInfo.value);
};

const videoName = ref();
const searchVideo = () => {
  if (route.name !== "uspaceMyVideo") {
    router.push({
      name: "uspaceMyVideo",
      params: { userId: route.params.userId },
      query: { videoName: videoName.value },
    });
  } else {
    router.replace({
      query: {
        ...route.query,
        videoName: videoName.value,
      },
    });
  }
};

const focusUser = async (focusUserId, changeCountType = 0, fn) => {
  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true);
    return;
  }
  let result = await proxy.Request({
    url: proxy.Api.uHomeFocus,
    params: {
      focusUserId: focusUserId,
    },
  });
  if (!result) {
    return;
  }
  if (changeCountType == 0) {
    userInfo.value.haveFocus = true;
    userInfo.value.fansCount++;
  } else {
    userInfo.value.focusCount++;
  }
  if (fn) {
    fn();
  }
};

const cancelFocusUser = async (focusUserId, changeCountType = 0, fn) => {
  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true);
    return;
  }
  let result = await proxy.Request({
    url: proxy.Api.uHomeCancelFocus,
    params: {
      focusUserId: focusUserId,
    },
  });
  if (!result) {
    return;
  }
  if (changeCountType == 0) {
    userInfo.value.haveFocus = false;
    userInfo.value.fansCount--;
  } else {
    userInfo.value.focusCount--;
  }
  if (fn) {
    fn();
  }
};

provide("focusUser", (focusUserId, fn) => {
  focusUser(focusUserId, 1, fn);
});

provide("cancelFocusUser", (focusUserId, fn) => {
  cancelFocusUser(focusUserId, 1, fn);
});
</script>

<style>
body {
  background: #f4f5f7 !important;
}
</style>
<style lang="scss" scoped>
.main-container {
  position: relative;
  margin: 0px auto;
  background: #fff;
}

.header-fixed {
  background: #fff;
  height: 64px;
  margin: 0px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.user-space-body-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0px auto;
  .user-space-body {
    background-image: url("../../assets/images/userSpace_background.png");
    background-repeat: no-repeat;
    margin: 0px auto;
    position: relative;
    min-height: calc(100vh - 64px);
    width: 1200px;
    .header {
      height: 250px;
      overflow: hidden;
    }
    .user-info-panel {
      position: relative;
      border-radius: 0px 0px 5px 5px;
      display: flex;
      align-items: center;
      background: transparent;
      height: 200px;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.5) 0%,
          rgba(0, 0, 0, 0) 40%
        );
        z-index: 1;
        pointer-events: none;
      }
      > * {
        position: relative;
        z-index: 2;
      }
      .avatar {
        position: absolute;
        left: 20px;
        top: 120px;
      }
      .user-info {
        display: flex;
        align-items: center;
        flex-direction: column;
        align-items: flex-start;
        position: absolute;
        flex: 1;
        color: var(--text);
        left: 100px;
        top: 130px;
        .user-name {
          color: #fff;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;
          .iconfont {
            font-weight: normal;
            margin-left: 10px;
            color: var(--text3);
            cursor: pointer;
          }
          .icon-sexw {
            font-size: 20px;
            color: #f25d8e;
          }
          .icon-sexm {
            font-size: 20px;
            color: #5fd4f2;
          }
        }
        .introduction {
          color: #e3e5e7;
          margin-top: 5px;
          min-height: 20px;
        }
      }
      .focus-panel {
        position: absolute;
        top: 130px;
        right: 40px;
        .btn-focus {
          background: #f25d8e;
          color: #fff;
          padding: 8px 25px;
          border-radius: 5px;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
        .btn-cancel-focus {
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          border: 1px solid #e3e5e7;
        }
      }
    }
    .home-nav {
      top: 0px;
      position: sticky;
      background: #fff;
      border: solid #e3e5e7 1px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      display: flex;
      align-items: center;
      padding: 0px 20px;
      z-index: 1000;
      .nav-panel {
        display: flex;
        align-items: center;
        .nav-item {
          text-decoration: none;
          margin-right: 35px;
          position: relative;
          display: flex;
          align-items: center;
          color: var(--text2);
          line-height: 65px;
          font-size: 14px;
          &::before {
            margin-right: 5px;
            font-size: 20px;
          }
          &:hover {
            color: var(--blue);
            &::after {
              content: "";
              border: 2px solid var(--blue);
              position: absolute;
              bottom: 0px;
              left: 0px;
              width: 100%;
            }
          }
        }
        .active {
          color: var(--blue);
          &::after {
            content: "";
            border: 2px solid var(--blue);
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
          }
        }
      }
      .search {
        margin-left: 20px;
        flex: 1;
        :deep(.el-input__wrapper) {
          border-radius: 30px !important;
        }
      }
      .count-info {
        display: flex;
        text-align: center;
        font-size: 13px;
        .count-item {
          padding: 0px 10px;
          text-decoration: none;
          color: var(--text3);
          .title-info {
            color: var(--text3);
          }
          .count-value {
            margin-top: 5px;
          }
        }
        a.count-item {
          cursor: pointer;
          &:hover {
            .title-info,
            .count-value {
              color: #00a1d6 !important;
            }
          }
        }
      }
    }
    .user-space-content {
      margin-top: 10px;
    }
  }
}

.change-theme-btn {
  position: absolute;
  top: 64px;
  right: 0px;
  width: 58px;
  height: 49px;
  background-image: url("../../assets/theme-trigger.png");
  background-position: 0px 0px;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    background-position: -522px 0px;
  }
}
</style>