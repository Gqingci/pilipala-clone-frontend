<template>
  <div :class="['header-bar', 'header-bar-' + theme]">
    <ul class="menu">
      <li>
        <el-popover
          :width="categoryPartCount * (150 + 21) + 24"
          trigger="hover"
          :show-arrow="false"
          :offset="22"
          placement="bottom-start"
          ><template #reference>
            <router-link class="iconfont icon-logo" to="/">首页</router-link>
          </template>
          <div class="nav-list">
            <div
              class="nav-part"
              v-for="index in categoryPartCount"
              :key="index"
            >
              <router-link
                class="nav-item"
                :key="item"
                v-for="item in categoryStore.categoryList.slice(
                  (index - 1) * partCount,
                  index * partCount
                )"
                :to="`/v/${item.categoryCode}`"
              >
                <span class="icon" v-if="item.icon">
                  <img :src="`${proxy.Api.sourcePath}${item.icon}`" />
                </span>
                <span class="category-name">{{ item.categoryName }}</span>
              </router-link>
            </div>
          </div></el-popover
        >
      </li>
      <li><a href="" class="iconfont">会员购</a></li>
    </ul>

    <div class="search-body" v-if="showHeaderSearch">
      <div class="search-panel">
        <div class="search-panel-inner" @focusout="onFocusOut" tabindex="0">
          <div :class="['input-panel', showHistory ? 'focus-input' : '']">
            <input
              type="text"
              @focus="onSearchFocus"
              @blur="onInputBlur"
              v-model="keyword"
              ref="searchInputRef"
              @keyup.enter="search"
            />
            <div class="iconfont icon-search" @click="search"></div>
          </div>
          <div class="history-panel" v-if="showHistory">
            <div class="history-panel">
              <div class="search-title">
                <div class="title">搜索历史</div>
                <div
                  class="btn-clean"
                  @click="searchHistoryStore.cleanHistory()"
                >
                  清空
                </div>
              </div>
              <div class="search-tag-list">
                <el-tag
                  v-for="tag in searchHistoryStore.searchHistory"
                  :key="tag.name"
                  closable
                  type="info"
                  class="search-tag"
                  @click="searchKeyword(tag)"
                  @close="searchHistoryStore.delHistory(tag)"
                  v-show="searchHistoryStore.searchHistory.includes(tag)"
                  >{{ tag }}</el-tag
                >
              </div>
              <div class="hot-search-title">pilipala热搜</div>
              <div class="hot-search-list">
                <div
                  class="search-item"
                  v-for="(item, index) in hotSearchList"
                  :key="index"
                  @click="searchKeyword(item)"
                >
                  <span class="number">{{ index + 1 }} </span
                  ><span class="text">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="user-panel">
      <div class="user-avatar">
        <template v-if="Object.keys(loginStore.userInfo).length > 0">
          <Avatar
            class="avatar"
            :avatar="loginStore.userInfo.avatar"
            :id="loginStore.userInfo.id"
            :width="35"
            :lazy="false"
            @mouseover="getCountInfo"
          ></Avatar>
          <div class="user-info-panel">
            <div class="username">{{ loginStore.userInfo.username }}</div>
            <!-- <div class="coin">
              <span class="coin-text">硬币：</span
              ><span class="coin-number">1</span>
            </div> -->
            <div class="count-info">
              <div class="count-info-item">
                <div class="count-value">{{ userCountInfo.focusCount }}</div>
                <div class="count-title">关注</div>
              </div>
              <div class="count-info-item">
                <div class="count-value">{{ userCountInfo.fansCount }}</div>
                <div class="count-title">粉丝</div>
              </div>
              <div class="count-info-item">
                <div class="count-value">
                  {{ userCountInfo.currentCoinCount }}
                </div>
                <div class="count-title">硬币</div>
              </div>
            </div>
            <router-link
              :to="`/user/${loginStore.userInfo.id}`"
              class="item iconfont icon-user"
            >
              <span class="item-name">个人中心</span>
              <span class="iconfont icon-left"></span>
            </router-link>
            <router-link :to="`/ucenter/video`" class="item iconfont icon-play">
              <span class="item-name">投稿管理</span>
              <span class="iconfont icon-left"></span>
            </router-link>
            <div class="logout item iconfont icon-logout" @click="logout">
              退出登录
            </div>
          </div>
        </template>
        <template v-else>
          <el-popover
            :width="350"
            trigger="hover"
            :show-arrow="false"
            :offset="22"
            placement="bottom"
            popper-class="place-login-popover"
            ><template #reference>
              <Avatar :width="35" :lazy="false" @click="login"></Avatar>
            </template>
            <div class="user-placeLogin-panel">
              <div class="placeLogin">
                <div class="placeLogin-item">免费看高清视频</div>
                <div class="placeLogin-item">发表弹幕/评论</div>
                <div class="placeLogin-item">热门番剧影视看不停</div>
                <div class="placeLogin-item">多端同步播放记录</div>
              </div>
              <el-button class="btn" @click="login">立刻登录</el-button>
            </div>
          </el-popover>
        </template>
      </div>
      <div class="user-panel-item" @click="navJump('/message')">
        <el-badge
          :value="loginStore.messageNoReadCount"
          :hidden="loginStore.messageNoReadCount == 0"
          class="badge"
        ></el-badge>
        <div class="iconfont icon-message"></div>
        <div>消息</div>
      </div>
      <div
        class="user-panel-item"
        @click="navJump(`/user/${loginStore.userInfo.id}/collection`)"
      >
        <div class="iconfont icon-collection"></div>
        <div>收藏</div>
      </div>
      <div class="user-panel-item" @click="navJump('/history')">
        <div class="iconfont icon-history"></div>
        <div>历史</div>
      </div>
      <div class="user-panel-item" @click="navJump('/ucenter/home')">
        <div class="iconfont icon-light"></div>
        <div>创作中心</div>
      </div>
      <div class="btn-upload" @click="navJump('/ucenter/postVideo')">
        <el-button type="primary" size="large">
          <span class="iconfont icon-upload"></span>
          <span>投稿</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();
