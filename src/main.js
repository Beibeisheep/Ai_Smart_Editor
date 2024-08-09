import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import store from './stores'
import $ from 'jquery'
window.$ = $ //原因：设置变量但未使用，编辑器会报错。
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)
// createApp(App).use(store).use(router).mount('#app')
app.mount('#app')

