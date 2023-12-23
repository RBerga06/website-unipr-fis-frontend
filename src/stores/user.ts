import { defineStore } from 'pinia'

export interface Token {
  token: string
  type: string
}

export interface User {
  username: string
  hashed_password: string
  verified: boolean
  is_admin: boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null as Token | null
  }),
  actions: {
    logout() {
      this.token = null
    }
  }
})
