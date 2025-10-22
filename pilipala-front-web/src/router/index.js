import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {

        path: '/',
        name: 'layout',
        component: () => import('@/views/layout/Layout.vue'),
        children: [{
            path: '/',
            name: 'index',
            component: () => import('@/views/index/Index.vue'),
        }, {
            path: '/v/:pCategoryCode',
            name: 'categoryVideo',
            component: () => import('@/views/videoList/CategoryVideo.vue'),
        }, {
            path: '/v/:pCategoryCode/:categoryCode',
            name: 'subCategoryVideo',
            component: () => import('@/views/videoList/CategoryVideo.vue'),
        }, {
            path: '/video/:videoId',
            name: 'videoDetail',
            component: () => import('@/views/videoDetail/VideoDetail.vue'),
        }]
    },
    {
        path: '/ucenter',
        name: 'ucenter',
        redirect: '/ucenter/home',
        component: () => import('@/views/ucenter/UcLayout.vue'),
        children: [{
            path: '/ucenter/home',
            name: '用户中心',
            component: () => import('@/views/ucenter/Home.vue'),
        }, {
            path: '/ucenter/postVideo',
            name: '上传视频',
            component: () => import('@/views/ucenter/postVideo/Post.vue'),
        }, {
            path: '/ucenter/editVideo',
            name: '编辑视频',
            component: () => import('@/views/ucenter/postVideo/Post.vue')
        }, {
            path: '/ucenter/video',
            name: '视频列表',
            component: () => import('@/views/ucenter/VideoList.vue')
        }, {
            path: '/ucenter/comment',
            name: '评论列表',
            component: () => import('@/views/ucenter/CommentList.vue')
        }, {
            path: '/ucenter/danmu',
            name: '弹幕列表',
            component: () => import('@/views/ucenter/DanmuList.vue')
        }],
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router