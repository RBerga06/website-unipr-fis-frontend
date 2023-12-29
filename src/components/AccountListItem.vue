<script setup lang="ts">
import { type User } from '@/stores/backend'
import { useRouter } from 'vue-router'
import AccountAvatar from './AccountAvatar.vue'

const props = withDefaults(
  defineProps<{
    username: string | null
    me: boolean
    watch: boolean
  }>(),
  { username: null, me: false, watch: false }
)
const emit = defineEmits<{
  'update:user': [user: User | null]
}>()
const user = defineModel<User | null>('user', { default: null })

const router = useRouter()

function clicked() {
  const _username = props.username !== null ? props.username : user.value?.username
  if (_username !== null) router.push(`/users/${_username}`)
}
</script>

<template>
  <v-list-item :link="user !== null" @click.stop="clicked">
    <template #prepend
      ><AccountAvatar
        v-model:user="user"
        :username="username"
        :me="me"
        :watch="watch"
        density="compact"
      ></AccountAvatar
    ></template>
    {{ user === null ? 'Anonymous' : user.username }}
  </v-list-item>
</template>

<style scoped></style>
