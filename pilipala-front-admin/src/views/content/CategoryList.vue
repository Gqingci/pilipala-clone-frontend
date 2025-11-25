<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-card shadow="always" class="table-data-card">
          <template #header>
            <div class="header">
              <div class="title">一级分类</div>
              <div class="btn" @click="showEdit({}, 0)">新增分类</div>
            </div>
          </template>
          <Table
            ref="tableInfoRef"
            :columns="columns"
            :fetch="loadDataList"
            :dataSource="tableData"
            :options="tableOptions"
            :extHeight="tableOptions.extHeight"
            :showPagination="false"
            @rowClick="rowClick"
          >
            <template #icon="{ index, row }">
              <div class="cover">
                <Cover :source="row.icon" defaultImg="article_empty.png" />
              </div>
            </template>
            <template #background="{ index, row }">
              <div class="category-background">
                <Cover
                  :source="row.background"
                  fit="cover"
                  defaultImg="empty-channel.png"
                />
              </div>
            </template>
            <template #slotOperation="{ index, row }">
              <div class="row-op-panel">
                <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="showEdit(row, 0)"
                  >修改</a
                >
                <el-divider direction="vertical" />
                <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="delCategory(row)"
                  >删除</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  @click="changeSort(0, index, 'up')"
                  :class="[index == 0 ? 'disable' : 'a-link']"
                  >上移</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  @click="changeSort(0, index, 'down')"
                  :class="[
                    index == tableData.list.length - 1 ? 'disable' : 'a-link',
                  ]"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" class="table-data-card">
          <template #header>
            <div class="header">
              <div class="title">二级分类</div>
              <div class="btn" @click="showEdit({}, 1)">新增二级分类</div>
            </div>
          </template>
          <Table
            :columns="columnSub"
            :dataSource="subCategoryData"
            :options="tableOptions"
            :extHeight="tableOptions.extHeight"
            :showPagination="false"
          >
            <template #slotOperation="{ index, row }">
              <div class="row-op-panel">
                <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="showEdit(row, 0)"
                  >修改</a
                >
                <el-divider direction="vertical" />
                <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="delCategory(row)"
                  >删除</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  @click="changeSort(row.pCategoryId, index, 'up')"
                  :class="[index == 0 ? 'disable' : 'a-link']"
                  >上移</a
                >
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  @click="changeSort(row.pCategoryId, index, 'down')"
                  :class="[
                    index == subCategoryData.list.length - 1
                      ? 'disable'
                      : 'a-link',
                  ]"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <CategoryEdit ref="categoryEditRef" @reload="loadDataList"></CategoryEdit>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
import CategoryEdit from "./CategoryEdit.vue";

const tableData = ref({});
const tableOptions = ref({
  extHeight: 0,
});

const columns = [
  {
    label: "图标",
    prop: "icon",
    scopedSlots: "icon",
    width: 70,
  },
  {
    label: "背景",
    prop: "background",
    scopedSlots: "background",
    width: 180,
  },
  {
    label: "分类编号",
    prop: "categoryCode",
    width: 180,
  },
  {
    label: "分类名称",
    prop: "categoryName",
  },
  {
    label: "操作",
    prop: "type",
    scopedSlots: "slotOperation",
    width: 200,
  },
];

const columnSub = columns.slice(columns.length - 3, columns.length);

const tableInfoRef = ref();
const loadDataList = async () => {
  const activeId = currentSelectCategory.value?.categoryId;

  let result = await proxy.Request({
    url: proxy.Api.loadCategory,
  });
  if (!result) {
    return;
  }

  tableData.value.list = result.data;

  if (activeId) {
    currentSelectCategory.value = result.data.find(
      (item) => item.categoryId == activeId
    );
  } else if (result.data.length > 0) {
    currentSelectCategory.value = result.data[0];
  }

  subCategoryData.value.list = currentSelectCategory.value?.children ?? [];

  nextTick(() => {
    tableInfoRef.value.setCurrentRow(
      "categoryId",
      currentSelectCategory.value?.categoryId
    );
  });
};

const currentSelectCategory = ref();
const subCategoryData = ref([]);
const rowClick = (row) => {
  currentSelectCategory.value = row;
  subCategoryData.value.list = row.children;
};

const delCategory = (data) => {
  proxy.Confirm({
    message: `确定要删除"${data.categoryName}"吗？`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delCategory,
        params: {
          categoryId: data.categoryId,
        },
      });
      if (!result) {
        return;
      }
      proxy.Message.success("操作成功");
      //清空选中
      if (currentSelectCategory.value.categoryId == data.categoryId) {
        currentSelectCategory.value = null;
      }
      loadDataList();
    },
  });
};

const changeSort = async (pCategoryId, index, type) => {
  let dataList =
    pCategoryId == 0
      ? tableData.value.list
      : currentSelectCategory.value.children;
  if (
    (type == "down" && index == dataList.length - 1) ||
    (type == "up" && index == 0)
  ) {
    return;
  }
  let temp = dataList[index];
  let number = type == "down" ? 1 : -1;
  dataList.splice(index, 1);
  dataList.splice(index + number, 0, temp);
  let categoryIds = [];
  dataList.forEach((element) => {
    categoryIds.push(element.categoryId);
  });
  let result = await proxy.Request({
    url: proxy.Api.changeCategorySort,
    params: {
      pCategoryId,
      categoryIds: categoryIds.join(","),
    },
  });
  if (!result) {
    return;
  }
};

const categoryEditRef = ref();
const showEdit = (data, type) => {
  if (type == 1 && !currentSelectCategory.value) {
    proxy.Message.success("请先创建一级分类");
    return;
  }
  if (type == 0) {
    data.pCategoryId = 0;
  } else if (type == 1 && Object.keys(data).length == 0) {
    data.pCategoryId = currentSelectCategory.value.categoryId;
  }
  categoryEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped>
.table-data-card {
  .header {
    display: flex;
    justify-content: space-between;

    .btn {
      cursor: pointer;
      color: var(--blue2);
    }
  }

  .category-background {
    width: 150px;
    height: 80px;
  }
  .cover {
    height: 50px;
  }
  .row-op-panel a {
    text-decoration: none;
  }
}
</style>