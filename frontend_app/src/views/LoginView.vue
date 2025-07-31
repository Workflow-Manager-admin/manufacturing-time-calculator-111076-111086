<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username"
            v-model="form.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password"
            v-model="form.password"
            required
          />
        </div>
        <button 
          type="submit" 
          class="btn" 
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'LoginView',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref(false)
    const error = ref('')
    const form = ref({
      username: '',
      password: ''
    })

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        await authStore.login(form.value)
        router.push('/')
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.error {
  color: var(--color-accent);
  margin-top: 1rem;
  text-align: center;
}
</style>
