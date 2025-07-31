import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('mct-user')) || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  
  actions: {
    async login(credentials) {
      // Demo authentication - replace with actual authentication logic
      if (credentials.username && credentials.password) {
        const user = { username: credentials.username }
        localStorage.setItem('mct-user', JSON.stringify(user))
        this.user = user
        return user
      }
      throw new Error('Invalid credentials')
    },
    
    logout() {
      localStorage.removeItem('mct-user')
      this.user = null
    }
  }
})
