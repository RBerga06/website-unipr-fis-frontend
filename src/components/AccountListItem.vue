<script setup lang="ts">
import { userIcon, type User } from '@/stores/backend'
import { useRouter } from 'vue-router'

const props = defineProps<{
  user: User | null
}>()

const router = useRouter()

function clicked() {
  if (props.user !== null) router.push(`/users/${props.user.username}`)
}
</script>

<template>
  <v-list-item :link="user !== null" :prepend-icon="userIcon(user)" @click.stop="clicked">
    {{ user === null ? '[anonymous]' : user.username }}
  </v-list-item>
</template>

<style scoped></style>
