<template>
  <div class="account-panel">
    <div class="bg-overlay"></div>

    <div class="login-card">
      <div class="login-header">
        <h2 class="title">Welcome Back</h2>
        <p class="subtitle">登录您的账户以继续</p>
      </div>

      <el-form
        class="login-form"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        size="large"
      >
        <el-form-item prop="account">
          <el-input
            clearable
            placeholder="请输入账号"
            v-model="formData.account"
            maxlength="150"
            class="custom-input"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            show-password
            placeholder="请输入密码"
            v-model="formData.password"
            class="custom-input"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="check-code-panel">
            <el-input
              placeholder="验证码"
              v-model="formData.captcha"
              @keyup.enter="doSubmit"
              class="custom-input captcha-input"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <div class="captcha-img-box">
              <img
                v-if="checkCodeInfo.captcha"
                :src="checkCodeInfo.captcha"
                class="check-code"
                @click="changeCheckCode()"
                alt="点击刷新"
              />
              <span v-else class="img-placeholder">加载中...</span>
            </div>
          </div>
        </el-form-item>

        <el-button
          type="primary"
          class="submit-btn"
          @click="doSubmit"
          :loading="loading"
        >
          立即登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import md5 from "blueimp-md5";
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();

const formData = ref({});
const formDataRef = ref();
const loading = ref(false);

const rules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const checkCodeInfo = ref({});

const changeCheckCode = async () => {
  try {
    let result = await proxy.Request({
      url: proxy.Api.checkCaptcha,
    });
    if (!result) return;
    checkCodeInfo.value = result.data;
  } catch (error) {
    console.error("获取验证码失败", error);
  }
};

// 页面加载时获取验证码
onMounted(() => {
  changeCheckCode();
});

const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      let params = {};
      Object.assign(params, formData.value);
      params.captchaKey = checkCodeInfo.value.captchaKey;
      params.password = md5(params.password);

      let result = await proxy.Request({
        url: proxy.Api.login,
        params,
      });

      if (!result) {
        changeCheckCode();
        loading.value = false;
        return;
      }

      proxy.Message.success("登录成功，欢迎回来！");
      proxy.VueCookies.set("account", result.data);
      router.push("/home");
    } catch (e) {
      changeCheckCode();
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
$primary-color: #409eff;
$glass-bg: rgba(255, 255, 255, 0.75);
$glass-border: rgba(255, 255, 255, 0.6);
$shadow-color: rgba(0, 0, 0, 0.1);

.account-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: url("../../assets/images/login-bg.png") no-repeat center center;
  background-size: cover;
  overflow: hidden;

  .bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  .login-card {
    position: relative;
    z-index: 2;
    width: 420px;
    padding: 40px 35px;
    background: $glass-bg;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid $glass-border;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);

    animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .login-header {
    text-align: center;
    margin-bottom: 35px;

    .title {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }

    .subtitle {
      font-size: 14px;
      color: #7f8c8d;
    }
  }

  .login-form {
    :deep(.el-input__wrapper) {
      background-color: rgba(255, 255, 255, 0.6);
      box-shadow: none;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding: 5px 15px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
        border-color: rgba(0, 0, 0, 0.2);
      }

      &.is-focus {
        background-color: #fff;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
        border-color: $primary-color;
      }
    }

    :deep(.el-input__inner) {
      height: 40px;
      color: #333;

      &::placeholder {
        color: #999;
      }
    }

    :deep(.el-input__prefix-inner) {
      color: #666;
      font-size: 18px;
    }
  }

  .check-code-panel {
    display: flex;
    align-items: center;
    gap: 15px;

    .captcha-input {
      flex: 1;
    }

    .captcha-img-box {
      width: 120px;
      height: 52px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.6);
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.8;
      }

      .check-code {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .img-placeholder {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 48px;
    margin-top: 10px;
    font-size: 16px;
    letter-spacing: 2px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(118, 75, 162, 0.6);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 480px) {
  .login-card {
    width: 90% !important;
    padding: 30px 20px !important;
  }
}
</style>