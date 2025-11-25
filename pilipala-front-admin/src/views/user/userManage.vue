<template>
  <div>
    <div class="top-panel">
      <el-card>
        <el-form :model="searchForm" @submit.prevent>
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item label="用户昵称">
                <el-input
                  clearable
                  placeholder="输入用户昵称"
                  v-model="searchForm.usernameFuzzy"
                  @keyup.enter="loadDataList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="状态" prop="">
                <el-select
                  clearable
                  placeholder="请选择状态"
                  v-model="searchForm.isActive"
                >
                  <el-option :value="0" label="禁用"></el-option>
                  <el-option :value="1" label="启用"></el-option>
                </el-select>
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
      <div class="comment-panel">
        <Table
          ref="tableInfoRef"
          :columns="columns"
          :fetch="loadDataList"
          :dataSource="tableData"
          :options="tableOptions"
          :extHeight="tableOptions.extHeight"
        >
          <template #slotAvatar="{ index, row }">
            <Avatar :avatar="row.avatar" />
          </template>
          <template #slotUsername="{ index, row }">
            <div class="user-name" @click="goUserHome(row.id)">
              {{ row.username }}
            </div>
          </template>
          <template #slotGender="{ index, row }">
            <span v-if="row.gender">({{ SEX_MAP[row.gender] }})</span>
          </template>
          <template #slotJoinDate="{ index, row }">
            <div>加入时间：{{ row.joinDate }}</div>
            <div>最后登录时间：{{ row.lastLogin }}</div>
          </template>
          <template #slotLastLoginIP="{ index, row }">
            <div>{{ row.lastLoginIp }}</div>
          </template>
          <template #slotCoin="{ index, row }">
            <div>当前：{{ row.coinBalance }}</div>
            <div>总数：{{ row.totalCoinsEarned }}</div>
          </template>
          <template #slotStatus="{ index, row }">
            {{ row.isActive == 0 ? "禁用" : "启用" }}
          </template>
          <template #slotOperation="{ index, row }">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="changeStatus(row)"
              >{{ row.isActive == 0 ? "启用" : "禁用" }}</a
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
const userWeb = import.meta.env.VITE_USER_WEB;

const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 100,
    scopedSlots: "slotAvatar",
  },
  {
    label: "昵称",
    prop: "username",
    width: 150,
    scopedSlots: "slotUsername",
  },
  { label: "性别", prop: "gender", with: 20, scopedSlots: "slotGender" },
  {
    label: "邮箱",
    prop: "email",
    width: 150,
  },
  {
    label: "出生日期",
    prop: "birthday",
    width: 150,
  },
  {
    label: "加入时间",
    prop: "joinDate",
    scopedSlots: "slotJoinDate",
    width: 300,
  },
  {
    label: "最后登录IP",
    prop: "lastLoginIP",
    scopedSlots: "slotLastLoginIP",
    width: 150,
  },
  {
    label: "简介",
    prop: "biography",
  },
  {
    label: "硬币数量",
    prop: "coin",
    scopedSlots: "slotCoin",
  },
  {
    label: "状态",
    prop: "isActive",
    scopedSlots: "slotStatus",
  },
  {
    label: "操作",
    prop: "operation",
    width: 80,
    scopedSlots: "slotOperation",
  },
];

const SEX_MAP = {
  0: "女",
  1: "男",
  2: "保密",
};

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
    url: proxy.Api.loadUser,
    params: params,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData.value, result.data);
};

const changeStatus = (row) => {
  proxy.Confirm({
    message: `确认要${row.isActive == 0 ? "启用" : "禁用"}吗？`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.changeStatus,
        params: {
          userId: row.id,
          isActive: row.isActive == 0 ? 1 : 0,
        },
      });
      if (!result) {
        return;
      }
      proxy.Message.success(`${row.isActive == 0 ? "启用" : "禁用"}成功`);
      loadDataList();
    },
  });
};

const goUserHome = (id) => {
  const baseUrl = import.meta.env.VITE_USER_WEB;
  window.open(`${baseUrl}/user/${id}`, "_blank");
};
</script>

<style lang="scss" scoped>
.comment-panel {
  cursor: pointer;
  .user-name {
    margin-top: 5px;
    font-size: 14px;
    color: #409eff;
  }
}
</style>
