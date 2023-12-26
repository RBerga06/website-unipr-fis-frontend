<script setup lang="ts">
import {
  mdiThemeLightDark,
  mdiWeatherNight,
  mdiWhiteBalanceSunny,
  mdiAccountMultiple,
  mdiHome,
  mdiFileDocumentMultiple,
  mdiLogin,
  mdiLogout
} from '@mdi/js'
import { useTheme } from 'vuetify'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBackendStore, userIcon } from '@/stores/backend'

/* --- VUE ROUTER --- */
const router = useRouter()

/* --- BACKEND API CONNECTION --- */
const backend = useBackendStore()
backend.api.get('/').then((response) => console.log(response.data))
// TODO: Implement a JS/TS-only game to play if the backend is not available.
// For example, Pong, Tetris, Snake, Mario, lichess.org's Chess Pursuit or something similar.
// At the end of each round/game, the frontend should retry connecting to the backend.
// If the backend becomes available, show the user a (non-enforcing) button to re-load the page.

/* --- DRAWER --- */
const drawerExpanded = ref(false)

/* --- THEME MANAGEMENT UTILITIES --- */
const theme = useTheme() // Vue's global theme
const themeIsAuto = ref(true)
const themeIcon = computed(() => {
  return themeIsAuto.value
    ? mdiThemeLightDark
    : theme.global.current.value.dark
      ? mdiWeatherNight
      : mdiWhiteBalanceSunny
})
const themeSystemMQL = window.matchMedia('(prefers-color-scheme: dark)') // Is system dark?
function themeSystemApply(e: MediaQueryList | MediaQueryListEvent = themeSystemMQL) {
  // Called when the system theme changes
  if (themeIsAuto.value) {
    theme.global.name.value = e.matches ? 'dark' : 'light'
  }
}
themeSystemMQL.onchange = themeSystemApply
function themeSet(t: 'light' | 'dark' | 'auto') {
  // Set the current theme to `t`
  if (t == 'auto') {
    themeIsAuto.value = true
    themeSystemApply()
  } else {
    themeIsAuto.value = false
    theme.global.name.value = t
  }
}
function themeToggle() {
  // Toggle the current theme
  themeSet(themeIsAuto.value ? 'light' : theme.global.current.value.dark ? 'auto' : 'dark')
}
themeSystemApply() // Make sure we match the system theme

/* --- ... --- */
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click.stop="drawerExpanded = !drawerExpanded"></v-app-bar-nav-icon>
      <v-app-bar-title>The Quantum Portal</v-app-bar-title>
      <v-btn :icon="themeIcon" @click="themeToggle"></v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn :icon="userIcon(backend.me)" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item v-if="backend.me === null" title="Anonymous"></v-list-item>
          <v-list-item v-else :title="backend.me.username"></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer permanent :rail="!drawerExpanded">
      <v-list nav density="compact">
        <v-list-item
          link
          :prepend-icon="mdiHome"
          :active="router.currentRoute.value.path == '/'"
          @click="router.push('/')"
          >Home</v-list-item
        >
        <v-list-item
          link
          :prepend-icon="mdiFileDocumentMultiple"
          :active="router.currentRoute.value.path.startsWith('/info/')"
          @click="router.push('/info/about-us')"
          >Readings</v-list-item
        >
        <v-list-item
          link
          :prepend-icon="mdiAccountMultiple"
          :active="router.currentRoute.value.path.startsWith('/users/')"
          @click="router.push('/users/')"
          >Community</v-list-item
        >
        <v-divider></v-divider>
        <v-list-item
          v-if="backend.me === null"
          link
          :prepend-icon="mdiLogin"
          :active="router.currentRoute.value.path == '/login/'"
          @click="router.push('/login/')"
          >Login</v-list-item
        >
        <v-list-item
          v-else
          link
          :prepend-icon="userIcon(backend.me)"
          :active="router.currentRoute.value.path == '/account/'"
          @click="router.push('/account/')"
          >Account</v-list-item
        >
        <v-list-item
          v-if="backend.me !== null"
          link
          variant="plain"
          :prepend-icon="mdiLogout"
          :active="router.currentRoute.value.path == '/logout/'"
          @click="router.push('/logout/')"
          >Logout</v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-container fluid>
      <v-main class="d-flex align-center justify-center">
        <router-view></router-view>
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped></style>
