import { defineStore } from 'pinia'
import { authService } from '../services/auth'



export const useAuthStore = defineStore('auth', {
    state: () => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }),
    actions: {
        async login(username, password) {
          this.loading = true
          this.error = null
          
          try {
            const response = await authService.login(username, password)
            console.log(response)
            if (response[0].nombre !== '') { 
              this.user = username
              this.isAuthenticated = true
              
              // Guardar en localStorage
              localStorage.setItem('user', JSON.stringify(username))
              localStorage.setItem('isAuthenticated', 'true')
              
              return true
            } else {
              throw new Error(response.message || 'Error de autenticación')
            }
          } catch (error) {
            this.error = error.message
            throw error
          } finally {
            this.loading = false
          }
        },
    
        logout() {
          this.user = null
          this.isAuthenticated = false
          
          // Limpiar localStorage
          localStorage.removeItem('user')
          localStorage.removeItem('isAuthenticated')
        },
    
        checkAuth() {
          const user = localStorage.getItem('user')
          const isAuthenticated = localStorage.getItem('isAuthenticated')
          
          if (user && isAuthenticated) {
            this.user = JSON.parse(user)
            this.isAuthenticated = true
          }
        }
      },
    
      getters: {
        currentUser: (state) => state.user,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
      }
    })