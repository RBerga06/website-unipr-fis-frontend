<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <v-app>
    <v-navigation-drawer></v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>Title!</v-app-bar-title>
    </v-app-bar>

    <v-container fluid>
      <v-main class="d-flex align-center justify-center">
        <HelloWorld msg="Hello, World!" />
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped></style>
