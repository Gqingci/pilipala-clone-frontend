import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'layout',
        component: () => import('../views/Layout.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router