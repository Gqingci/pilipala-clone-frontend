<template>
  <div class="home-body">
    <div class="left-content">
      <HomeVideoList></HomeVideoList>
      <HomeSeries></HomeSeries>
    </div>
    <div class="right-content">
      <div class="part-item">
        <div class="part-title">公告</div>
        <div
          class="part-content"
          v-html="userInfo.spaceAnnouncement || '暂无公告'"
        ></div>
      </div>
      <div class="part-item">
        <div class="part-title">个人资料</div>
        <el-button class="btn" @click="emit('editUserInfo')" v-if="myself"
          >修改资料</el-button
        >
        <div class="part-content">
          <div class="user-info-panel">
            <div class="user-info-item">
              <div class="label">UID</div>
              <div class="value">{{ userInfo.id }}</div>
            </div>
            <div v-if="userInfo.birthday" class="user-info-item">
              <div class="label">生日</div>
              <div class="value">{{ formatBirthday(userInfo.birthday) }}</div>
            </div>
            <div v-if="userInfo.school" class="user-info-item">
              <div class="label">学校</div>
              <div class="value">{{ userInfo.school }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLoginStore } from "@/stores/loginStore.js";
const loginStore = useLoginStore();
import { inject, computed } from "vue";
import { useRoute } from "vue-router";
import HomeVideoList from "./HomeVideoList.vue";
import HomeSeries from "./HomeSeries.vue";
const route = useRoute();

const emit = defineEmits(["editUserInfo"]);
const userInfo = inject("userInfo");
const myself = computed(() => {
  return loginStore.userInfo.id == route.params.userId;
});

const formatBirthday = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${month}-${day}`;
};
</script>

<style lang="scss" scoped>
.home-body {
  display: flex;
  .left-content {
    flex: 1;
    border: 1px solid #e3e5e7;
    background: #fff;
    border-radius: 5px;
    padding: 20px;
  }
  .right-content {
    width: 350px;
    margin-left: 20px;
    .part-item {
      position: relative;
      border: 1px solid #e3e5e7;
      border-radius: 5px;
      background: #fff;
      padding: 20px;
      margin-bottom: 15px;
      .part-title {
        font-size: 15px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        padding-bottom: 15px;
        color: var(--text2);
      }
      .btn {
        position: absolute;
        font-size: 12px;
        width: 56px;
        height: 25px;
        right: 20px;
        top: 20px;
        &:hover {
          background-color: inherit;
          color: var(--text2);
          border-color: inherit;
          box-shadow: none;
        }
      }
      .part-content {
        padding-top: 15px;
        color: var(--text2);
        font-size: 13px;
        .user-info-panel {
          .user-info-item {
            margin-top: 8px;
            display: flex;
            .value {
              margin-left: 10px;
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>