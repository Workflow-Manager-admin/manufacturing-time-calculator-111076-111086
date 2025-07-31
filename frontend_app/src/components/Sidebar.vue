<template>
  <aside class="sidebar">
    <div class="logo">MCT<span class="accent-text">app</span></div>
    <nav>
      <router-link to="/" exact>Dashboard</router-link>
      <router-link to="/product">Product</router-link>
      <router-link to="/operations">Operations</router-link>
      <router-link to="/reports">Reports</router-link>
    </nav>
    <div class="sidebar-footer">
      <span class="accent-text">QRM</span> MCT Calculator
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>
  </aside>
</template>

<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      handleLogout
    }
  }
})
</script>

<style scoped>
.accent-text {
  color: var(--color-accent);
  font-weight: bold;
}

.logout-btn {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: var(--color-secondary);
  color: var(--color-primary);
}
</style>