import { useSearchHistoryStore } from "@/stores/searchHistoryStore";
const searchHistoryStore = useSearchHistoryStore();

const props = defineProps({
  theme: {
    type: String,
    default: "light", //light 白色 dark 黑色
  },
  hotSearchList: {
    type: Array,
    default: [],
  },
});

const login = () => {
  loginStore.setLogin(true);
};

const userCountInfo = ref({});
const getCountInfo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getUserCountInfo,
  });
  if (!result) {
    return;
  }
  userCountInfo.value = result.data;
};

const showHeaderSearch = computed(() => route.path !== "/search");

const logout = async () => {
  let result = await proxy.Request({
    url: proxy.Api.logout,
  });
  if (!result) {
    return;
  }
  loginStore.saveUserInfo({});
};

const partCount = 10;
const categoryPartCount = computed(() => {
  return Math.ceil(categoryStore.categoryList.length / partCount);
});

const navJump = (url) => {
  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true);
    return;
  }
  window.open(url, "blank");
};

const keyword = ref();
const searchInputRef = ref();
const showHistory = ref(false);
const historyPanel = ref(null);
const onSearchFocus = () => {
  showHistory.value = true;
};

const search = () => {
  if (!keyword) {
    return;
  }
  showHistory.value = false;
  searchInputRef.value?.blur();
  router.push({
    path: "/search",
    query: {
      keyword: keyword.value,
    },
  });
};

const searchKeyword = (keyword) => {
  showHistory.value = false;
  searchInputRef.value?.blur();
  router.push({
    path: "/search",
    query: {
      keyword,
    },
  });
};

const onInputBlur = (e) => {
  setTimeout(() => {
    const activeEl = document.activeElement;
    if (historyPanel.value && !historyPanel.value.contains(activeEl)) {
      showHistory.value = false;
    }
  }, 100);
};

const onScroll = () => {
  showHistory.value = false;
  searchInputRef.value.blur();
};

