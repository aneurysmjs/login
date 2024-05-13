import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import { setupLayouts } from 'virtual:generated-layouts'

import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  },
}

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  extendRoutes: routes => setupLayouts(routes),
})

app.use(router)
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.mount('#app')
