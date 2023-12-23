import './assets/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import HomePage from './components/HomePage.vue'
import CommunityPage from './components/CommunityPage.vue'
import NotFoundPage from './components/NotFoundPage.vue'

// Vue Router
const routes = [
  { path: '/', component: HomePage },
  { path: '/users/', component: CommunityPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Vuetify
const vuetify = createVuetify({
  components,
  directives,
  // ssr: true,  // SSR (Server-Side Rendering)
  icons: {
    // Material Design Icons (MDI)
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

// Vue App
createApp(App).use(router).use(vuetify).mount('#app')
