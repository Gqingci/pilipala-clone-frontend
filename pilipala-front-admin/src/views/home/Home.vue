<template>
  <div>
    <el-card class="box-card"
      ><div slot="header">
        <div class="part-title">视频资源</div>
      </div>
      <div class="video-data-list">
        <div
          :class="[
            'video-data-item',
            item.preDataType == currentDataPart.preDataType ? 'active' : '',
          ]"
          :key="item"
          v-for="item in dataPartList"
          @click="loadWeekDataHandler(item)"
        >
          <div class="video-data-title">
            <div :class="['name iconfont', item.icon]">{{ item.name }}</div>
            <div class="pre-count">{{ item.preCount }}</div>
          </div>
          <div class="total-count">{{ item.totalCount }}</div>
        </div>
      </div>
    </el-card>

    <el-card class="week-data-panel">
      <div ref="chartRef" class="data-chart"></div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, getCurrentInstance, shallowRef, onMounted } from "vue";
const { proxy } = getCurrentInstance();

const dataPartList = ref([
  {
    name: "用户数",
    icon: "icon-user",
    totalCountKey: "userCount",
    preDataType: 1,
    totalCount: 0,
    preCount: 0,
  },
  {
    name: "播放",
    icon: "icon-play-solid",
    totalCountKey: "playCount",
    preDataType: 0,
    totalCount: 0,
    preCount: 0,
  },
  {
    name: "评论",
    icon: "icon-comment-solid",
    totalCountKey: "commentCount",
    preDataType: 5,
    totalCount: 0,
    preCount: 0,
  },
  {
    name: "弹幕",
    icon: "icon-dammu-solid",
    totalCountKey: "danmuCount",
    preDataType: 6,
    totalCount: 0,
    preCount: 0,
  },
  {
    name: "点赞",
    icon: "icon-like-solid",
    totalCountKey: "likeCount",
    preDataType: 2,
    totalCount: 0,
    preCount: 0,
  },
  {
    name: "收藏",
    icon: "icon-collection-solid",
    totalCountKey: "collectCount",
    preDataType: 3,
    totalCount: 0,
    preCount: 0,
  },
  {
    name: "投币",
    icon: "icon-toubi",
    totalCountKey: "coinCount",
    preDataType: 4,
    totalCount: 0,
    preCount: 0,
  },
]);

const getActualTimeStatisticsInfo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getActualTimeStatisticsInfo,
  });
  if (!result) {
    return;
  }
  const totalCountInfo = result.data.totalCountInfo;
  const preDayData = result.data.preDayData;

  dataPartList.value.forEach((item) => {
    item.totalCount = totalCountInfo[item.totalCountKey];
    item.preCount = preDayData[item.preDataType]
      ? preDayData[item.preDataType]
      : 0;
  });
};
getActualTimeStatisticsInfo();

const currentDataPart = ref(dataPartList.value[0]);
const loadWeekDataHandler = (item) => {
  currentDataPart.value = item;
  loadWeekData();
};

const chartRef = ref(null);
const dataChart = shallowRef();
const init = () => {
  dataChart.value = echarts.init(chartRef.value);
  loadWeekData();
};

const loadWeekData = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getWeekStatisticsInfo,
    params: {
      dataType: currentDataPart.value.preDataType,
    },
  });
  if (!result) {
    return;
  }

  const dateArray = [];
  const dataCountArray = [];
  result.data.forEach((item) => {
    dateArray.push(item.statisticsDate);
    dataCountArray.push(item.statisticsCount);
  });

  const option = {
    title: {
      text: `近7天${currentDataPart.value.name}`,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [currentDataPart.value.name],
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readonly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: dateArray,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value}",
        },
      },
    ],
    series: [
      {
        name: currentDataPart.value.name,
        type: "line",
        data: dataCountArray,
        smooth: true, // 平滑曲线
        showSymbol: false, // 默认不显示拐点
        symbol: "circle", // 拐点形状
        symbolSize: 8, // 拐点大小（hover 时）
        lineStyle: {
          width: 4, // 线条加粗
          color: "#ff6699", // 主色调
        },
        itemStyle: {
          color: "#ffffff", // 内部白色
          borderColor: "#ff6699", // 边框粉色
          borderWidth: 3,
        },
        emphasis: {
          // 鼠标悬浮时强化样式（使拐点更显眼）
          itemStyle: {
            color: "#ffffff",
            borderColor: "#ff3366",
            borderWidth: 4,
            shadowColor: "rgba(255, 102, 153, 0.5)",
            shadowBlur: 10,
          },
        },
        areaStyle: {
          // 渐变阴影
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255, 102, 153, 0.4)" },
            { offset: 1, color: "rgba(255, 102, 153, 0)" },
          ]),
          shadowColor: "rgba(255, 102, 153, 0.3)",
          shadowBlur: 10,
        },
        animationDuration: 1500, // 初始动画时长
        animationEasing: "cubicOut", // 缓动曲线
      },
    ],
  };

  dataChart.value.setOption(option, true);
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.part-title {
  font-size: 18px;
  margin-bottom: 20px;
}
.video-data-list {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  padding-bottom: 10px;
  .video-data-item {
    cursor: pointer;
    background: #f5fcfe;
    padding: 20px;
    border-radius: 5px;
    .video-data-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .iconfont {
        color: var(--text3);
        font-size: 14px;
        &::before {
          font-size: 20px;
          margin-right: 5px;
          float: left;
        }
      }
      .pre-count {
        color: #ff4684;
      }
    }
    .total-count {
      margin-top: 10px;
      font-weight: bold;
      color: var(--blue);
      font-size: 20px;
    }
  }
  .video-data-item.active {
    background: #ff4684;
    .video-data-title {
      .iconfont {
        color: #fff;
      }
      .pre-count {
        color: #fff;
      }
    }
    .total-count {
      color: #fff;
    }
  }
}
.data-chart {
  height: 400px;
}
.week-data-panel {
  margin-top: 10px;
}
</style>
