<script setup lang="ts">
import {
  mdiThemeLightDark,
  mdiWeatherNight,
  mdiWhiteBalanceSunny,
  mdiAccount,
  mdiAccountMultiple
} from '@mdi/js'
import { useTheme } from 'vuetify'
import { computed } from 'vue'
import { ref } from 'vue'
import axios from 'axios'

/* --- BACKEND API CONNECTION --- */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})
// Test the connection to the backend
api.get('/').then((response) => {
  console.log(response.data)
})
// TODO: Implement a JS/TS-only game to play if the backend is not available.
// For example, Pong, Tetris, Snake, Mario, lichess.org's Chess Pursuit or something similar.
// At the end of each round/game, the frontend should retry connecting to the backend.
// If the backend becomes available, show the user a (non-enforcing) button to re-load the page.

/* --- DRAWER --- */
const drawerVisible = ref(false)
function drawerToggle() {
  drawerVisible.value = !drawerVisible.value
}

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
      <v-app-bar-nav-icon @click.stop="drawerToggle"></v-app-bar-nav-icon>
      <v-app-bar-title>Our awesome website!</v-app-bar-title>
      <v-btn @click="themeToggle" :icon="themeIcon"></v-btn>
      <v-btn :icon="mdiAccount"></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawerVisible">
      <v-list-item link title="Community" :prepend-icon="mdiAccountMultiple"></v-list-item>
    </v-navigation-drawer>

    <v-container fluid>
      <v-main class="d-flex align-center justify-center">
        <router-view></router-view>
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped></style>
