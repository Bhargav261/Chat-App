import Login from '../components/Login.vue';
import Chat from '../components/Chat.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        name: 'Login',
        component: Login,
        path: '/'
    },
    {
        name: 'Chat',
        component: Chat,
        path: '/chat'
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;