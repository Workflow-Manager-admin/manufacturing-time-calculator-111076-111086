<template>
  <div class="reports">
    <h1>MCT Reports</h1>
    
    <div class="card">
      <h2>Generate Reports</h2>
      <div class="report-options">
        <div class="report-type">
          <h3>MCT Summary Report</h3>
          <p>Overall MCT metrics and time distribution analysis</p>
          <button class="btn" @click="generateMCTReport">
            Download Summary
          </button>
        </div>

        <div class="report-type">
          <h3>Product-wise MCT Report</h3>
          <p>Detailed MCT breakdown by product</p>
          <button class="btn" @click="generateProductReport">
            Download Product Report
          </button>
        </div>

        <div class="report-type">
          <h3>Work Center Analysis</h3>
          <p>Operation times and efficiency by work center</p>
          <button class="btn" @click="generateWorkCenterReport">
            Download Analysis
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Recent Reports</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated On</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in recentReports" :key="report.id">
              <td>{{ report.name }}</td>
              <td>{{ formatDate(report.date) }}</td>
              <td>{{ report.type }}</td>
              <td>
                <button 
                  class="btn-icon" 
                  @click="downloadReport(report)"
                >
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import { useOperationStore } from '@/stores/operation'
import { useMCTStore } from '@/stores/mct'

export default defineComponent({
  name: 'ReportsView',

  setup() {
    const productStore = useProductStore()
    const operationStore = useOperationStore()
    const mctStore = useMCTStore()

    const recentReports = ref([
      // Sample data - in real app, this would come from backend
      {
        id: 1,
        name: 'MCT Summary Report',
        date: new Date(),
        type: 'Summary'
      },
      {
        id: 2,
        name: 'Product MCT Analysis',
        date: new Date(),
        type: 'Product'
      }
    ])

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const generateCSV = (data) => {
      const csvContent = "data:text/csv;charset=utf-8," + data
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "report.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const generateMCTReport = () => {
      const timeDistribution = mctStore.timeDistribution
      const totalMCT = mctStore.currentMCT

      const data = [
        ['MCT Component', 'Time (hours)'],
        ['Queue Time', timeDistribution[0]],
        ['Setup Time', timeDistribution[1]],
        ['Process Time', timeDistribution[2]],
        ['Wait Time', timeDistribution[3]],
        ['Total MCT', totalMCT]
      ]

      generateCSV(data.map(row => row.join(',')).join('\n'))
    }

    const generateProductReport = () => {
      const products = productStore.products
      const data = [
        ['Product', 'Category', 'Operations', 'Total MCT (hours)']
      ]

      products.forEach(product => {
        const operations = operationStore.getProductOperations(product.id)
        const mct = mctStore.calculateProductMCT(product.id)
        data.push([
          product.name,
          product.category,
          operations.length,
          mct
        ])
      })

      generateCSV(data.map(row => row.join(',')).join('\n'))
    }

    const generateWorkCenterReport = () => {
      const operations = operationStore.operations
      const workCenters = {}

      operations.forEach(op => {
        if (!workCenters[op.workCenter]) {
          workCenters[op.workCenter] = {
            totalTime: 0,
            operationCount: 0
          }
        }
        workCenters[op.workCenter].totalTime += 
          op.queueTime + op.setupTime + op.processTime + op.waitTime
        workCenters[op.workCenter].operationCount++
      })

      const data = [
        ['Work Center', 'Operation Count', 'Total Time (hours)', 'Avg Time per Operation']
      ]

      Object.entries(workCenters).forEach(([center, stats]) => {
        data.push([
          center,
          stats.operationCount,
          stats.totalTime,
          (stats.totalTime / stats.operationCount).toFixed(2)
        ])
      })

      generateCSV(data.map(row => row.join(',')).join('\n'))
    }

    const downloadReport = (report) => {
      switch (report.type) {
        case 'Summary':
          generateMCTReport()
          break
        case 'Product':
          generateProductReport()
          break
        default:
          generateWorkCenterReport()
      }
    }

    return {
      recentReports,
      formatDate,
      generateMCTReport,
      generateProductReport,
      generateWorkCenterReport,
      downloadReport
    }
  }
})
</script>

<style scoped>
.reports {
  padding: 20px;
}

.report-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.report-type {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.report-type h3 {
  color: var(--color-primary);
  margin: 0 0 10px 0;
}

.report-type p {
  color: var(--color-text-light);
  margin-bottom: 15px;
}

.btn-icon {
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: var(--color-secondary);
  color: var(--color-primary);
}
</style>
