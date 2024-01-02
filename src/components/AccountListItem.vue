<script setup lang="ts">
import { type User } from '@/stores/backend'
import { useRouter } from 'vue-router'
import AccountAvatar from './AccountAvatar.vue'

const props = defineProps<{
  user: User | null
}>()

const router = useRouter()

function clicked() {
  if (props.user !== null) router.push(`/users/@${props.user.username}`)
}
</script>

<template>
  <v-list-item :link="user !== null" @click.stop="clicked">
    <template #prepend><AccountAvatar :user="user" density="compact"></AccountAvatar></template>
    {{ user === null ? 'Anonymous' : user.username }}
  </v-list-item>
</template>

<style scoped></style>
