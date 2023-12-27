<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBackendStore, type User } from '@/stores/backend'
import AccountListItem from '@/components/AccountListItem.vue'
import { mdiAccountCancel, mdiAccountQuestion } from '@mdi/js'
import { computed } from 'vue'

const props = withDefaults(defineProps<{ username: string | null }>(), { username: null })
const users = ref<Array<User>>([])
const username_ = computed(() => (props.username === null ? backend.me?.username : props.username))

function notMe(u: User) {
  return backend.me === null || u.username != backend.me.username
}

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
      <template v-if="backend.me !== null">
        <v-list-subheader>Me</v-list-subheader>
        <AccountListItem
          :user="backend.me"
          :active="backend.me.username == username_"
        ></AccountListItem>
        <v-divider></v-divider>
      </template>
      <v-list-subheader>Admins</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="notMe(user) && user.verified && !user.banned && user.admin"
          :user="user"
          :active="user.username == username_"
        ></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader>Users</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="notMe(user) && user.verified && !user.banned && !user.admin"
          :user="user"
          :active="user.username == username_"
        ></AccountListItem>
      </template>
      <template v-if="backend.me !== null">
        <v-divider></v-divider>
        <v-list-subheader>Non-members</v-list-subheader>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Not verified"
              :prepend-icon="mdiAccountQuestion"
            ></v-list-item>
          </template>
          <template v-for="user in users" :key="user.username">
            <AccountListItem
              v-if="notMe(user) && !user.verified && !user.banned"
              :user="user"
              :active="user.username == username_"
            ></AccountListItem>
          </template>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Banned"
              :prepend-icon="mdiAccountCancel"
            ></v-list-item>
          </template>
          <template v-for="user in users" :key="user.username">
            <AccountListItem
              v-if="notMe(user) && user.banned"
              :user="user"
              :active="user.username == username_"
            ></AccountListItem>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
