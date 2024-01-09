<script setup lang="ts">
import { useBackendStore } from '@/stores/backend'
import { useRouter } from 'vue-router'

const backend = useBackendStore()
const router = useRouter()

if (backend.me !== null) {
  router.replace(`/users/@${backend.me.username}`)
}
</script>
<template>
  <div>
    <v-col>
      <h1>This is our Community!</h1>
      <p>Please select a user in the left drawer to get started.</p>
    </v-col>
  </div>
</template>
