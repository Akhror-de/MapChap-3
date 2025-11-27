import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Импортируем Telegram стили
import './styles/telegram.css'

// Create app
const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
app.use(pinia)

// Mount app
app.mount('#app')
