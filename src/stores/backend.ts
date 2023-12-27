/* Interface with the backend /*/
import { defineStore } from 'pinia'
import axios from 'axios'

export interface Token {
  access_token: string
  token_type: string
}

export interface User {
  readonly username: string
  readonly admin: boolean
  readonly banned: boolean
  readonly verified: boolean
  readonly online: boolean
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
    async login(token: Token) {
      this.token = token
      this.api.defaults.headers.common.Authorization = `${token.token_type} ${token.access_token}`
      await this.api.get('/users/me').then((response) => {
        this.me = response.data as User
      })
      await this.online()
    },
    logout() {
      this.token = null
      this.me = null
      this.api.defaults.headers.common.Authorization = null
    },
    async online(online: boolean = true) {
      if (this.me === null) return
      await this.api.get(`/users/me/edit?online=${online}`).then((response) => {
        this.me = response.data as User
      })
    },
    async offline(offline: boolean = true) {
      this.online(!offline)
    }
  },
  persist: true
})
