<script setup lang="ts">
import { useBackendStore, type User } from '@/stores/backend'
import { ref, onMounted, onUnmounted } from 'vue'
import AccountSummary from './AccountSummary.vue'

const props = defineProps<{
  username: string | null
}>()

const backend = useBackendStore()
const user = ref<User | null>(null)
const refresh = ref<number | null>(null)
onMounted(() => {
  refresh.value = setInterval(() => {
    if (props.username === null) {
      user.value = null
      return
    }
    backend.api
      .get(`/users/@${props.username}`)
      .catch((_) => {
        user.value = null
      })
      .then((response) => {
        if (response) {
          user.value = response.data as User
        }
      })
  }, 1000) // Update every second
})
onUnmounted(() => {
  if (refresh.value !== null) clearInterval(refresh.value)
})
</script>

<template>
  <AccountSummary :user="user"></AccountSummary>
</template>

<style scoped></style>
