import { createApp } from 'vue'
import store from '@/store'
import App from './App.vue'

import '@/assets/css/style.css'
import '@/assets/css/weather-icons.css'

const weatherApp = createApp(App)

weatherApp.use(store)
weatherApp.mount('#app')
// @vueuser/head
