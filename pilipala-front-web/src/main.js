import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/scss/base.scss'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'

import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import Dialog from '@/components/Dialog.vue'
import Cover from '@/components/Cover.vue'
import Avatar from '@/components/Avatar.vue'

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

app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.bodyMaxWidth = 2000;
app.config.globalProperties.bodyMinWidth = 1250;

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Request = Request;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.Api = Api;
app.config.globalProperties.Utils = Utils;

app.config.globalProperties.imageThumbnailSuffix = "_thumbnail.jpg";
app.mount('#app')

