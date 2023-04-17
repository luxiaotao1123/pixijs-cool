import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// pina
import store from './store/index'
import { piniaPlugin } from './store/index'

// vue-router
import router from './router/index'

let app = createApp(App);

// 装载pinia缓存插件
store.use(piniaPlugin({
    key: 'pinia'
})); 

app.use(store);

app.use(router);

app.mount('#app')
