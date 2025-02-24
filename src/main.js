import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import LoaderComponent from './components/LoaderComponent.vue'
import BasePopup from './components/BasePopup.vue';


const app = createApp(App)
app.use(createPinia())
app.component('LoaderComponent', LoaderComponent)
app.component('BasePopup', BasePopup)
app.use(router)
app.mount('#app')