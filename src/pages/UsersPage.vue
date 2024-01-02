<script setup lang="ts">
import { useBackendStore, type User } from '@/stores/backend'
import AccountListItem from '@/components/AccountListItem.vue'
import { mdiPlus, mdiAccountCancel, mdiAccountQuestion } from '@mdi/js'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const backend = useBackendStore()
const router = useRouter()
const { users: allUsers } = storeToRefs(backend)
const users = computed(() => {
  return Object.entries(allUsers.value)
    .map((x) => x[1])
    .filter((user) => user !== null)
})
function isAt(username: string) {
  return router.currentRoute.value.path === `/users/@${username}`
}

function notMe(u: User) {
  return backend.me === null || u.username != backend.me.username
}
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list nav density="compact">
      <template v-if="backend.me !== null">
        <v-list-subheader stiky>Me</v-list-subheader>
        <AccountListItem :user="backend.me" :active="isAt(backend.me.username)"></AccountListItem>
        <v-divider></v-divider>
      </template>
      <v-list-subheader stiky>Admins</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="notMe(user) && user.verified && !user.banned && user.admin"
          :user="user"
          :active="isAt(user.username)"
        ></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader stiky>Users</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="notMe(user) && user.verified && !user.banned && !user.admin"
          :user="user"
          :active="isAt(user.username)"
        ></AccountListItem>
      </template>
      <v-list-item
        v-if="backend.me !== null && backend.me.admin"
        title="New account"
        :prepend-icon="mdiPlus"
        :active="router.currentRoute.value.path === '/users/new'"
        @click="router.push('/users/new')"
      ></v-list-item>
      <template v-if="backend.me !== null">
        <v-divider></v-divider>
        <v-list-subheader stiky>Non-members</v-list-subheader>
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
              :active="isAt(user.username)"
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
              :active="isAt(user.username)"
            ></AccountListItem>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>

  <router-view></router-view>
</template>

<style scoped></style>
