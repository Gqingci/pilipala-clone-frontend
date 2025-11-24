<template>
  <div class="body-container">
    <div class="body-title">
      {{ route.name == "uspaceFocus" ? "我的关注" : "我的粉丝" }}
    </div>
    <DataList
      :dataSource="dataSource"
      @loadData="loadDataList"
      text="还没有任何关注哦~~"
    >
      <template #default="{ data }">
        <div class="data-item">
          <Avatar
            :avatar="data.otherAvatar"
            :userId="data.otherUserId"
          ></Avatar>
          <div class="user-info">
            <div class="user-name">
              <router-link
                :to="`/user/${data.otherUserId}`"
                target="_blank"
                class="a-link"
              >
                {{ data.otherUsername }}</router-link
              >
            </div>
            <div class="introduction">
              {{ data.otherBiography || "这个人没有填简介啊~~~" }}
            </div>
          </div>
          <div class="op-btns">
            <div class="uspaceFocus-btns" v-if="route.name == 'uspaceFocus'">
              <el-button
                class="cancel-btn"
                type="primary"
                @click="cancelFocus(data.otherUserId, data)"
                v-if="route.name === 'uspaceFocus'"
              >
                {{ data.focusType == 1 ? "已互粉" : "已关注" }}
              </el-button>
            </div>
            <div class="uspaceFans-btns" v-if="route.name == 'uspaceFans'">
              <el-button
                class="focus-btn"
                type="primary"
                @click="focus(data.otherUserId)"
                v-if="data.focusType == 0"
              >
                关注
              </el-button>

              <el-button
                class="cancel-btn"
                type="primary"
                @click="cancelFocus(data.otherUserId)"
                v-if="data.focusType == 1"
              >
                已互粉
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, inject } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router";
const route = useRoute();

const dataSource = ref({});
const loadDataList = async () => {
  let params = {
    pageNo: dataSource.value.pageNo,
    pageSize: dataSource.value.pageSize,
  };
  let result = await proxy.Request({
    url:
      route.name == "uspaceFocus"
        ? proxy.Api.uHomeFocusList
        : proxy.Api.uHomeFansList,
    params,
  });
  if (!result) {
    return;
  }
  dataSource.value = result.data;
};

watch(
  () => route.name,
  (newVal, oldVal) => {
    if (newVal == "uspaceFocus" || newVal == "uspaceFans") {
      {
        loadDataList();
      }
    }
  },
  { immediate: true, deep: true }
);

const focusUser = inject("focusUser");
const focus = (otherUserId) => {
  focusUser(otherUserId, () => {
    loadDataList();
  });
};
const cancelFocusUser = inject("cancelFocusUser");
const cancelFocus = (otherUserId) => {
  cancelFocusUser(otherUserId, () => {
    loadDataList();
  });
};
</script>

<style lang="scss" scoped>
.body-container {
  background: #fff;
  padding: 20px;
  border-radius: 5px;

  .body-title {
    font-size: 18px;
    color: #6d757a;
    border-bottom: 1px solid #e5e9ef;
    padding: 0px 0px 10px 0px;
  }

  .data-item {
    display: flex;
    align-items: center;
    padding: 10px;

    .user-info {
      flex: 1;
      margin: 0px 10px;

      .introduction {
        margin-top: 10px;
        font-size: 13px;
        color: #6d757a;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        padding-right: 10px;
      }
    }

    .op-btns {
      display: flex;
      align-items: center;
      .cancel-btn {
        background-color: #e5e9ef !important;
        color: #6d757a !important;
        border: none !important;

        &:hover {
          color: #00a1d6 !important;
        }
      }

      .focus-btn {
        background-color: transparent !important;
        color: #6d757a !important;
        border: solid 1px #ccd0d7 !important;

        &:hover {
          color: #00a1d6 !important;
        }
      }

      .focus-eachother {
        margin-right: 10px;
        color: var(--text3);
      }
    }
  }
}
</style>