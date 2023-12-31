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
    (Date.now() - Date.parse(user.last_seen)) / 1000 <= 120
  )
}

export const useBackendStore = defineStore('backend', {
  state: () => ({
    api: axios.create({
      baseURL: 'http://127.0.0.1:8000/'
    }),
    token: null as Token | null,
    me: null as User | null,
    users: {} as { [id: string]: User },
    _refreshId: null as number | null
  }),
  actions: {
    /* User 'watching' */
    async refresh() {
      // Update the state of all users (`me` included)
      await this.api.get('/users/').then((response) => {
        this.users = response.data as { [id: string]: User }
        if (this.me !== null) {
          this.me = this.token === null ? null : this.users[this.me.username]
        }
      })
    },
    start() {
      if (this._refreshId !== null) return
      this._refreshId = setInterval(this.refresh, 1000)
    },
    stop() {
      if (this._refreshId !== null) clearInterval(this._refreshId)
    },

    /* User last_seen=... state */
    async interact() {
      /// Essentially, me.last_seen = now()
      if (this.me === null) return
      await this.api.get(`users/me/edit?last_seen=${new Date().toISOString()}`).then((response) => {
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
    },

    /* Restore - to be called once, in App::onMount */
    restore() {
      this._refreshId = null
      this.authsync()
    }
  },
  persist: true
})
