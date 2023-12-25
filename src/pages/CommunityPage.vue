<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBackendStore, type User } from '@/stores/backend'
import AccountSummary from '@/components/AccountSummary.vue'
import { computed } from 'vue'

const backend = useBackendStore()

const users = ref<Array<User>>([])
const users_admins = computed(() => {
  return users.value.filter((u) => u.admin)
})
const users_nonadmins = computed(() => {
  return users.value.filter((u) => !u.admin)
})

const refresh = ref<number | null>(null)
onMounted(() => {
  refresh.value = setInterval(() => {
    backend.api
      .get(`/users/all`)
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
  <v-list>
    <v-list-subheader>Admins</v-list-subheader>
    <v-list-item v-for="user in users_admins"
      ><AccountSummary :user="user"></AccountSummary
    ></v-list-item>
    <v-list-subheader>Users</v-list-subheader>
    <v-list-item v-for="user in users_nonadmins"
      ><AccountSummary :user="user"></AccountSummary
    ></v-list-item>
  </v-list>
</template>

<style scoped></style>
