<template>
  <div class="dashboard">
    <h1>MCT Dashboard</h1>
    
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Current MCT</div>
        <div class="stat-value">{{ formatTime(mctStore.currentMCT) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Products</div>
        <div class="stat-value">{{ productStore.products.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Operations</div>
        <div class="stat-value">{{ operationStore.operations.length }}</div>
      </div>
    </div>

    <div class="card">
      <h2>MCT Breakdown</h2>
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>

    <div class="card">
      <h2>Recent Products</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Operations</th>
              <th>MCT (days)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in recentProducts" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.operationCount }}</td>
              <td>{{ (product.mct / (24 * 60 * 60)).toFixed(1) }}</td>
              <td>{{ product.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useMCTStore } from '@/stores/mct'
import { useProductStore } from '@/stores/product'
import { useOperationStore } from '@/stores/operation'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  name: 'DashboardView',
  components: { Bar },

  setup() {
    const mctStore = useMCTStore()
    const productStore = useProductStore()
    const operationStore = useOperationStore()

    const chartData = computed(() => ({
      labels: ['Queue Time', 'Setup Time', 'Process Time', 'Wait Time'],
      datasets: [{
        label: 'Time Distribution (hours)',
        data: mctStore.timeDistribution,
        backgroundColor: [
          'rgba(249, 168, 37, 0.8)',
          'rgba(198, 40, 40, 0.8)',
          'rgba(25, 25, 26, 0.8)',
          'rgba(158, 158, 158, 0.8)'
        ]
      }]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

    const recentProducts = computed(() => 
      productStore.products
        .slice(0, 5)
        .map(p => ({
          ...p,
          operationCount: operationStore.getProductOperations(p.id).length,
          mct: mctStore.calculateProductMCT(p.id)
        }))
    )

    const formatTime = (seconds) => {
      const days = Math.floor(seconds / (24 * 60 * 60))
      const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600)
      return `${days}d ${hours}h`
    }

    return {
      mctStore,
      productStore,
      operationStore,
      chartData,
      chartOptions,
      recentProducts,
      formatTime
    }
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-label {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-top: 5px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  margin-top: 0;
  color: var(--color-primary);
}
</style>
