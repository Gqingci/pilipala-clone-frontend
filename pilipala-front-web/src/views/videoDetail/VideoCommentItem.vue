<template>
  <div
    class="comment-item"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <Avatar
      :width="replyLevel == 1 ? 50 : 30"
      :avatar="data.avatar"
      :userId="data.userId"
    ></Avatar>
    <div class="comment-content-panel">
      <div class="username-panel">
        <router-link :to="`/user/${data.userId}`" class="username">{{
          data.username
        }}</router-link>
        <template v-if="data.replyUserId">
          <div class="reply-title">&nbsp;回复&nbsp;</div>
          <router-link :to="`/user/${data.replyUserId}`" class="reply-username"
            >@{{ data.replyUsername }}</router-link
          ><span>&nbsp; :</span>
        </template>
      </div>
      <div class="comment-message">
        <Tag :type="0" v-if="data.topType == 1"></Tag>
        <span v-html="proxy.Utils.resetHtmlContent(data.content)"></span>
      </div>
      <div class="image-show" v-if="data.imgPath">
        <Cover
          :source="data.imgPath + proxy.imageThumbnailSuffix"
          :preview="true"
          fit="cover"
        ></Cover>
      </div>
      <div class="comment-op">
        <div class="op-left">
          <div class="comment-time">{{ data.postTime }}</div>
          <div
            :class="[
              'iconfont',
              'icon-good',
              data.likeCountActive ? 'active' : '',
            ]"
            @click="doLike(data)"
          >
            {{ data.likeCount == 0 ? "" : data.likeCount }}
          </div>
          <div
            :class="[
              'iconfont',
              'icon-no-good',
              data.hateCountActive ? 'active' : '',
            ]"
            @click="doHate(data)"
          ></div>
          <div class="reply-btn" @click="showReplyHandler(data, replyLevel)">
            回复
          </div>
        </div>
        <el-dropdown
          :teleported="false"
          trigger="click"
          v-if="
            hover &&
            (data.userId == loginStore.userInfo.id ||
              videoInfo.userId == loginStore.userInfo.id)
          "
          class="op-right-dropdown"
        >
          <span
            class="op-right iconfont icon-more"
            @click="dropdownVisible = !dropdownVisible"
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="topComment"
                v-if="
                  videoInfo.userId == loginStore.userInfo.id &&
                  data.pCommentId == 0
                "
                >{{ data.topType == 1 ? "取消置顶" : "置顶" }}</el-dropdown-item
              >
              <el-dropdown-item
                @click="delComment"
                v-if="
                  videoInfo.userId == loginStore.userInfo.id ||
                  data.userId == loginStore.userInfo.id
                "
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="reply-list">
        <VideoCommentItem
          :key="item"
          v-for="item in data.children"
          :data="item"
          :replyLevel="2"
        ></VideoCommentItem>
      </div>
      <VideoCommentSend
        v-if="replyLevel == 1 && data.showReply"
        :sendType="1"
        :focusShow="false"
        :replyLevel="2"
      ></VideoCommentSend>
    </div>
  </div>
</template>

<script setup>
import { doUserAction } from "@/utils/Api";
import { ACTION_TYPE } from "@/utils/Constants";
import { mitter } from "@/eventBus/eventBus.js";
import VideoCommentSend from "./VideoCommentSend.vue";
import VideoCommentItem from "./VideoCommentItem.vue";
import Tag from "@/components/Tag.vue";
import { ref, getCurrentInstance, nextTick, inject } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router";
const route = useRoute();
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  replyLevel: {
    type: Number,
    default: 1,
  },
});
const hover = ref(false);
const videoInfo = inject("videoInfo");

const doLike = (data) => {
  doUserAction(
    {
      videoId: route.params.videoId,
      actionType: ACTION_TYPE.COMMENT_LIKE.value,
      commentId: data.commentId,
    },
    () => {
      if (data.hateCountActive) {
        data.hateCountActive = false;
        data.hateCount--;
      }
      if (data.likeCountActive) {
        data.likeCountActive = false;
        data.likeCount--;
      } else {
        data.likeCountActive = true;
        data.likeCount++;
      }
    }
  );
};

const doHate = (data) => {
  doUserAction(
    {
      videoId: route.params.videoId,
      actionType: ACTION_TYPE.COMMENT_HATE.value,
      commentId: data.commentId,
    },
    () => {
      if (data.likeCountActive) {
        data.likeCountActive = false;
        data.likeCount--;
      }
      if (data.hateCountActive) {
        data.hateCountActive = false;
        data.hateCount--;
      } else {
        data.hateCountActive = true;
        data.hateCount++;
      }
    }
  );
};

const showReply = inject("showReply");
const showReplyHandler = (item, replyLevel) => {
  showReply(replyLevel == 1 ? item.commentId : item.pCommentId);
  nextTick(() => {
    const commentData = {
      replyCommentId: item.commentId,
      username: item.username,
    };
    mitter.emit("initCommentData", commentData);
  });
};

const topComment = () => {
  proxy.Confirm({
    message: `确定要${props.data.topType == 1 ? "取消置顶" : "置顶"}吗？`,
    okfun: async () => {
      let result = await proxy.Request({
        url:
          props.data.topType == 1
            ? proxy.Api.userCancelTopComment
            : proxy.Api.userTopComment,
        params: {
          commentId: props.data.commentId,
        },
      });
      if (!result) {
        return;
      }
      mitter.emit("topCommentCallback");
    },
  });
};

const delComment = () => {
  proxy.Confirm({
    message: `确定要删除该评论吗？`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.userDelComment,
        params: {
          commentId: props.data.commentId,
          isParent: props.replyLevel === 1,
        },
      });
      if (!result) {
        return;
      }
      mitter.emit("delCommentCallback", {
        pCommentId: props.data.pCommentId,
        commentId: props.data.commentId,
      });
    },
  });
};
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding: 10px 0px;

  .comment-content-panel {
    flex: 1;
    margin-left: 15px;
    margin-top: 5px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;

    .username-panel {
      font-size: 14px;
      display: flex;
      align-items: center;
      vertical-align: middle;
      .username {
        text-decoration: none;
        color: var(--text2);
      }
      .reply-title {
        margin: 0px 3px;
      }
      .reply-username {
        text-decoration: none;
        color: var(--blue3);
      }
    }
    .comment-message {
      font-size: 16px;
      line-height: 20px;
      margin-top: 5px;
    }
    .image-show {
      margin-top: 10px;
      width: 100px;
      height: 100px;
    }
    .comment-op {
      margin-top: 10px;
      display: flex;
      color: var(--text3);
      align-items: center;
      font-size: 13px;
      justify-content: space-between;
      .op-left {
        display: flex;
        .comment-time {
          margin-right: 20px;
        }
        .iconfont {
          font-size: 13px;
          margin-right: 20px;
          cursor: pointer;
          &:before {
            font-size: 15px;
            margin-right: 5px;
          }
          &.active {
            &:before {
              color: var(--blue2);
            }
          }
        }
        .reply-btn {
          cursor: pointer;
          user-select: none;
          &:hover {
            color: #00aeec;
          }
        }
      }
      .op-right {
        cursor: pointer;
        margin-right: 5px;
      }
    }
  }
}
.reply-list {
  .comment-item {
    border-bottom: none;
  }
  .comment-content-panel {
    .username-panel {
      float: left;
      margin-right: 5px;
    }
    .comment-message {
      margin-top: 0px;
    }
  }
}
.reply-list > .comment-item > .comment-content-panel {
  border-bottom: none;
  padding-bottom: 0;
}
</style>