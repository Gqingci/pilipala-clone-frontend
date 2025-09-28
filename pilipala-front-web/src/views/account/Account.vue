<template>
  <Dialog
    :show="loginStore.showLogin"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :draggable="dialogConfig.draggable"
    width="820px"
    :showCancel="false"
    @close="closeDialog()"
  >
    <!-- 左方图片 -->
    <div class="dialog-panel">
      <div class="bg">
        <img src="@\assets\images\Inoe_Takina_anime4.jpg" draggable="false" />
      </div>

      <!-- 右方内容 -->
      <el-form
        class="login-register"
        ref="formDataRef"
        :model="formData"
        :rules="rules"
        @submit.prevent
      >
        <!-- 头顶标题 -->
        <div class="tab-panel">
          <div
            :class="[opType == 1 ? 'active' : '']"
            :style="tabStyles[1]"
            @mouseenter="hoverTab(1, true)"
            @mouseleave="hoverTab(1, false)"
            @click="showPanel(1)"
          >
            登录
          </div>
          <el-divider direction="vertical"></el-divider>
          <div
            :class="[opType == 0 ? 'active' : '']"
            :style="tabStyles[0]"
            @mouseenter="hoverTab(0, true)"
            @mouseleave="hoverTab(0, false)"
            @click="showPanel(0)"
          >
            注册
          </div>
        </div>

        <!-- 表单输入 -->
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
            clearable
            v-model.trim="formData.email"
            placeholder="请输入邮箱"
            :maxlength="128"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
            type="password"
            v-model.trim="formData.password"
            placeholder="请输入密码"
            show-password
            :maxlength="128"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 注册组件 -->
        <div v-if="opType == 0">
          <!-- 密码 -->
          <el-form-item prop="registerPassword">
            <el-input
              type="password"
              v-model.trim="formData.registerPassword"
              placeholder="请输入注册密码"
              show-password
              :maxlength="128"
              size="large"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item prop="reRegisterPassword">
            <el-input
              type="password"
              v-model.trim="formData.reRegisterPassword"
              placeholder="确认密码"
              show-password
              :maxlength="128"
              size="large"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="check-code-panel">
            <div class="input">
              <el-input
                class="pass_input"
                v-model.trim="formData.captcha"
                placeholder="请输入验证码"
                :maxlength="128"
                size="large"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
            </div>
            <img :src="captchaInfo.captcha" @click="changeCaptcha" />
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            @click="showPanel(0)"
            class="login-btn"
            size="large"
            tabindex="-1"
            style="background: #fff; color: #000; border-color: #e3e5e7"
            v-if="opType == 1"
            ><span>注册</span></el-button
          >
          <el-button
            type="primary"
            @click="doSubmit"
            class="login-btn"
            size="large"
            tabindex="-1"
            style="background: #00aeec"
            ><span v-if="opType == 0">注册</span
            ><span v-if="opType == 1">登录</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </Dialog>
</template>

<script setup>
import { ElForm } from "element-plus";
import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUpdated,
} from "vue";
const { proxy } = getCurrentInstance();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();

const captchaInfo = ref({});
const changeCaptcha = async () => {
  let result = await proxy.Request({
    url: proxy.Api.captcha,
    method: "GET",
    params: {
      type: opType.value === 1 ? "login" : "register",
    },
  });
  if (!result) {
    return;
  }
  captchaInfo.value = result.data;
};

const dialogConfig = reactive({
  buttons: [],
});

const formData = ref({});
const formDataRef = ref();

const checkRepassword = (rule, value, callback) => {
  if (value != formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const rules = {
  email: [
    { required: true, message: "请输入邮箱" },
    {
      validator: proxy.Verify.email,
      message: "邮箱格式错误",
    },
  ],
  password: [{ required: true, message: "请输入密码" }],
  registerPassword: [
    {
      required: true,
      message: "请输入密码",
    },
    {
      validator: proxy.Verify.password,
      message: "密码应至少包含两位不同的字符",
    },
  ],
  reRegisterPassword: [
    {
      required: true,
      message: "请再次输入密码",
    },
    {
      validator: checkRepassword,
      message: "两次密码不一致",
    },
  ],
  captcha: [{ required: true, message: "请输入验证码" }],
};

const opType = ref(1);

const resetForm = () => {
  changeCaptcha();
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};
  });
};

const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    params.captchaKey = captchaInfo.value.captchaKey;
    params.captcha = formData.value.captcha;
    if (opType.value === 1) {
      params.password = params.password;
    }

    let result = await proxy.Request({
      url: opType.value == 0 ? proxy.Api.register : proxy.Api.login,
      params,
      errorCallback: () => {
        changeCaptcha();
      },
    });
    if (!result) {
      return;
    }

    if (opType.value === 0) {
      proxy.Message.success("注册成功");
      showPanel(1);
    } else if (opType.value === 1) {
      proxy.Message.success("登录成功");
      loginStore.setLogin(false);
      loginStore.saveUserInfo(result.data);
    }
  });
};

const closeDialog = () => {
  loginStore.setLogin(false);
};

const showPanel = (type) => {
  opType.value = type;
  if (loginStore.showLogin) {
    resetForm();
  }
};

onUpdated(() => {
  showPanel(1);
});

onMounted(() => {
  showPanel(1);
});

// 鼠标事件
const tabStyles = reactive({
  0: {},
  1: {},
});

const hoverTab = (type, isHover) => {
  if (opType.value === type && isHover) {
    tabStyles[type] = {
      cursor: "not-allowed",
    };
  } else {
    tabStyles[type] = {
      cursor: "pointer",
    };
  }
};
</script>

<style lang="scss" scoped>
.dialog-panel {
  display: flex;
  align-items: center;
  justify-content: space-around;
  user-select: none; // 禁止整个 dialog 内容被复制
  .bg {
    width: 250px;
    height: 250px;
    overflow: hidden;
    border-right: 1px solid #e3e5e7;
    img {
      width: 100%;
    }
  }
  .login-register {
    width: 350px;
    .tab-panel {
      margin: 10px auto;
      display: flex;
      width: 130px;
      font-size: 18px;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;

      .active {
        color: var(--blue2);
      }
    }

    .no-account {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .login-btn {
      width: 45%;
      margin: 0px auto;
    }
    .bottom-btn {
      margin-bottom: 0px;
    }

    .check-code-panel {
      display: flex;
      align-items: center;
      width: 100%;
      .input {
        flex: 1;
      }
      .right-panel {
        margin-left: 5px;
        cursor: pointer;
      }
      img {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
}
</style>
