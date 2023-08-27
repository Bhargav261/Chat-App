import { createApp } from 'vue';
import App from './App.vue';
import router from './Router/routers';
import '@/styles/main.scss';
import store from "./store";
import "./assets/css/style.css"

createApp(App).use(store).use(router).mount('#app')
