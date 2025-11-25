<template>
  <div>
    <div class="top-panel">
      <el-card>
        <el-form :model="searchForm" @submit.prevent>
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item label="视频">
                <el-input
                  clearable
                  placeholder="输入视频名称搜索"
                  v-model="searchForm.videoNameFuzzy"
                  @keyup.enter="loadDataList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-button type="success" @click="loadDataList">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <div class="danmu-panel">
        <Table
          ref="tableInfoRef"
          :columns="columns"
          :fetch="loadDataList"
          :dataSource="tableData"
          :options="tableOptions"
          :extHeight="tableOptions.extHeight"
        >
          <template #slotUsername="{ index, row }">
            <router-link
              target="_blank"
              class="user-name"
              @click="goUserHome(row.userId)"
              >{{ row.username }}</router-link
            >
          </template>

          <template #time="{ index, row }">
            {{ proxy.Utils.convertSecondsToHMS(Math.round(row.time)) }}
          </template>

          <template #slotText="{ index, row }">
            <div>{{ row.text }}</div>
            <router-link
              target="_blank"
              class="video-info"
              @click="goVideoDetail(row.videoId)"
              >视频: {{ row.videoName }}</router-link
            >
          </template>

          <template #slotOperation="{ index, row }">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="delDanmu(row.danmuId)"
              >删除</a
            >
          </template>
        </Table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const columns = [
  {
    label: "发送者",
    prop: "username",
    width: 150,
    scopedSlots: "slotUsername",
  },
  {
    label: "播放时间",
    prop: "time",
    scopedSlots: "time",
    width: 100,
  },
  {
    label: "弹幕内容",
    prop: "text",
    scopedSlots: "slotText",
  },
  {
    label: "发送时间",
    prop: "postTime",
    width: 180,
  },
  {
    label: "操作",
    prop: "operation",
    width: 80,
    scopedSlots: "slotOperation",
  },
];

const tableInfoRef = ref();
const tableOptions = ref({
  extHeight: 20,
});
const tableData = ref([]);
const searchForm = ref({});

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchForm.value);
  let result = await proxy.Request({
    url: proxy.Api.loadDanmu,
    params: params,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData.value, result.data);
};

const delDanmu = (danmuId) => {
  proxy.Confirm({
    message: "确认要删除吗？",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delDanmu,
        params: {
          danmuId,
        },
      });
      if (!result) {
        return;
      }
      proxy.Message.success("删除成功");
      loadDataList();
    },
  });
};

const goUserHome = (id) => {
  const baseUrl = import.meta.env.VITE_USER_WEB;
  window.open(`${baseUrl}/user/${id}`, "_blank");
};
const goVideoDetail = (id) => {
  const baseUrl = import.meta.env.VITE_USER_WEB;
  window.open(`${baseUrl}/video/${id}`, "_blank");
};
</script>

<style lang="scss" scoped>
.video-info,
.user-name {
  margin-top: 5px;
  font-size: 12px;
  color: #409eff;
  text-decoration: none;
}
.user-name {
  font-size: 14px;
  color: #409eff;
}
</style>
