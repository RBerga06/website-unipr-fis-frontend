<script setup lang="ts">
import {
  mdiAccount,
  mdiAccountCancel,
  mdiAccountQuestion,
  mdiAccountTie,
  mdiIncognito
} from '@mdi/js'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { type User, isonline, useBackendStore } from '@/stores/backend'

const props = withDefaults(
  defineProps<{
    username: string | null
    me: boolean
    watch: boolean
  }>(),
  { username: null, me: false, watch: false }
)
const user = defineModel<User | null>('user', { default: null })

const online = ref(false)

const backend = useBackendStore()

const refreshId = ref<number | null>(null)

async function refresh() {
  if (props.watch) {
    const _username = props.username === null ? user.value?.username : props.username
    if (props.me) {
      if (backend.me !== null) {
        // Update the user v-model
        await backend.api
          .get(`/users/me`)
          .catch((_) => {
            user.value = null
          })
          .then((response) => {
            if (response) {
              user.value = response.data as User
            }
          })
      }
    } else if (_username !== null) {
      // Update the user v-model
      await backend.api.get(`/users/@${_username}`).then((response) => {
        user.value = response.data as User
      })
    }
  }
  // Update the `online` ref
  online.value = isonline(user.value)
}

onMounted(() => {
  refreshId.value = setInterval(refresh, 1000) // Update every second
})
onUnmounted(() => {
  if (refreshId.value !== null) clearInterval(refreshId.value)
})

const icon = computed(() => {
  return user.value === null
    ? mdiIncognito
    : user.value.admin
      ? mdiAccountTie
      : user.value.banned
        ? mdiAccountCancel
        : user.value.verified
          ? mdiAccount
          : mdiAccountQuestion
})
</script>
<template>
  <v-avatar variant="text">
    <v-badge v-if="online" dot bordered color="success" location="bottom end">
      <v-icon :icon="icon"></v-icon>
    </v-badge>
    <v-icon v-else :icon="icon"></v-icon>
  </v-avatar>
</template>
<style scoped></style>
