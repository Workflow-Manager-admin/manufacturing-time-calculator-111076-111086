import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: []
  }),

  actions: {
    addProduct(product) {
      this.products.push({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'Active',
        ...product
      })
    },

    updateProduct(id, updates) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updates }
      }
    },

    deleteProduct(id) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products.splice(index, 1)
      }
    }
  }
})
