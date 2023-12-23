import { defineStore } from 'pinia'
import axios from 'axios'

export const useApiStore = defineStore('api', () => {
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/'
  })
  return { api }
})
