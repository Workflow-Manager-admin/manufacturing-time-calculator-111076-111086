import { defineStore } from 'pinia'
import { useOperationStore } from './operation'

export const useMCTStore = defineStore('mct', {
  state: () => ({
    timeDistribution: [0, 0, 0, 0] // Queue, Setup, Process, Wait times
  }),

  getters: {
    currentMCT: (state) => 
      state.timeDistribution.reduce((sum, time) => sum + time, 0),
  },

  actions: {
    calculateProductMCT(productId) {
      const operationStore = useOperationStore()
      const operations = operationStore.getProductOperations(productId)
      
      let totalTime = 0
      operations.forEach(op => {
        totalTime += op.queueTime + op.setupTime + op.processTime + op.waitTime
      })
      
      return totalTime
    },

    updateTimeDistribution(operations) {
      this.timeDistribution = [
        operations.reduce((sum, op) => sum + op.queueTime, 0),
        operations.reduce((sum, op) => sum + op.setupTime, 0),
        operations.reduce((sum, op) => sum + op.processTime, 0),
        operations.reduce((sum, op) => sum + op.waitTime, 0)
      ]
    }
  }
})
