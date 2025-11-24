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
        },
        {
            path: '/history',
            name: 'history',
            component: ()=> import('@/views/history/History.vue')
        },
        {
            path: '/message',
            name: 'messageHome',
            component: ()=> import('@/views/message/UserMessage.vue')
        },
        {
            path: '/message/:messageType',
            name: 'message',
            component: ()=> import('@/views/message/UserMessage.vue')
        },
        {
            path: '/hot',
            name: 'hot',
            component: ()=> import('@/views/hot/Hot.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: ()=> import('@/views/search/Search.vue')
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
    }, 
    {
        path: '/user/:userId',
        name: 'userspace',
        component: () => import('@/views/userspace/UserSpaceLayout.vue'),
        redirect: '/user/:userId',
        children:[{
            path: '/user/:userId',
            name: 'uspaceHome',
            component: ()=> import('@/views/userspace/Home.vue')
        },
        {
            path: '/user/:userId/video',
            name: 'uspaceMyVideo',
            component: ()=> import('@/views/userspace/VideoList.vue')
        },
        {
            path: '/user/:userId/series',
            name: 'uspaceSeries',
            component: ()=> import('@/views/userspace/VideoSeries.vue')
        },
        {
            path: '/user/:userId/series/:seriesId',
            name: 'uspaceSeriesDetail',
            component: ()=> import('@/views/userspace/VideoSeriesDetail.vue')
        },
        {
            path: '/user/:userId/collection',
            name: 'uspaceCollection',
            component: ()=> import('@/views/userspace/Collection.vue')
        },
        {
            path: '/user/:userId/focus',
            name: 'uspaceFocus',
            component: ()=> import('@/views/userspace/FocusFansList.vue')
        },
        {
            path: '/user/:userId/fans',
            name: 'uspaceFans',
            component: ()=> import('@/views/userspace/FocusFansList.vue')
        }]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router