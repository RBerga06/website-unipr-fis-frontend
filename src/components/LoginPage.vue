<script setup lang="ts">
import { ref } from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import type { VTextField } from 'vuetify/components'
import { useApiStore } from '@/stores/api'

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
  }
}
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const pwdConfirmTextField = ref<VTextField | null>(null)
const loading = ref(false)

const username = ref<string>('')
const password = ref<string>('')

async function submit() {
  if (!username.value || !password.value) return
  loading.value = true
  console.log('Submit!')
  console.log({ username: username.value, password: password.value })
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
        <v-text-field label="Username" :rules="[rules.required]" v-model="username"></v-text-field>
        <v-text-field
          label="Password"
          :append-inner-icon="showPassword ? mdiEye : mdiEyeOff"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.pwdmatchvalidate]"
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
              @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
            ></v-text-field>
          </v-window-item>
        </v-window>
        <v-btn block variant="elevated" type="submit" color="primary" :loading="loading">{{
          tabId === 0 ? 'Login' : 'Sign Up'
        }}</v-btn>
      </v-form>
    </v-col>
  </v-container>
</template>

<style scoped></style>
