import { createApp } from 'vue';
import App from './App.vue';
import router from './Router/routers';
import '@/styles/main.scss';
import store from "./store";
import "./assets/css/style.css"


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faSignOutAlt)


createApp(App).component('font-awesome-icon', FontAwesomeIcon)
    .use(store).use(router).mount('#app')
