<template>
  <div class="setting-container">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">
            <el-icon class="icon"><Setting /></el-icon> 系统全局参数设置
          </span>
          <el-button type="primary" :loading="loading" @click="saveSetting">
            <el-icon class="mr-1"><Check /></el-icon> 保存配置
          </el-button>
        </div>
      </template>

      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="150px"
        label-position="right"
        @submit.prevent
      >
        <!-- 第一组：用户激励策略 -->
        <el-divider content-position="left">
          <el-icon><Coin /></el-icon> &nbsp;用户激励策略
        </el-divider>

        <el-row :gutter="40">
          <el-col :span="12" :xs="24">
            <el-form-item label="注册赠送硬币" prop="registerCoinCount">
              <el-input-number
                v-model="formData.registerCoinCount"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
              <div class="form-tip">新用户注册成功后系统自动发放</div>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="发布视频赠送硬币" prop="postVideoCoinCount">
              <el-input-number
                v-model="formData.postVideoCoinCount"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
              <div class="form-tip">用户每发布一个过审视频获得的奖励</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二组：内容上传控制 -->
        <el-divider content-position="left">
          <el-icon><UploadFilled /></el-icon> &nbsp;内容上传控制
        </el-divider>

        <el-row :gutter="40">
          <el-col :span="12" :xs="24">
            <el-form-item label="单视频大小上限" prop="videoSize">
              <el-input-number
                v-model="formData.videoSize"
                :min="1"
                controls-position="right"
                style="width: 100%"
              >
                <template #suffix>MB</template>
              </el-input-number>
              <div class="form-tip">限制用户上传单个文件的最大体积 (MB)</div>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="稿件最大分P数" prop="videoPCount">
              <el-input-number
                v-model="formData.videoPCount"
                :min="1"
                controls-position="right"
                style="width: 100%"
              />
              <div class="form-tip">单个投稿允许包含的最大视频片段数量</div>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="每日发布上限" prop="videoCount">
              <el-input-number
                v-model="formData.videoCount"
                :min="1"
                controls-position="right"
                style="width: 100%"
              />
              <div class="form-tip">单个用户每天允许发布的视频投稿总数</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三组：互动频率限制 -->
        <el-divider content-position="left">
          <el-icon><ChatDotRound /></el-icon> &nbsp;互动频率限制
        </el-divider>

        <el-row :gutter="40">
          <el-col :span="12" :xs="24">
            <el-form-item label="每日评论上限" prop="commentCount">
              <el-input-number
                v-model="formData.commentCount"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="每日弹幕上限" prop="danmuCount">
              <el-input-number
                v-model="formData.danmuCount"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import {
  Setting,
  Check,
  Coin,
  UploadFilled,
  ChatDotRound,
} from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();

const formData = ref({
  registerCoinCount: 10,
  postVideoCoinCount: 5,
  videoSize: 500,
  videoPCount: 10,
  videoCount: 5,
  commentCount: 20,
  danmuCount: 50,
});
const formDataRef = ref();
const loading = ref(false);

const rules = {
  registerCoinCount: [
    { required: true, message: "请输入注册赠送硬币数", trigger: "blur" },
  ],
  postVideoCoinCount: [
    { required: true, message: "请输入发布视频赠送硬币数", trigger: "blur" },
  ],
  videoSize: [
    { required: true, message: "请输入视频大小限制", trigger: "blur" },
  ],
  videoCount: [
    { required: true, message: "请输入每日发布上限", trigger: "blur" },
  ],
  videoPCount: [
    { required: true, message: "请输入分P数量限制", trigger: "blur" },
  ],
  commentCount: [
    { required: true, message: "请输入评论数量限制", trigger: "blur" },
  ],
  danmuCount: [
    { required: true, message: "请输入弹幕数量限制", trigger: "blur" },
  ],
};

const getSetting = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getSetting,
  });
  if (!result) {
    return;
  }
  formData.value = result.data;
};
getSetting();

const saveSetting = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    let params = {};
    Object.assign(params, formData.value);

    try {
      let result = await proxy.Request({
        url: proxy.Api.saveSetting,
        params,
      });
      if (result) {
        proxy.Message.success("系统配置保存成功");
      }
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 20px;
  max-width: 2000px;
  margin: 0 auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      .icon {
        margin-right: 8px;
        font-size: 20px;
        color: #409eff;
      }
    }
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    line-height: 1.2;
    margin-top: 5px;
  }

  :deep(.el-divider__text) {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #606266;
  }

  .mr-1 {
    margin-right: 4px;
  }
}
</style>