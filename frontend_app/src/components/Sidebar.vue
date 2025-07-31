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
    </div>
  </aside>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarNav',
})
</script>

<style scoped>
.accent-text {
  color: var(--color-accent);
  font-weight: bold;
}
</style>
