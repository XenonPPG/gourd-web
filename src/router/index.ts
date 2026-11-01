import {createRouter, createWebHistory} from 'vue-router';
import Home from "@/views/Home.vue";
import Rules from "@/views/Rules.vue";
import Results from "@/views/Results.vue";

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
        {
            path: '/results',
            component: Results,
        },
    ],
});

export default router;
