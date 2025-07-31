import { defineStore } from 'pinia'

export const useOperationStore = defineStore('operation', {
  state: () => ({
    operations: []
  }),

  getters: {
    getProductOperations: (state) => (productId) => 
      state.operations.filter(op => op.productId === productId),
  },

  actions: {
    addOperation(operation) {
      this.operations.push({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...operation
      })
    },

    updateOperation(id, updates) {
      const index = this.operations.findIndex(op => op.id === id)
      if (index !== -1) {
        this.operations[index] = { ...this.operations[index], ...updates }
      }
    },

    deleteOperation(id) {
      const index = this.operations.findIndex(op => op.id === id)
      if (index !== -1) {
        this.operations.splice(index, 1)
      }
    }
  }
})