const onFocusOut = (e) => {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    showHistory.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style>
.place-login-popover .placeLogin {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.place-login-popover .placeLogin-item {
  padding: 5px 10px;
  border-radius: 5px;
  text-align: left;
  font-size: 14px;
}

.place-login-popover .btn {
  width: 100%;
  background-color: #00a1d6 !important;
  color: #fff !important;
  border: none !important;
}
</style>

<style lang="scss" scoped>
.header-bar {
  width: 100%;
  height: 64px;
  padding: 0px 25px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  .menu {
    display: flex;
    margin-top: 15px;
    list-style-type: none;
    .icon-logo {
      font-size: 16px;
      &::before {
        float: left;
        font-size: 25px;
        margin-right: 5px;
      }
    }
    a {
      text-decoration: none;
    }
    li {
      margin-right: 30px;
    }
  }
  .search-body {
    color: #61666d;
    .search-panel {
      margin: 0px auto;
      position: relative;
      max-width: 40%;
      .search-panel-inner {
        width: 100%;
        position: absolute;
        top: 10px;
        left: 0px;
        border: 1px solid #e3e5e7;
        border-radius: 8px;
        overflow: hidden;
        z-index: 1001;
        .input-panel {
          display: flex;
          align-items: center;
          background: #f1f2f3;
          input {
            width: 100%;
            border: none;
            background: #f1f2f3;
            border-radius: 5px;
            padding: 8px 10px;
            margin: 5px;
            &:focus {
              outline: none;
              background: #e3e5e7;
              border-radius: 7px;
            }
          }
          .iconfont {
            font-size: 20px;
            margin-right: 10px;
            color: #2f3238;
            width: 35px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
              background: #dddd;
            }
          }
        }
        .focus-input {
          background: #fff;
        }

        .history-panel {
          background: #fff;
          padding: 10px;
          text-align: left;

          .search-title {
            display: flex;
            justify-content: space-between;

            .title {
              color: #000 !important;
              font-size: 16px;
            }

            .btn-clean {
              cursor: pointer;
              font-size: 13px;
              color: #9499a0;

              &:hover {
                color: #40c5f1;
              }
            }
          }

          .search-tag-list {
            margin-top: 10px;

            .el-tag {
              cursor: pointer;
              margin-right: 5px;
              margin-top: 5px;
              transition: none !important;
              color: #000;
              &:hover {
                color: #008ac5;
              }

              :deep(.el-tag__content) {
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 200px;
                overflow: hidden;
              }
            }
          }

          .hot-search-title {
            color: #000 !important;
            margin-top: 10px;
            font-size: 16px;
          }

          .hot-search-list {
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .search-item {
              width: 50%;
              padding: 8px 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #000;

              &:hover {
                background: #d6d9dd;
                cursor: pointer;
              }

              .number {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }

  .user-panel {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    margin-top: 15px;
    .user-avatar {
      position: relative;
      margin-right: 13px;
      width: 35px;
      height: 35px;
      cursor: pointer;
      .avatar {
        transition: transform 0.3s ease;
        position: absolute;
        z-index: 10001;
        left: 0px;
        top: 0px;
      }
      .user-info-panel {
        display: none;
        padding: 10px 20px 10px;
        background: #fff;
        width: 300px;
        position: absolute;
        top: 60px;
        left: -150px;
        border-radius: 5px;
        box-shadow: 0px 0px 12px reba(0, 0, 0, 0.12);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;

        .username {
          font-size: 16px;
          text-align: center;
          line-height: 40px;
          color: var(--text3);
        }

        .coin {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 15px;

          .coin-text {
            color: var(--text3);
            display: inline-block;
            margin-right: 5px;
          }
          .coin-number {
            color: #000;
          }
        }

        .count-info {
          margin: 10px 0px;
          display: flex;
          justify-content: space-around;

          .count-info-item {
            text-align: center;

            .count-title {
              color: var(--text3);
              margin-top: 5px;
            }

            .count-value {
              text-align: center;
              color: var(--text);
            }
          }
        }
        .item {
          font-size: 14px;
          display: block;
          text-align: left;
          line-height: 40px;
          color: var(--text3);
          padding: 0px 20px;
          text-decoration: none;
          display: flex;
          justify-content: space-between;

          .item-name {
            flex: 1;
          }

          &::before {
            margin-right: 15px;
          }

          &:hover {
            background: #e8e8e8;
            border-radius: 5px;
          }
        }

        .logout {
          display: block;
          margin-top: 10px;
          border-top: 1px solid #ddd;
          cursor: pointer;
        }
      }

      &:hover {
        overflow: visible;
        .avatar {
          transform: scale(2) translateY(10px) translateX(-10px);
        }
        .user-info-panel {
          display: inline-block;
          opacity: 1;
        }
      }
    }

    .user-panel-item {
      text-align: center;
      cursor: pointer;
      padding: 0px 13px;
      position: relative;
      .badge {
        position: absolute;
      }

      :deep(.el-badge__content) {
        width: 18px !important;
        height: 18px !important;
        min-width: 18px !important;
        font-size: 12px !important;
        border-radius: 50% !important;
        padding: 0 !important;
        display: flex;
        justify-content: center;
        align-items: center;

        transform: translate(0%, -50%);
        right: 0 !important;
        top: 0 !important;
      }
      .iconfont {
        text-align: center;
        font-size: 20px;
        font-weight: normal;
      }
    }
    .btn-upload {
      margin-left: 10px;
      .el-button {
        background: #fb7299;
        border-color: #fb7299;
        border-radius: 8px;
        padding: 0px 20px;
        .iconfont {
          &::before {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
.user-avatar {
  margin-right: 10px;
}

.header-bar-light {
  color: #ffff;
  .menu-item {
    color: #ffff;
  }
  a {
    color: #ffff;
  }
}

.header-bar-dark {
  color: #61666d;
  .menu-item {
    color: #61666d;
  }
  a {
    color: #61666d;
  }
}

.nav-list {
  display: flex;
  .nav-part {
    &:last-child {
      border-right: none;
    }
    padding: 0px 10px;
    border-right: 1px solid #ddd;
    .nav-item {
      display: flex;
      padding: 0px 10px;
      height: 35px;
      border-radius: 3px;
      cursor: pointer;
      align-items: center;
      width: 150px;
      text-decoration: none;
      color: #2f3238;
      &:hover {
        background: #ddd;
      }
      .icon {
        width: 25px;
        height: 25px;
        overflow: hidden;
        margin-right: 5px;
        img {
          width: 100%;
        }
      }
      .category-name {
        flex: 1;
      }
    }
  }
}
</style>
