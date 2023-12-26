<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBackendStore, type User } from '@/stores/backend'
import AccountListItem from '@/components/AccountListItem.vue'

const props = withDefaults(defineProps<{ username: string | null }>(), { username: null })
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
  <v-navigation-drawer permanent>
    <v-list nav density="compact">
      <v-list-subheader>Admins</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="user.verified && !user.banned && user.admin"
          :user="user"
          :active="user.username == props.username"
        ></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader>Users</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="user.verified && !user.banned && !user.admin"
          :user="user"
          :active="user.username == props.username"
        ></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader>Not verified</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="!user.verified && !user.banned"
          :user="user"
          :active="user.username == props.username"
        ></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader>Banned</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="user.banned"
          :user="user"
          :active="user.username == props.username"
        ></AccountListItem>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
