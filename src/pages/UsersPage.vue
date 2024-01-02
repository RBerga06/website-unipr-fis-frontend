<script setup lang="ts">
import { useBackendStore, type User } from '@/stores/backend'
import AccountListItem from '@/components/AccountListItem.vue'
import { mdiPlus, mdiAccountCancel, mdiAccountQuestion } from '@mdi/js'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AccountSummary from '@/components/AccountSummary.vue'

const props = withDefaults(defineProps<{ username: string | null }>(), { username: null })
const backend = useBackendStore()
const router = useRouter()
const { users: allUsers } = storeToRefs(backend)
const users = computed(() => {
  return Object.entries(allUsers.value)
    .map((x) => x[1])
    .filter((user) => user !== null)
})
const username_ = computed(() =>
  props.username === null ? (backend.me === null ? null : backend.me.username) : props.username
)
const user = computed(() => {
  if (props.username !== null && props.username in allUsers.value) {
    return allUsers.value[props.username]
  } else if (backend.me !== null) {
    router.replace(`/users/${backend.me.username}`)
    return backend.me
  } else {
    return null
  }
})

function notMe(u: User) {
  return backend.me === null || u.username != backend.me.username
}

if (backend.me === null) {
  console.log('/users: me is null - everything ok')
} else {
  console.log('/users: me is not null - redirecting to my user page')
  router.replace(`/users/${backend.me.username}`)
}
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list nav density="compact">
      <template v-if="backend.me !== null">
        <v-list-subheader stiky>Me</v-list-subheader>
        <AccountListItem
          :user="backend.me"
          :active="backend.me.username == username_"
        ></AccountListItem>
        <v-divider></v-divider>
      </template>
      <v-list-subheader stiky>Admins</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="notMe(user) && user.verified && !user.banned && user.admin"
          :user="user"
          :active="user.username == username_"
        ></AccountListItem>
      </template>
      <v-divider></v-divider>
      <v-list-subheader stiky>Users</v-list-subheader>
      <template v-for="user in users" :key="user.username">
        <AccountListItem
          v-if="notMe(user) && user.verified && !user.banned && !user.admin"
          :user="user"
          :active="user.username == username_"
        ></AccountListItem>
      </template>
      <v-list-item
        v-if="backend.me !== null && backend.me.admin"
        title="New account"
        :prepend-icon="mdiPlus"
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

  <v-col v-if="username !== null">
    <AccountSummary :user="user"></AccountSummary>
  </v-col>
</template>

<style scoped></style>
