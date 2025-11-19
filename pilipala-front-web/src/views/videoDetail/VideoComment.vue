<template>
  <div class="comment-panel">
    <div class="comment-title">
      <div class="title">
        评论<span class="comment-count">{{ dataSource.totalCount }}</span>
      </div>
      <div
        :class="['order-type-item', orderType == 0 ? 'active' : '']"
        @click="changeOrder(0)"
      >
        最热
      </div>
      <el-divider direction="vertical" />
      <div
        :class="['order-type-item', orderType == 1 ? 'active' : '']"
        @click="changeOrder(1)"
      >
        最新
      </div>
    </div>
    <div class="comment-content-panel">
      <VideoCommentSend
        :focusShow="true"
        :sendType="0"
        :showSend="showComment"
      ></VideoCommentSend>
    </div>
    <div class="comment-list">
      <DataLoadMoreList
        :dataSource="dataSource"
        :loading="loadingData"
        @loadData="loadCommentList"
        layoutType="list"
        loadEndMsg="没有更多评论"
        ><template #default="{ data }">
          <div>
            <VideoCommentItem :data="data"></VideoCommentItem></div></template
      ></DataLoadMoreList>
    </div>
  </div>
</template>

<script setup>
import VideoCommentItem from "./VideoCommentItem.vue";
import VideoCommentSend from "./VideoCommentSend.vue";
import { ACTION_TYPE } from "@/utils/Constants";
import { mitter } from "@/eventBus/eventBus.js";
import {
  ref,
  getCurrentInstance,
  inject,
  computed,
  provide,
  onMounted,
  onUnmounted,
} from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router";
const route = useRoute();

const showReplyHandler = (commentId) => {
  dataSource.value.list.forEach((item) => {
    if (item.commentId != commentId) {
      item.showReply = false;
    } else {
      item.showReply = !item.showReply;
    }
  });
};
provide("showReply", showReplyHandler);

const videoInfo = inject("videoInfo");
const showComment = computed(() => {
  return (
    videoInfo.value.interaction == null ||
    videoInfo.value.interaction.indexOf("1") == -1
  );
});

const loadingData = ref(false);
const dataSource = ref({});
const orderType = ref(0);
const changeOrder = (type) => {
  orderType.value = type;
  loadCommentList();
};

const loadCommentList = async () => {
  if (!showComment.value) {
    dataSource.value = {
      list: [],
      pageNo: 1,
      pageTotal: 1,
      totalCount: 0,
    };
    return;
  }
  loadingData.value = true;
  let result = await proxy.Request({
    url: proxy.Api.loadComment,
    params: {
      videoId: route.params.videoId,
      pageNo: dataSource.value.pageNo,
      orderType: orderType.value,
    },
  });
  loadingData.value = false;
  if (!result) {
    return;
  }
  const userActionMap = {};
  const userActionList = result.data.userActionList;
  userActionList.forEach((item) => {
    userActionMap[item.commentId] = item;
  });

  const commentData = result.data.commentData;
  commentData.list.forEach((item) => {
    setCommentActive(userActionMap, item);
    if (item.children) {
      item.children.forEach((sub) => {
        setCommentActive(userActionMap, sub);
      });
    }
  });
  const dataList = dataSource.value.list;
  dataSource.value = Object.assign({}, commentData);
  if (commentData.pageNo > 1) {
    dataSource.value.list = dataList.concat(commentData.list);
  }
};

const setCommentActive = (userActionMap, item) => {
  const userAction = userActionMap[item.commentId];
  if (userAction) {
    if (ACTION_TYPE.COMMENT_LIKE.value == userAction.actionType) {
      item.likeCountActive = true;
    } else if (ACTION_TYPE.COMMENT_HATE.value == userAction.actionType) {
      item.hateCountActive = true;
    }
  }
};

loadCommentList();

onMounted(() => {
  mitter.on("postCommentSuccess", (comment) => {
    if (comment.pCommentId == 0) {
      dataSource.value.list.unshift(comment);
    } else {
      const curComment = dataSource.value.list.find((item) => {
        return item.commentId == comment.pCommentId;
      });
      if (!curComment) {
        return;
      }
      if (!curComment.children) {
        curComment.children = [];
      }
      curComment.children.push(comment);
      curComment.showReply = false;
    }
    if (!dataSource.value.totalCount) {
      dataSource.value.totalCount = 0;
    }
    dataSource.value.totalCount++;
  });

  mitter.on("delCommentCallback", ({ pCommentId, commentId }) => {
    if (pCommentId == 0) {
      // 找到被删除的一级评论
      const comment = dataSource.value.list.find(
        (item) => item.commentId === commentId
      );
      // 计算删除总数：一级 + 子评论数量
      const countToDeduct = comment ? 1 + (comment.children?.length || 0) : 1;
      dataSource.value.list = dataSource.value.list.filter((item) => {
        return item.commentId != commentId;
      });
      dataSource.value.totalCount -= countToDeduct;
    } else {
      const pComment = dataSource.value.list.find((item) => {
        return item.commentId == pCommentId;
      });
      pComment.children = pComment.children.filter((item) => {
        return item.commentId != commentId;
      });
      dataSource.value.totalCount--;
    }
  });
  mitter.on("topCommentCallback", () => {
    loadCommentList();
  });
});

onUnmounted(() => {
  mitter.off("delCommentCallback");
  mitter.off("topCommentCallback");
  mitter.off("postCommentSuccess");
});
</script>

<style lang="scss" scoped>
.comment-panel {
  margin-top: 20px;
  .comment-title {
    display: flex;
    align-items: center;
    font-size: 15px;
    .title {
      font-size: 20px;
      font-weight: 500;
      .comment-count {
        margin-left: 5px;
        font-size: 14px;
        margin-right: 30px;
        color: var(--text2);
      }
    }
    .order-type-item {
      cursor: pointer;
      color: #9499a0;
      &.active {
        color: #000;
      }
      &:hover {
        color: #00aeec;
      }
    }
  }
  .comment-content-panel {
    padding-left: 10px;
    position: relative;
    .comment-list {
      padding-bottom: 20px;
    }
  }
}
</style>