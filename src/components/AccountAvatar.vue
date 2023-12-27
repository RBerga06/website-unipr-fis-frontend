<script setup lang="ts">
import { type User } from '@/stores/backend'
import {
  mdiAccount,
  mdiAccountCancel,
  mdiAccountQuestion,
  mdiAccountTie,
  mdiIncognito
} from '@mdi/js'
import { computed } from 'vue'

const props = defineProps<{
  user: User | null
}>()

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
  <v-avatar variant="text">
    <v-badge v-if="user?.online" dot bordered color="success" location="bottom end">
      <v-icon :icon="icon"></v-icon>
    </v-badge>
    <v-icon v-else :icon="icon"></v-icon>
  </v-avatar>
</template>
<style scoped></style>
