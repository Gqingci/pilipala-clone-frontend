<template>
  <div class="send-panel">
    <Avatar
      :avatar="
        Object.keys(loginStore.userInfo).length == 0
          ? ''
          : loginStore.userInfo.avatar
      "
    />
    <div class="input-panel">
      <template v-if="showSend">
        <el-form
          ref="formDataRef"
          :model="formData"
          :rules="rules"
          @submit.prevent
        >
          <el-form-item class="input-area">
            <el-input
              clearable
              type="textarea"
              resize="none"
              size="large"
              :rows="1"
              :placeholder="formData.username ? '@' + formData.username : ''"
              v-model="formData.content"
              :maxlength="500"
              :autosize="{ minRows: 1, maxRows: 5 }"
              ref="textInputRef"
              @focus="handleFocus"
              @blur="handleBlur"
            ></el-input>
            <div class="comment-image" v-if="formData.imgPath">
              <Cover fit="cover" :source="formData.imgPath"></Cover>
              <span class="del iconfont icon-close" @click="delImage"></span>
            </div>
          </el-form-item>
        </el-form>
        <div class="op-panel" ref="opPanelRef" v-show="isFocus">
          <div class="op-btns">
            <el-popover
              ref="elPopoverRef"
              :width="500"
              trigger="click"
              :show-arrow="false"
              :offset="5"
              placement="bottom-start"
            >
              <template #reference>
                <div class="iconfont icon-emoji"></div
              ></template>
              <template #default>
                <el-tabs v-model="activeEmoji" @click.stop>
                  <el-tab-pane
                    :label="emoji.name"
                    :name="emoji.name"
                    :key="emoji.name"
                    v-for="emoji in emojiList"
                  >
                    <div class="emoji-list">
                      <div
                        class="emoji-item"
                        :key="item"
                        v-for="item in emoji.emojiList"
                        @click="sendEmoji(item)"
                      >
                        {{ item }}
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs></template
              >
            </el-popover>
            <el-upload
              v-if="replyLevel == 1"
              ref="uploaderRef"
              :multiple="false"
              :show-file-list="false"
              :http-request="selectFile"
              :accept="proxy.imageAccept"
              ><div class="iconfont icon-image"></div
            ></el-upload>
          </div>
          <div class="send-btn">
            <el-button class="custom-btn" @mousedown="submitComment"
              >发布</el-button
            >
          </div>
        </div>
      </template>
      <div v-else class="no-send">UP主已关闭评论</div>
    </div>
  </div>
</template>

<script setup>
import { uploadImage } from "@/utils/Api";
import { mitter } from "@/eventBus/eventBus.js";
import emojiList from "@/utils/Emoji.js";
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router";
const route = useRoute();
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();

const props = defineProps({
  sendType: {
    type: Number,
  },
  showSend: {
    type: Boolean,
    default: true,
  },
  focusShow: {
    type: Boolean,
    default: false,
  },
  replyLevel: {
    type: Number,
    default: 1,
  },
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};

const submitComment = async (event) => {
  event.preventDefault();
  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true);
    return;
  }

  const params =
    props.sendType == 0
      ? { content: formData.value.content, imgPath: formData.value.imgPath }
      : Object.assign({}, formData.value);
  if (!params.content) {
    proxy.Message.warning("请输入要评论的内容");
    return;
  }
  params.videoId = route.params.videoId;
  if (params.imgPath) {
    const imgPath = await uploadImage(params.imgPath, true);
    params.imgPath = imgPath;
  }
  let result = await proxy.Request({
    url: proxy.Api.postComment,
    params,
  });
  if (!result) {
    return;
  }
  formDataRef.value.resetFields();
  formData.value = {};
  proxy.Message.success("发布成功");
  // 回复评论时隐藏整个输入框
  if (props.sendType !== 0) {
    mitter.emit("hideReplyPanel");
  } else {
    isFocus.value = false;
  }
  mitter.emit("postCommentSuccess", result.data);
};

// 插入表情
const elPopoverRef = ref();
const activeEmoji = ref("笑脸");
const sendEmoji = (emoji) => {
  formData.value.content = formData.value.content
    ? formData.value.content + emoji
    : emoji;
  elPopoverRef.value.hide();
};

// 插入图片
const selectFile = (file) => {
  formData.value.imgPath = file.file;
};
const delImage = () => {
  formData.value.imgPath = null;
};

const isFocus = ref(!props.focusShow);
const opPanelRef = ref(null);
const textInputRef = ref(null);

const handleFocus = () => {
  if (props.focusShow) {
    isFocus.value = true;
  }
};

const handleBlur = (e) => {
  if (!props.focusShow) return;

  setTimeout(() => {
    const activeEl = document.activeElement;
    if (
      opPanelRef.value &&
      (opPanelRef.value.contains(activeEl) ||
        activeEl === textInputRef.value.$el)
    ) {
      return;
    }
    isFocus.value = false;
  }, 100);
};

onMounted(() => {
  mitter.on("initCommentData", (data) => {
    if (props.sendType !== 0) {
      formData.value = Object.assign({}, data);
    }
  });
});

onBeforeUnmount(() => {
  mitter.off("initCommentData");
});
</script>

<style lang="scss" scoped>
.send-panel {
  margin-top: 20px;
  display: flex;

  .input-panel {
    flex: 1;
    margin-left: 15px;

    :deep(.el-form-item) {
      margin-bottom: 0px;
    }

    .no-send {
      background: #ebebeb;
      text-align: center;
      padding: 15px;
      border-radius: 5px;
      color: var(--text3);
    }

    .input-area {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 8px;
      align-items: center;
      min-height: 50px;
      max-height: 200px;

      :deep(.el-textarea__inner) {
        box-shadow: none;
        padding: 0px;
      }

      .comment-image {
        margin-top: 5px;
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        position: relative;

        .del {
          position: absolute;
          top: 0px;
          right: 0px;
          background: #0003;
          width: 20px;
          height: 20px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px 5px 0px 5px;
          cursor: pointer;
        }
      }
    }

    .op-panel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;

      .op-btns {
        display: flex;
        align-items: center;

        .iconfont {
          cursor: pointer;
          border: 1px solid #ddd;
          padding: 3px 8px;
          margin-right: 5px;
          border-radius: 5px;
        }
      }
    }
  }
}

.emoji-list {
  max-height: 200px; // 固定高度，可根据需求调整
  overflow-y: auto; // 超出部分滚动
  padding: 5px;
  .emoji-item {
    float: left;
    font-size: 23px;
    padding: 2px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;

    &:hover {
      background: #ddd;
    }
  }
}

.send-btn .el-button.custom-btn {
  color: #fff;
  background-color: rgba(0, 174, 236, 0.5);
  border: none;
  &:hover {
    background-color: #00aeec;
  }
}
</style>