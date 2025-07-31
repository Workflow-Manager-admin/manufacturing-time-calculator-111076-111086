<template>
  <div class="operations-form">
    <h1>Operations Management</h1>
    
    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="productId">Product</label>
          <select 
            id="productId"
            v-model="form.productId"
            required
          >
            <option value="">Select Product</option>
            <option 
              v-for="product in productStore.products" 
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="name">Operation Name</label>
          <input 
            type="text" 
            id="name"
            v-model="form.name"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="queueTime">Queue Time (hours)</label>
            <input 
              type="number" 
              id="queueTime"
              v-model.number="form.queueTime"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div class="form-group">
            <label for="setupTime">Setup Time (hours)</label>
            <input 
              type="number" 
              id="setupTime"
              v-model.number="form.setupTime"
              min="0"
              step="0.5"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="processTime">Process Time (hours)</label>
            <input 
              type="number" 
              id="processTime"
              v-model.number="form.processTime"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div class="form-group">
            <label for="waitTime">Wait Time (hours)</label>
            <input 
              type="number" 
              id="waitTime"
              v-model.number="form.waitTime"
              min="0"
              step="0.5"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="workCenter">Work Center</label>
          <input 
            type="text" 
            id="workCenter"
            v-model="form.workCenter"
            required
          />
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save Operation' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h2>Operations List</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Operation</th>
              <th>Work Center</th>
              <th>Queue Time</th>
              <th>Setup Time</th>
              <th>Process Time</th>
              <th>Wait Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="operation in operations" :key="operation.id">
              <td>{{ getProductName(operation.productId) }}</td>
              <td>{{ operation.name }}</td>
              <td>{{ operation.workCenter }}</td>
              <td>{{ operation.queueTime }}h</td>
              <td>{{ operation.setupTime }}h</td>
              <td>{{ operation.processTime }}h</td>
              <td>{{ operation.waitTime }}h</td>
              <td>
                <button 
                  class="btn-icon" 
                  @click="editOperation(operation)"
                >
                  Edit
                </button>
                <button 
                  class="btn-icon delete" 
                  @click="deleteOperation(operation.id)"
                >
                  Delete
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
import { defineComponent, ref, computed } from 'vue'
import { useOperationStore } from '@/stores/operation'
import { useProductStore } from '@/stores/product'
import { useMCTStore } from '@/stores/mct'

export default defineComponent({
  name: 'OperationsView',

  setup() {
    const operationStore = useOperationStore()
    const productStore = useProductStore()
    const mctStore = useMCTStore()
    const loading = ref(false)
    const editingId = ref(null)

    const form = ref({
      productId: '',
      name: '',
      queueTime: 0,
      setupTime: 0,
      processTime: 0,
      waitTime: 0,
      workCenter: ''
    })

    const operations = computed(() => operationStore.operations)

    const getProductName = (productId) => {
      const product = productStore.products.find(p => p.id === productId)
      return product ? product.name : 'Unknown Product'
    }

    const handleSubmit = async () => {
      loading.value = true
      try {
        if (editingId.value) {
          await operationStore.updateOperation(editingId.value, form.value)
        } else {
          await operationStore.addOperation(form.value)
        }
        // Update MCT calculations
        mctStore.updateTimeDistribution(operationStore.operations)
        resetForm()
      } catch (error) {
        console.error('Error saving operation:', error)
      } finally {
        loading.value = false
      }
    }

    const editOperation = (operation) => {
      editingId.value = operation.id
      form.value = { ...operation }
    }

    const deleteOperation = async (id) => {
      if (confirm('Are you sure you want to delete this operation?')) {
        await operationStore.deleteOperation(id)
        mctStore.updateTimeDistribution(operationStore.operations)
      }
    }

    const resetForm = () => {
      form.value = {
        productId: '',
        name: '',
        queueTime: 0,
        setupTime: 0,
        processTime: 0,
        waitTime: 0,
        workCenter: ''
      }
      editingId.value = null
    }

    return {
      form,
      loading,
      operations,
      getProductName,
      handleSubmit,
      editOperation,
      deleteOperation,
      productStore
    }
  }
})
</script>

<style scoped>
.operations-form {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.btn-icon {
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: var(--color-secondary);
  color: var(--color-primary);
}

.btn-icon.delete {
  background: var(--color-accent);
  color: white;
}
</style>
