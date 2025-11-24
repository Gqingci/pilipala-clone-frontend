<template>
  <div>
    <div class="history-list">
      <div class="top-info">
        <div class="iconfont icon-wating">历史记录</div>
        <div>
          <el-button type="primary" @click="cleanAll" class="clean-btn"
            >清空历史</el-button
          >
        </div>
      </div>
      <el-timeline>
        <div class="data-list">
          <DataLoadMoreList
            :dataSource="dataSource"
            :loading="loadingData"
            @loadData="loadDataList"
            layoutType="line"
          >
            <template #default="{ data }">
              <el-timeline-item
                :timestamp="proxy.Utils.formatDate(data.lastUpdateTime)"
                placement="top"
                ><div class="history-item">
                  <div class="cover" @click="goDetail(data.videoId)">
                    <Cover :source="data.videoCover"></Cover>
                  </div>
                  <div class="video-info">
                    <div @click="goDetail(data.videoId)">
                      {{ data.videoName || 已失效视频 }}
                    </div>
                  </div>
                  <div class="op-btns">
                    <div
                      class="iconfont icon-delete"
                      @click="delHistory(data.videoId)"
                    ></div>
                  </div></div
              ></el-timeline-item>
            </template>
          </DataLoadMoreList>
        </div>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { useNavAction } from "@/stores/navActionStore";
const navActionStore = useNavAction();
import { ref, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();
import { useRouter } from "vue-router";
const router = useRouter();

const loadingData = ref(false);

// 1. 初始化必须包含 list 数组，否则 template 里读取 dataSource.list 会报错
const dataSource = ref({
  list: [],
  pageNo: 0,
  pageTotal: 1, // 初始设为1，保证能触发第一次加载
});

const loadDataList = async () => {
  // 2. 手动管理页码：当前页码 + 1
  const nextPage = (dataSource.value.pageNo || 0) + 1;

  let params = {
    pageNo: nextPage,
  };

  loadingData.value = true;
  let result = await proxy.Request({
    url: proxy.Api.playHistory,
    params,
  });
  loadingData.value = false;

  if (!result) {
    return;
  }

  // --- 关键修改开始 ---

  // 3. 你的接口直接返回了数组，所以 result.data 就是列表
  const newRecords = result.data || [];

  // 4. 判断是否是第一页，决定是“覆盖”还是“追加”
  if (nextPage === 1) {
    dataSource.value.list = newRecords;
  } else {
    dataSource.value.list = dataSource.value.list.concat(newRecords);
  }

  // 5. 更新页码状态
  dataSource.value.pageNo = nextPage;

  // 6. 处理 pageTotal
  // 逻辑：如果当前返回的数据长度大于0，我们就假设还有下一页，允许继续加载
  // 如果返回空数组，说明到底了
  if (newRecords.length > 0) {
    dataSource.value.pageTotal = nextPage + 1;
  } else {
    dataSource.value.pageTotal = nextPage; // 停止加载
  }
};
loadDataList();

const cleanAll = async () => {
  proxy.Confirm({
    message: "确定要清空历史记录吗？",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.cleanHistory,
      });
      if (!result) {
        return;
      }
      dataSource.value = { list: [] };
    },
  });
};

const delHistory = async (videoId) => {
  let result = await proxy.Request({
    url: proxy.Api.delHistory,
    params: {
      videoId,
    },
  });
  if (!result) {
    return;
  }
  dataSource.value.list = dataSource.value.list.filter((item) => {
    return item.videoId != videoId;
  });
};

const goDetail = (videoId) => {
  router.push(`/video/${videoId}`);
};

onMounted(() => {
  navActionStore.setFixedHeader(true);
  navActionStore.setFixedCategory(false);
  navActionStore.setShowHeader(true);
  navActionStore.setShowCategory(false);
});
</script>

<style lang="scss" scoped>
.history-list {
  margin: 20px auto 0px;
  width: 1200px;

  .top-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    margin-bottom: 20px;

    .icon-wating {
      font-size: 16px;

      &::before {
        margin-right: 5px;
        font-size: 22px;
        color: #e3936c;
        float: left;
      }
    }
  }

  .clean-btn {
    background-color: transparent !important;
    color: #000 !important;
    border: solid 1px #ccd0d7 !important;

    &:hover {
      background-color: #e3e5e7 !important;
    }
  }

  .data-list {
    .history-item {
      margin-top: 10px;
      display: flex;
      align-items: center;

      .cover {
        width: 200px;
      }

      .video-info {
        flex: 1;
        margin-left: 10px;
        cursor: pointer;
        color: var(--blue3);
      }

      .op-btns {
        .iconfont {
          cursor: pointer;
          color: #e3936c;
        }
      }
    }
  }
}
</style>