<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item label="分类编号" prop="categoryCode">
        <el-input
          :maxlength="30"
          v-model="formData.categoryCode"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          :maxlength="30"
          v-model="formData.categoryName"
          :show-word-limit="true"
        />
      </el-form-item>
      <template v-if="formData.pCategoryId === 0">
        <el-form-item label="图标" prop="icon">
          <ImageUpload v-model="formData.icon"></ImageUpload>
        </el-form-item>
        <el-form-item label="背景图" prop="background">
          <ImageUpload
            v-model="formData.background"
            :width="300"
            :height="150"
          />
        </el-form-item>
      </template>
    </el-form>
  </Dialog>
</template>

<script setup>
import { uploadImage } from "@/utils/Api.js";
import ImageUpload from "@/components/ImageUpload.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  categoryCode: [{ required: true, message: "请输入分类编号" }],
  categoryName: [{ required: true, message: "请输入分类名称" }],
};

const showEdit = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.pCategoryId == null) {
      dialogConfig.title = "新增分类";
    } else {
      dialogConfig.title = "修改分类";
    }
    formData.value = data;
  });
};

const emit = defineEmits(["reload"]);
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    if (params.icon instanceof File) {
      params.icon = await uploadImage(params.icon);
    }
    if (params.background instanceof File) {
      params.background = await uploadImage(params.background);
    }
    delete params.children;
    let result = await proxy.Request({
      url: proxy.Api.saveCategory,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.Message.success("保存成功");
    emit("reload");
  });
};

defineExpose({ showEdit });
</script>

<style lang="scss" scoped>
.btn-save {
  padding: 8px 22px;
  border-radius: 6px;
  font-size: 15px;
}
</style>