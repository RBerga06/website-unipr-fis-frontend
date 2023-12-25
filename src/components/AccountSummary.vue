<script setup lang="ts">
import { type User } from '@/stores/backend'

defineProps<{
  user: User | null
}>()
</script>

<template>
  <v-card>
    <v-card-title>{{ user === null ? '[anonymous]' : user.username }}</v-card-title>
    <v-card-subtitle>{{ user?.admin ? 'admin' : '' }}</v-card-subtitle>
  </v-card>
</template>

<style scoped></style>
