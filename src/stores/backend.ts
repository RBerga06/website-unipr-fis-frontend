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
  readonly last_seen: string | null
}

export function isonline(user: User | null) {
  return (
    user !== null &&
    user.last_seen !== null &&
    (Date.now() - new Date(user.last_seen).getDate()) / 1000 <= 120
  )
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
    /* User last_seen=... state */
    async interact() {
      /// Essentially, me.last_seen = now()
      if (this.me === null) return
      await this.api.get(`users/me/edit?last_seen=${Date.now()}`).then((response) => {
        this.me = response.data as User
      })
    },

    /* OAuth stuff (login, logout) */
    authsync() {
      if (this.token === null) {
        this.api.defaults.headers.common.Authorization = null
      } else {
        this.api.defaults.headers.common.Authorization = `${this.token.token_type} ${this.token.access_token}`
      }
    },
    async login(token: Token) {
      this.token = token
      this.authsync()
      await this.api.get('/users/me').then((response) => {
        this.me = response.data as User
      })
    },
    async logout() {
      this.token = null
      this.authsync()
      this.me = null
    }
  },
  persist: true
})
