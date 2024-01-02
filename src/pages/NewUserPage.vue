<script setup lang="ts">
import { ref } from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import type { VTextField } from 'vuetify/components'
import type { AxiosError } from 'axios'
import { useBackendStore } from '@/stores/backend'

const backend = useBackendStore()

const loginerr = ref('')
const loginerrcounter = ref<0 | 1 | 2>(0)
const rules = {
  required: (value: any) => !!value || 'Field is required',
  pwdmatch: (value: any) => value === password.value || 'Passwords do not match',
  pwdmatchvalidate: (_: any) => {
    pwdConfirmTextField.value?.validate()
    return true
  },
  loginerr: (_: any) => {
    if (!loginerrcounter.value) {
      return true
    }
    loginerrcounter.value--
    return loginerr.value
  }
}
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const userTextField = ref<VTextField | null>(null)
const pwdTextField = ref<VTextField | null>(null)
const pwdConfirmTextField = ref<VTextField | null>(null)
const loading = ref(false)

const username = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const verify = ref<boolean>(true)

async function signup() {
  const response = await backend.api
    .post(
      '/users/create/token',
      new URLSearchParams({
        username: username.value,
        password: password.value
      })
    )
    .catch((_: AxiosError) => {
      loginerr.value = 'Unavailable username'
      loginerrcounter.value = 1
      userTextField.value?.validate()
    })
  if (response) {
    if (verify.value) {
      await backend.api.get(`/users/@${username.value}/edit?verified=true`)
    }
  }
}

async function submit() {
  if (!username.value || !password.value) return
  if (password.value != passwordConfirm.value) return
  loading.value = true
  await signup()
  loading.value = false
}
</script>

<template>
  <v-container fluid fill-height style="max-width: 500px">
    <v-col>
      <v-container><v-spacer></v-spacer></v-container>
      <v-form @submit.prevent="submit">
        <v-text-field
          ref="userTextField"
          label="Username"
          :rules="[rules.required, rules.loginerr]"
          v-model="username"
        ></v-text-field>
        <v-text-field
          ref="pwdTextField"
          label="Password"
          :append-inner-icon="showPassword ? mdiEye : mdiEyeOff"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.pwdmatchvalidate, rules.loginerr]"
          v-model="password"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          ref="pwdConfirmTextField"
          label="Confirm Password"
          :append-inner-icon="showPasswordConfirm ? mdiEye : mdiEyeOff"
          :type="showPasswordConfirm ? 'text' : 'password'"
          :rules="[rules.required, rules.pwdmatch]"
          v-model="passwordConfirm"
          @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
        ></v-text-field>
        <v-checkbox label="Mark as verified" v-model="verify"></v-checkbox>
        <v-btn block variant="elevated" type="submit" color="primary" :loading="loading"
          >Create</v-btn
        >
      </v-form>
    </v-col>
  </v-container>
</template>

<style scoped></style>
