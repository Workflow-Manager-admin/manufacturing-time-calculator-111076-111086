<template>
  <div class="app-container">
    <Sidebar v-if="authStore.isAuthenticated" />
    <main class="main-content" aria-live="polite">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/Sidebar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Sidebar
  },
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  }
})
</script>

<style>
@import './assets/styles/main.css';
</style>
