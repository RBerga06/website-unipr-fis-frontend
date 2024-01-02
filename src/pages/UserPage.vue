<script setup lang="ts">
import { useBackendStore, type User } from '@/stores/backend'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AccountSummary from '@/components/AccountSummary.vue'

const props = withDefaults(defineProps<{ username: string | null }>(), { username: null })
const backend = useBackendStore()
const { users: allUsers } = storeToRefs(backend)
const router = useRouter()
const user = computed(() => {
  if (props.username !== null && props.username in allUsers.value) {
    return allUsers.value[props.username]
  } else {
    router.replace('/users/me')
    return backend.me
  }
})
</script>

<template>
  <v-col v-if="username !== null">
    <AccountSummary :user="user"></AccountSummary>
  </v-col>
</template>

<style scoped></style>
