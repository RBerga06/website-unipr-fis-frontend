import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import CommunityPage from './pages/CommunityPage.vue'
import LoginPage from './pages/LoginPage.vue'
import LogoutPage from './pages/LogoutPage.vue'
import AccountVerifyPage from './pages/AccountVerifyPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

// Pinia
const pinia = createPinia()

// Vue Router
const routes = [
  { path: '/', component: HomePage },
  { path: '/users/', component: CommunityPage },
  { path: '/login/', component: LoginPage },
  { path: '/logout/', component: LogoutPage },
  { path: '/verify/', component: AccountVerifyPage },
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
createApp(App).use(pinia).use(router).use(vuetify).mount('#app')
