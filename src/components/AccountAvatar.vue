<script setup lang="ts">
import {
  mdiAccount,
  mdiAccountCancel,
  mdiAccountQuestion,
  mdiAccountTie,
  mdiIncognito
} from '@mdi/js'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { type User, isonline } from '@/stores/backend'

const props = withDefaults(
  defineProps<{
    user: User | null
    size: string | number | undefined
  }>(),
  { size: undefined }
)

const online = ref(false)
const refreshId = ref<number | null>(null)

onMounted(() => {
  refreshId.value = setInterval(() => {
    online.value = isonline(props.user)
  }, 1000) // Update every second
})
onUnmounted(() => {
  if (refreshId.value !== null) clearInterval(refreshId.value)
})

const icon = computed(() => {
  return props.user === null
    ? mdiIncognito
    : props.user.admin
      ? mdiAccountTie
      : props.user.banned
        ? mdiAccountCancel
        : props.user.verified
          ? mdiAccount
          : mdiAccountQuestion
})
</script>
<template>
  <v-avatar variant="text" :size="size">
    <v-badge v-if="online" dot bordered color="success" location="bottom end">
      <v-icon :icon="icon" :size="size"></v-icon>
    </v-badge>
    <v-icon v-else :icon="icon" :size="size"></v-icon>
  </v-avatar>
</template>
<style scoped></style>
