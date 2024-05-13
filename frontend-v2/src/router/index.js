import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '../views/home_page/index.vue'
import LoginPage from '../views/login_page/index.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        component: HomePage
    },
    {
        path: '/login',
        component: LoginPage
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router