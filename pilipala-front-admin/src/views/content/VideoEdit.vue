<template>
  <div>
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
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="3">审核通过</el-radio>
            <el-radio :value="4">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="驳回理由"
          prop="reason"
          v-if="formData.status == 4"
        >
          <el-input
            resize="none"
            type="textarea"
            :rows="4"
            clearable
            placeholder="请输入驳回理由"
            v-model="formData.reason"
            show-word-limit
            :maxlength="200"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const dialogConfig = reactive({
  show: false,
  title: "审核",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        audit();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  status: [{ required: true, message: "请选择审核结果" }],
  reason: [{ required: true, message: "请输入驳回理由" }],
};

const show = (videoId) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {
      videoId,
    };
  });
};

const emit = defineEmits(["reload"]);
const audit = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: proxy.Api.auditVideo,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.Message.success("审核成功");
    emit("reload");
  });
};
defineExpose({ show });
</script>

<style lang="scss" scoped>
</style>