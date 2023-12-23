<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import type { VTextField } from 'vuetify/components'
import type { AxiosError } from 'axios'
import { useApiStore } from '@/stores/api'
import { useUserStore, type Token } from '@/stores/user'

const api = useApiStore()
const user = useUserStore()
const router = useRouter()

const loginerr = ref('')
const loginerrcounter = ref<0 | 1 | 2>(0)
const tabId = ref(0)
const tabs = ref([
  { id: 0, title: 'Login' },
  { id: 1, title: 'Sign Up' }
])
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

async function login() {
  // OAuth2 Login
  const response = await api.api
    .post(
      '/token',
      new URLSearchParams({
        username: username.value,
        password: password.value
      })
    )
    .catch((_: AxiosError) => {
      loginerr.value = 'Unknown username or bad password'
      loginerrcounter.value = 2
      userTextField.value?.validate()
      pwdTextField.value?.validate()
    })
  if (response) {
    // Store the token
    user.token = response.data as Token
    // Redirect to previous page
    router.back()
  }
}

async function signup() {
  // Create a new account
  const response = await api.api
    .post(
      '/user/new',
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
    // Log in the new user
    await login()
  }
}

async function submit() {
  if (!username.value || !password.value) return
  if (!!tabId.value && password.value != passwordConfirm.value) return
  loading.value = true
  if (tabId.value) {
    // Create the new user
    await signup()
  } else {
    // Log in the user
    await login()
  }
  loading.value = false
}
</script>

<template>
  <v-container fluid fill-height style="max-width: 500px">
    <v-col>
      <v-tabs v-model="tabId" align-tabs="center" fixed-tabs>
        <v-tab v-for="tab of tabs" :key="tab.id">{{ tab.title }}</v-tab>
      </v-tabs>
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
        <v-window v-model="tabId">
          <v-window-item value="0"></v-window-item>
          <v-window-item value="1">
            <v-text-field
              ref="pwdConfirmTextField"
              label="Confirm Password"
              :append-inner-icon="showPasswordConfirm ? mdiEye : mdiEyeOff"
              :type="showPasswordConfirm ? 'text' : 'password'"
              :rules="[rules.required, rules.pwdmatch]"
              v-model="passwordConfirm"
              @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
            ></v-text-field>
          </v-window-item>
        </v-window>
        <v-btn block variant="elevated" type="submit" color="primary" :loading="loading">{{
          tabId ? 'Sign Up' : 'Login'
        }}</v-btn>
      </v-form>
    </v-col>
  </v-container>
</template>

<style scoped></style>
