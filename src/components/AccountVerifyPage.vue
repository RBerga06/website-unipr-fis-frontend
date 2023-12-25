<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBackendStore, type User } from '@/stores/backend'
import type { AxiosError } from 'axios'
import type { VTextField } from 'vuetify/components'
import { mdiEye, mdiEyeOff } from '@mdi/js'

const backend = useBackendStore()
const router = useRouter()
const loading = ref(false)

const showPasscode = ref(false)
const passcode = ref('')
const error = ref('')

const rules = {
  required: (value: any) => !!value || 'Field is required',
  error: (_: any) => {
    if (error.value == '') {
      return true
    }
    const err = error.value
    error.value = ''
    return err
  }
}
const textField = ref<VTextField | null>(null)

async function verify() {
  // OAuth2-like request
  const response = await backend.api
    .post(
      '/users/me/verify',
      new URLSearchParams({
        username: 'passcode',
        password: passcode.value
      })
    )
    .catch((_: AxiosError) => {
      console.log('An error occurred!')
      error.value = 'Bad passcode.'
      textField.value?.validate()
    })
  if (response) {
    console.log('Response data is', response.data)
    // Save the verified user
    backend.me = response.data as User
    // Redirect to previous page
    router.back()
  }
}

async function submit() {
  if (!passcode.value) return
  loading.value = true
  await verify()
  loading.value = false
}

if (backend.me === null) {
  console.log('/verify: me is null :( - redirecting to login page!')
  router.replace('/login')
} else if (backend.me.verified) {
  console.log('/verify: me is already verified - redirecting to previous page')
  router.back()
} else {
  console.log('/verify: me is not yet verified - everything ok')
}
</script>

<template>
  <v-container fluid fill-height style="max-width: 500px">
    <v-col>
      <v-form @submit.prevent="submit">
        <v-text-field
          ref="textField"
          label="Passcode"
          :append-inner-icon="showPasscode ? mdiEye : mdiEyeOff"
          :type="showPasscode ? 'text' : 'password'"
          :rules="[rules.required, rules.error]"
          v-model="passcode"
          @click:append-inner="showPasscode = !showPasscode"
        ></v-text-field>
        <v-btn block variant="elevated" type="submit" color="primary" :loading="loading"
          >Verify</v-btn
        >
      </v-form>
    </v-col>
  </v-container>
</template>

<style scoped></style>
