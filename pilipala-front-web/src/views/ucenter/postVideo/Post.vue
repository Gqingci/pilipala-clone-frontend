<template>
  <div class="upload-video-panel">
    <VideoUploader ref="videoUploadRef" />
    <div v-if="startUpload" class="video-form">
      <el-form
        ref="formDataRef"
        :model="formData"
        label-width="80px"
        :rules="rules"
        @submit.prevent
      >
        <el-form-item label="封面" prop="videoCover"
          ><ImageCoverSelect
            :coverWidth="200"
            :cutWidth="680"
            :scale="0.6"
            :coverImage="formData.videoCover"
          ></ImageCoverSelect
        ></el-form-item>
        <el-form-item label="标题" prop="videoName">
          <el-input
            v-model="formData.videoName"
            placeholder="请输入标题"
            clearable
            maxlength="100"
            show-word-limit
          ></el-input
        ></el-form-item>

        <el-form-item label="类型" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :value="0">自制</el-radio>
            <el-radio :value="1">转载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="orginInfo" v-if="formData.postType == 1"
          ><el-input
            clearable
            placeHolder="转载视频请注明来源、时间、地点（例：转自https://www.bilibili.com），注明来源会更快通过审核哦"
            v-model="formData.orginInfo"
            maxlength="200"
            show-word-limit
          ></el-input
        ></el-form-item>
        <el-form-item label="标签" prop="tags"
          ><TagInput v-model="formData.tags"></TagInput
        ></el-form-item>
        <el-form-item label="分区" prop="categoryArray">
          <el-cascader
            :options="filteredCategoryList"
            v-model="formData.categoryArray"
            :props="{ value: 'categoryId', label: 'categoryName' }"
          />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            v-model="formData.introduction"
            placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧（： "
            clearable
            type="textarea"
            :rows="5"
            :maxlength="2000"
            resize="none"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="互动设置" prop="introduction">
          <el-checkbox-group v-model="formData.interactionArray">
            <el-checkbox value="0">关闭弹幕</el-checkbox>
            <el-checkbox value="1">关闭评论</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="submitForm">立即投稿</el-button>
          <el-button type="primary" @click="router.push('/ucenter/video')"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { uploadImage } from "@/utils/Api.js";
import TagInput from "./TagInput.vue";
import ImageCoverSelect from "@/components/ImageCoverSelect.vue";
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();
import { mitter } from "@/eventbus/eventBus.js";
import VideoUploader from "./VideoUploader.vue";
import {
  ref,
  getCurrentInstance,
  nextTick,
  provide,
  computed,
  watch,
} from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const formData = ref({
  tags: [],
});
const formDataRef = ref();
const rules = {
  videoCover: [{ required: true, message: "封面不能为空" }],
  videoName: [{ required: true, message: "标题不能为空" }],
  postType: [{ required: true, message: "类型不能为空" }],
  originInfo: [{ required: true, message: "转载说明不能为空" }],
  categoryArray: [{ required: true, message: "分区不能为空" }],
  tags: [{ required: true, message: "标签不能为空" }],
};

const startUpload = ref(false);
mitter.on("startUpload", (fileName) => {
  startUpload.value = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};
    formData.value.tags = [];
    formData.value.videoName = fileName;
  });
});

provide("cutImageCallback", ({ coverImage }) => {
  formData.value.videoCover = coverImage;
});

const videoUploadRef = ref();
const submitForm = () => {
  const uploadFileList = videoUploadRef.value.getUploadFileList();
  if (!uploadFileList || uploadFileList.length == 0) {
    proxy.Message.warning("你还未上传视频");
    return;
  }
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {
      uploadFileList: JSON.stringify(uploadFileList),
    };
    Object.assign(params, formData.value);
    params.pCategoryId = params.categoryArray[0];
    if (params.categoryArray.length > 1) {
      params.categoryId = params.categoryArray[1];
    }
    delete params.categoryArray;
    if (params.interactionArray) {
      params.interaction = params.interactionArray.join(",");
      delete params.interactionArray;
    }
    if (params.videoCover instanceof File) {
      const videoCover = await uploadImage(params.videoCover);
      if (!videoCover) {
        return;
      }
      params.videoCover = videoCover;
    }
    let result = await proxy.Request({
      url: proxy.Api.postVideo,
      params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("发布成功");
    router.push("/ucenter/video");
  });
};

const init = async () => {
  nextTick(() => {
    videoUploadRef.value.initUploader(startUpload.value, []);
  });
  if (videoId.value) {
    let result = await proxy.Request({
      url: proxy.Api.getVideoByVideoId,
      params: {
        videoId: videoId.value,
      },
    });
    if (!result) {
      return;
    }
    formData.value = result.data.videoInfo;
    formData.value.tags = formData.value.tags.split(",");
    formData.value.categoryArray = [];
    if (formData.value.pCategoryId) {
      formData.value.categoryArray.push(formData.value.pCategoryId);
    }
    if (formData.value.categoryId) {
      formData.value.categoryArray.push(formData.value.categoryId);
    }
    formData.value.interactionArray = formData.value.interaction
      ? formData.value.interaction.split(",")
      : [];

    nextTick(() => {
      videoUploadRef.value.initUploader(
        startUpload.value,
        result.data.videoInfoFileList
      );
    });
  }
};

const videoId = ref();
watch(
  () => route.query.videoId,
  (newVal, oldVal) => {
    if (newVal) {
      startUpload.value = true;
    } else {
      startUpload.value = false;
    }
    videoId.value = newVal;
    init();
  },
  { immediate: true, deep: true }
);

// 定义不允许选择的分区
const forbiddenNames = ["番剧", "国创", "综艺", "电影", "电视剧", "纪录片"];
const filteredCategoryList = computed(() => {
  const clone = JSON.parse(JSON.stringify(categoryStore.categoryList));

  // 递归过滤函数
  const filterCategories = (list) => {
    return list
      .filter((item) => !forbiddenNames.includes(item.categoryName))
      .map((item) => {
        if (item.children && item.children.length > 0) {
          item.children = filterCategories(item.children);
        }
        return item;
      });
  };

  return filterCategories(clone);
});
</script>

<style lang="scss" scoped>
</style>
