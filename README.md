# 🎬 pilipala-frontend

> 基于 Vue3 构建的在线视频分享系统前端项目  
> 实现视频播放、互动系统、创作中心及后台管理界面

---

## 📖 项目简介

pilipala Frontend 是在线视频分享系统的前端部分，基于 Vue3 + ElementPlus 构建，采用前后端分离模式，与 SpringBoot 后端进行接口交互。

项目实现完整的视频平台功能，包括视频浏览、互动、发布、数据统计和后台管理。

---

## 🛠 技术栈

- Vue 3
- Vite
- ElementPlus
- Pinia（状态管理）
- Mitt（事件总线）
- Axios

---

## 📦 功能模块

### 👤 账号模块

- 登录
- 注册
- Token 持久化存储
- 权限控制

---

### 🏠 主站模块

- 视频列表展示
- 分类筛选
- 分页加载
- 视频详情页
- 弹幕展示
- 点赞 / 收藏 / 投币

---

### 🎨 创作中心

- 视频分片上传
- 上传进度显示
- 数据统计图表展示
- 评论管理
- 弹幕管理

---

### 👤 个人中心

- 个人信息展示
- 粉丝管理
- 投稿视频管理

---

### 🔎 搜索模块

- Elasticsearch 搜索接口调用
- 搜索建议
- 热词展示

---

### 🛠 管理后台

- 分类管理
- 视频审核
- 用户管理
- 系统参数设置

---

### 📈 项目亮点

- 前后端分离架构
- 组件化开发
- Pinia 状态管理
- 数据可视化展示
- 模块划分清晰

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

项目包含两个子项目，需要分别安装依赖：

```bash
# 安装主站前端依赖
cd pilipala-front-web
npm install

# 安装管理后台依赖
cd ../pilipala-front-admin
npm install
```

### 启动开发服务器

#### 启动主站前端

```bash
cd pilipala-front-web
npm run dev
```

启动后访问：`http://localhost:5173`

#### 启动管理后台

```bash
cd pilipala-front-admin
npm run dev
```

启动后访问：`http://localhost:5174`（端口可能不同，以终端输出为准）

### 构建生产版本

```bash
# 构建主站前端
cd pilipala-front-web
npm run build

# 构建管理后台
cd pilipala-front-admin
npm run build
```

构建产物位于各子项目的 `dist` 目录下。

### 预览构建结果

```bash
npm run preview
```

---

## 📂 项目结构

```
pilipala-front/
├── pilipala-front-web/      # 主站前端
│   ├── src/
│   ├── public/
│   └── package.json
├── pilipala-front-admin/    # 管理后台
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```