<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBackendStore } from '@/stores/backend'

const backend = useBackendStore()
const router = useRouter()
const loading = ref(false)

async function logout() {
  loading.value = true
  await backend.logout()
  loading.value = false
  router.back()
}
</script>

<template>
  <v-container fluid fill-height style="max-width: 500px">
    <v-col>
      <v-form @submit.prevent="logout">
        <v-btn block variant="elevated" type="submit" color="primary" :loading="loading"
          >Logout</v-btn
        >
      </v-form>
    </v-col>
  </v-container>
</template>

<style scoped></style>
