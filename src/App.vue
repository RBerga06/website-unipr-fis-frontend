<script setup lang="ts">
import {
  mdiThemeLightDark,
  mdiWeatherNight,
  mdiWhiteBalanceSunny,
  mdiAccountMultiple,
  mdiHome,
  mdiFileDocumentMultiple,
  mdiLogin,
  mdiLogout,
  mdiCalculatorVariant
} from '@mdi/js'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useBackendStore } from '@/stores/backend'
import AccountAvatar from './components/AccountAvatar.vue'
import AccountListItem from './components/AccountListItem.vue'
import { storeToRefs } from 'pinia'

/* --- VUE ROUTER --- */
const router = useRouter()

/* --- BACKEND API CONNECTION --- */
const backend = useBackendStore()
const { me } = storeToRefs(backend)
backend.api.get('/').then((response) => console.log(response.data))
// TODO: Implement a JS/TS-only game to play if the backend is not available.
// For example, Pong, Tetris, Snake, Mario, lichess.org's Chess Pursuit or something similar.
// At the end of each round/game, the frontend should retry connecting to the backend.
// If the backend becomes available, show the user a (non-enforcing) button to re-load the page.

/* --- SCREEN DIMENSIONS --- */
const screenSmall = computed(() => screenDimensions.value.width <= 480)
const screenDimensions = ref({ width: window.innerWidth, height: window.innerHeight })
function onResize() {
  screenDimensions.value.width = window.innerWidth
  screenDimensions.value.height = window.innerHeight
}
onMounted(async () => {
  window.addEventListener('resize', onResize)
  backend.restore()
  backend.start()
})
onUnmounted(async () => {
  backend.stop() // TODO: find a better place for this
  window.removeEventListener('resize', onResize)
})

/* --- DRAWER --- */
const drawerExpanded = ref(false)
const drawerVisible = computed({
  get() {
    return !screenSmall.value || drawerExpanded.value
  },
  set(drawerVisible: boolean) {
    drawerExpanded.value = drawerVisible
  }
})

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
  <v-app @click="backend.interact">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click.stop="drawerExpanded = !drawerExpanded"></v-app-bar-nav-icon>
      <v-app-bar-title>The Quantum Portal</v-app-bar-title>
      <v-btn :icon="themeIcon" @click="themeToggle"></v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props"><AccountAvatar :user="me"></AccountAvatar></v-btn>
        </template>
        <v-list>
          <AccountListItem :user="me"></AccountListItem>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerVisible"
      :temporary="screenSmall"
      :permanent="!screenSmall"
      :rail="!screenSmall && !drawerExpanded"
      :expand-on-hover="!screenSmall && !drawerExpanded"
    >
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
          link
          :prepend-icon="mdiCalculatorVariant"
          :active="router.currentRoute.value.path == '/calc/'"
          @click="router.push('/calc/')"
          >Uni&nbsp;Mean&nbsp;Calculator</v-list-item
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
