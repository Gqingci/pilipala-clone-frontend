import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/scss/base.scss'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/bofangliang/iconfont.css'

import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import Dialog from '@/components/Dialog.vue'
import Cover from '@/components/Cover.vue'
import Avatar from '@/components/Avatar.vue'
import VideoItem from '@/components/VideoItem.vue'
import DataList from '@/components/DataList.vue'
import Table from '@/components/Table.vue'
import DataLoadMoreList from '@/components/DataLoadMoreList.vue'
import NoData from '@/components/NoData.vue'
import Collapse from '@/components/Collapse.vue'

import Verify from '@/utils/Verify'
import Request from '@/utils/Request'
import Message from '@/utils/Message'
import Confirm from '@/utils/Confirm'
import { Api } from '@/utils/API'
import Utils from '@/utils/Utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.component("Dialog", Dialog)
app.component("Cover", Cover)
app.component("Avatar", Avatar)
app.component("VideoItem", VideoItem)
app.component("DataList", DataList)
app.component("Table", Table)
app.component("DataLoadMoreList", DataLoadMoreList)
app.component("NoData", NoData)
app.component("Collapse", Collapse)

app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.bodyMaxWidth = 2000;
app.config.globalProperties.bodyMinWidth = 1250;

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Request = Request;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.Api = Api;
app.config.globalProperties.Utils = Utils;
//一行分类数量，多余换行。
app.config.globalProperties.rowCategoryCount = 12;
app.config.globalProperties.bodyPadding = 150;
app.config.globalProperties.carouselMaxCount = 3;
app.config.globalProperties.imageThumbnailSuffix = "_thumbnail.jpg";
app.config.globalProperties.imageAccept = ".jpg,.png,.gif,.bmp,.webp";
app.config.globalProperties.videoAccept = ".mp4,.avi,.rmvb,.mkv,.mov";
app.config.globalProperties.chunkSize = 1024 * 512;
app.config.globalProperties.maxUplaoding = 3;
app.mount('#app')

