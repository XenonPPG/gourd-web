import {createRouter, createWebHistory} from 'vue-router';
import Home from "@/views/Home.vue";
import Rules from "@/views/Rules.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/rules',
            component: Rules,
        },
    ],
});

export default router;
