<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useBackendStore, type User } from '@/stores/backend'
import AccountListItem from '@/components/AccountListItem.vue'

const users = ref<Array<User>>([])

const backend = useBackendStore()
const refresh = ref<number | null>(null)
onMounted(() => {
  refresh.value = setInterval(() => {
    backend.api
      .get('/users/all')
      .catch((_) => {
        users.value = []
      })
      .then((response) => {
        if (response) {
          users.value = response.data as User[]
        }
      })
  }, 1000) // Update every second
})
onUnmounted(() => {
  if (refresh.value !== null) clearInterval(refresh.value)
})
</script>

<template>
  <v-card class="mx-auto" width="400">
    <v-list open-strategy="single">
      <v-list-subheader>Admins</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem v-if="user.admin" :user="user"></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader>Users</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem v-if="!user.admin" :user="user"></AccountListItem>
      </template>
    </v-list>
  </v-card>
</template>

<style scoped></style>
