import { createApp } from 'vue'
import App from './App.vue'
import WebFontLoader from '../src/utils/webFontLoader' // eslint-disable-line no-unused-vars

const app = createApp(App)

app.config.productionTip = false

app.mount('#app')
