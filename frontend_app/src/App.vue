<template>
  <div class="app-container">
    <SidebarNav />
    <main class="main-content" aria-live="polite">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import SidebarNav from '@/components/Sidebar.vue'

export default defineComponent({
  name: 'App',
  components: {
    SidebarNav
  }
})
</script>

<style>
@import './assets/styles/main.css';
</style>
