<template>
  <div :class="['header-bar', 'header-bar-' + theme]">
    <ul class="menu">
      <li><router-link class="iconfont icon-logo" to="/">首页</router-link></li>
      <li><a href="" class="iconfont">会员购</a></li>
    </ul>

    <div class="search-body">
      <div class="search-panel">
        <div class="search-panel-inner">
          <div class="input-panel">
            <input type="text" />
            <div class="iconfont icon-search"></div>
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
        <Avatar v-else :width="35" :lazy="false" @click="login"></Avatar>
        <!-- <div class="user-info-panel">
          <div class="placeLogin">
            <p class="placeLogin-text">免费看高清视频</p>
            <p class="placeLogin-text">发表弹幕/评论</p>
          </div>
        </div> -->
      </div>
      <div class="user-panel-item">
        <div class="iconfont icon-message"></div>
        <div>消息</div>
      </div>
      <div class="user-panel-item">
        <div class="iconfont icon-collection"></div>
        <div>收藏</div>
      </div>
      <div class="user-panel-item">
        <div class="iconfont icon-history"></div>
        <div>历史</div>
      </div>
      <div class="user-panel-item">
        <div class="iconfont icon-light"></div>
        <div>创作中心</div>
      </div>
      <div class="btn-upload">
        <el-button type="primary" size="large">
          <span class="iconfont icon-upload"></span>
          <span>投稿</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useLoginStore } from "@/stores/loginStore.js";
import Avatar from "../components/Avatar.vue";
const loginStore = useLoginStore();

const props = defineProps({
  theme: {
    type: String,
    default: "light", //light 白色 dark 黑色
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

const logout = async () => {
  proxy.Confirm({
    message: "确认退出？",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.logout,
      });
      if (!result) {
        return;
      }
      loginStore.saveUserInfo({});
    },
  });
};
</script>

<style lang="scss" scoped>
.header-bar {
  width: 100%;
  height: 64px;
  padding: 0px 25px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
      max-width: 80%;
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
</style>
