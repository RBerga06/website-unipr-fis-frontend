/* Interface with the backend /*/
import { defineStore } from 'pinia'
import axios from 'axios'

export interface Token {
  access_token: string
  token_type: string
}

export interface User {
  username: string
  is_admin: boolean
  verified: boolean
}

export const useBackendStore = defineStore('backend', {
  state: () => ({
    api: axios.create({
      baseURL: 'http://127.0.0.1:8000/'
    }),
    token: null as Token | null,
    me: null as User | null
  }),
  actions: {
    login(token: Token) {
      this.token = token
      this.api.defaults.headers.common.Authorization = `${token.token_type} ${token.access_token}`
      this.api.get('/users/me').then((response) => {
        this.me = response.data as User
      })
    },
    logout() {
      this.token = null
      this.me = null
      this.api.defaults.headers.common.Authorization = null
    }
  }
})
