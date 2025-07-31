<template>
  <div class="product-form">
    <h1>Product Information</h1>
    
    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Product Name</label>
          <input 
            type="text" 
            id="name"
            v-model="form.name"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            v-model="form.description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Category</label>
            <input 
              type="text" 
              id="category"
              v-model="form.category"
            />
          </div>

          <div class="form-group">
            <label for="priority">Priority</label>
            <select 
              id="priority"
              v-model="form.priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save Product' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h2>Product List</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productStore.products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.priority }}</td>
              <td>{{ product.status }}</td>
              <td>
                <button 
                  class="btn-icon" 
                  @click="editProduct(product)"
                >
                  Edit
                </button>
                <button 
                  class="btn-icon delete" 
                  @click="deleteProduct(product.id)"
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
import { defineComponent, ref } from 'vue'
import { useProductStore } from '@/stores/product'

export default defineComponent({
  name: 'ProductView',

  setup() {
    const productStore = useProductStore()
    const loading = ref(false)
    const editingId = ref(null)

    const form = ref({
      name: '',
      description: '',
      category: '',
      priority: 'medium'
    })

    const handleSubmit = async () => {
      loading.value = true
      try {
        if (editingId.value) {
          await productStore.updateProduct(editingId.value, form.value)
        } else {
          await productStore.addProduct(form.value)
        }
        resetForm()
      } catch (error) {
        console.error('Error saving product:', error)
      } finally {
        loading.value = false
      }
    }

    const editProduct = (product) => {
      editingId.value = product.id
      form.value = { ...product }
    }

    const deleteProduct = async (id) => {
      if (confirm('Are you sure you want to delete this product?')) {
        await productStore.deleteProduct(id)
      }
    }

    const resetForm = () => {
      form.value = {
        name: '',
        description: '',
        category: '',
        priority: 'medium'
      }
      editingId.value = null
    }

    return {
      productStore,
      form,
      loading,
      handleSubmit,
      editProduct,
      deleteProduct
    }
  }
})
</script>

<style scoped>
.product-form {
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
