<script setup lang="ts">
import { useBackendStore, type User } from '@/stores/backend'
import AccountAvatar from '@/components/AccountAvatar.vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { mdiCheck, mdiCancel, mdiDelete } from '@mdi/js'

const props = defineProps<{
  user: User | null
}>()
const backend = useBackendStore()
const { me } = storeToRefs(backend)
const status = computed(() =>
  props.user?.admin
    ? 'Admin'
    : props.user?.verified
      ? 'Verified'
      : props.user?.banned
        ? 'Banned'
        : 'Not verified'
)

async function setVerified(verified: boolean) {
  if (props.user === null) return
  backend.api.get(`/users/@${props.user.username}/edit?verified=${verified}`)
}
async function setBanned(banned: boolean) {
  if (props.user === null) return
  backend.api.get(`/users/@${props.user.username}/edit?banned=${banned}`)
}
async function delUser() {
  if (props.user === null) return
  console.log('del', props.user.username)
  const _username = props.user.username
  backend.api.post(`/users/@${_username}/del`)
}
</script>

<template>
  <v-card :title="user === null ? 'Anonymous' : user.username" :subtitle="status">
    <template #prepend>
      <AccountAvatar :user="user" size="x-large"></AccountAvatar>
    </template>
    <v-card-actions
      v-if="
        me !== null && user !== null && me.admin && !user.admin && user.username !== me.username
      "
    >
      <v-btn v-if="!user.verified" color="success" @click.stop="setVerified(true)"
        >Verify <v-icon end :icon="mdiCheck"></v-icon
      ></v-btn>
      <v-btn v-if="!user.banned" color="error" @click.stop="setBanned(true)"
        >Block<v-icon end :icon="mdiCancel"></v-icon
      ></v-btn>
      <v-btn v-else color="error" @click.stop="setBanned(false)"
        >Unblock<v-icon end :icon="mdiCancel"></v-icon
      ></v-btn>
      <v-btn v-if="user.banned" color="error" @click.stop="delUser"
        >Delete<v-icon end :icon="mdiDelete"></v-icon
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
