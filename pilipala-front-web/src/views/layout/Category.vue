<template>
  <div>
    <div class="category" v-show="showType == 0">
      <!-- <router-link
      class="developments"
      to="/developments"
      target="_blank"
    ></router-link> -->
      <router-link class="hot" to="/hot" target="_blank">
        <div class="iconfont icon-hot"></div>
        <div class="info">热门</div>
      </router-link>
      <div
        class="category-list"
        :style="{
          'grid-template-columns': `repeat(${proxy.rowCategoryCount}, 1fr)`,
        }"
      >
        <template v-for="index in showItemCount">
          <!-- 有子类的情况 -->
          <el-popover
            :key="
              'popover-' + categoryStore.categoryList[index - 1].categoryCode
            "
            :placement="index <= rowCategoryCount ? 'top' : 'bottom'"
            :width="187"
            trigger="hover"
            :show-arrow="false"
            :offset="5"
            v-if="
              categoryStore.categoryList[index - 1].children &&
              categoryStore.categoryList[index - 1].children.length > 0
            "
          >
            <template #reference>
              <router-link
                :class="[
                  'category-item',
                  categoryStore.categoryList[index - 1].categoryCode ==
                  route.params.pCategoryCode
                    ? 'active'
                    : '',
                ]"
                :to="`/v/${categoryStore.categoryList[index - 1].categoryCode}`"
                target="_blank"
                >{{
                  categoryStore.categoryList[index - 1].categoryName
                }}</router-link
              >
            </template>
            <div class="child-list">
              <router-link
                class="child"
                :key="sub.categoryCode"
                v-for="sub in categoryStore.categoryList[index - 1].children"
                :title="sub.categoryName"
                :to="`/v/${
                  categoryStore.categoryList[index - 1].categoryCode
                }/${sub.categoryCode}`"
                target="_blank"
                >{{ sub.categoryName }}</router-link
              >
            </div>
          </el-popover>
          <!-- 没有子类的情况 -->
          <router-link
            v-else
            :key="'link-' + categoryStore.categoryList[index - 1].categoryCode"
            :class="[
              'category-item',
              categoryStore.categoryList[index - 1].categoryCode ==
              route.params.pCategoryCode
                ? 'active'
                : '',
            ]"
            :to="`/v/${categoryStore.categoryList[index - 1].categoryCode}`"
            target="_blank"
            >{{
              categoryStore.categoryList[index - 1].categoryName
            }}</router-link
          >
        </template>
        <!-- 超过限定数量，归入更多 -->
        <template
          v-if="categoryStore.categoryList.length > proxy.rowCategoryCount * 2"
          ><el-popover
            placement="bottom"
            :width="187"
            trigger="hover"
            :show-arrow="false"
            :offset="5"
          >
            <template #reference
              ><div
                class="category-item btn-category-more"
                style="cursor: default"
              >
                更多<span class="iconfont icon-more"></span></div
            ></template>
            <div class="child-list">
              <router-link
                class="child"
                :key="item"
                v-for="item in categoryStore.categoryList.slice(
                  proxy.rowCategoryCount * 2 - 1,
                  categoryStore.categoryList.length
                )"
                :title="item.categoryName"
                :to="`/v/${item.categoryCode}`"
                target="_blank"
                >{{ item.categoryName }}</router-link
              >
            </div>
          </el-popover>
        </template>
      </div>
    </div>
    <!-- 顶部固定bar -->
    <div
      :class="['category', mouseOver ? '' : 'category-out']"
      v-show="showType == 1"
    >
      <router-link class="hot hot-out" to="/hot" target="_blank">
        <div class="iconfont icon-hot"></div>
        <div class="info">热门</div>
      </router-link>
      <div
        class="category-list"
        :style="{
          'grid-template-columns': `repeat(${proxy.rowCategoryCount}, 1fr)`,
        }"
      >
        <template v-for="item in categoryStore.categoryList">
          <router-link
            class="category-item"
            :to="`/v/${item.categoryCode}`"
            target="_blank"
          >
            {{ item.categoryName }}</router-link
          >
        </template>
      </div>
      <div
        :class="['category-op iconfont', mouseOver ? 'icon-up' : 'icon-down']"
        v-show="categoryStore.categoryList.length > proxy.rowCategoryCount"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, computed } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router";
const route = useRoute();
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();

const props = defineProps({
  showType: {
    type: Number,
    default: 0,
  },
  mouseOver: {
    type: Boolean,
    default: false,
  },
});

const showItemCount = computed(() => {
  let count = categoryStore.categoryList.length;
  if (categoryStore.categoryList.length > proxy.rowCategoryCount * 2) {
    count = proxy.rowCategoryCount * 2 - 1;
  }
  return count;
});
</script>

<style lang="scss" scoped>
.category {
  display: flex;
  align-items: flex-start;
  .hot {
    text-align: center;
    margin-right: 40px;
    text-decoration: none;
    color: var(--text);
    .icon-hot {
      width: 46px;
      height: 46px;
      background: #f07775;
      color: #fff;
      font-size: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .info {
      margin-top: 8px;
    }
  }
  .category-list {
    width: 100%;
    display: grid;
    grid-gap: 8px;
    .category-item {
      line-height: 30px;
      padding: 0px 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      letter-spacing: 2px;
      border: 1px solid #f1f2f3;
      border-radius: 6px;
      background-color: #f6f7f8;
      color: #61666d;
      text-align: center;
      font-weight: 400;
      text-decoration: none;
      &:hover {
        background: #e1e3e5;
      }
    }
    .active {
      color: var(--blue);
    }
    .btn-category-more {
      .iconfont {
        font-size: 12px;
      }
      .icon-up {
        display: none;
      }
    }
    //展示更多
    .category-more {
      margin-left: 5px;
    }
  }

  .category-op {
    float: right;
    margin-left: 5px;
    margin-top: 7px;
  }

  //鼠标移除只展示一行
  .hot-out {
    width: 80px;
    height: 30px;
    display: flex;
    align-items: center;
    .icon-hot {
      width: 30px;
      font-size: 25px;
      height: auto;
      background: none;
      color: #61666d;
    }
    .info {
      margin-top: 0px;
      font-size: 15px;
      color: #61666d;
    }
  }
}

.category-out {
  overflow: hidden;
  height: 32px;
}

.child-list {
  display: flex;
  flex-wrap: wrap;
  .child {
    text-decoration: none;
    color: #61666d;
    padding: 5px;
    width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      background: #e5e5e5;
      border-radius: 3px;
    }
  }
}
</style>
