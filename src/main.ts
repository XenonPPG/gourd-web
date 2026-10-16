import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/style/index.css';
import './assets/style/fonts.css';
import {ClickOutside} from './scripts/directives/ClickOutside.ts';
import {MotionPlugin} from '@vueuse/motion';

const app = createApp(App);

app.directive('click-outside', ClickOutside);

app.use(createPinia());
app.use(router);
app.use(MotionPlugin);

app.mount('#app');
