<script setup lang="ts">
import { mdiThemeLightDark, mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'
import { useTheme } from 'vuetify'
import HelloWorld from './components/HelloWorld.vue'
import { computed } from 'vue'
import { ref } from 'vue'

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
    <v-navigation-drawer></v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>Our awesome website!</v-app-bar-title>
      <v-btn @click="themeToggle" :icon="themeIcon"></v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-main class="d-flex align-center justify-center">
        <HelloWorld msg="Hello, World!" />
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped></style>
