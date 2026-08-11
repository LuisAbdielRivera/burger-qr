import api from './api'

export async function getProducts() {
  const { data } = await api.get('/products')
  return data
}

export async function createProduct({ name, desc, price, available = true, imageFile }) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('desc', desc)
  formData.append('price', price)
  formData.append('available', String(available))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  const { data } = await api.post('/products', formData)
  return data
}

export async function updateProduct(id, { name, desc, price, available, imageFile }) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('desc', desc)
  formData.append('price', price)

  if (available !== undefined) {
    formData.append('available', String(available))
  }

  if (imageFile) {
    formData.append('image', imageFile)
  }

  const { data } = await api.put(`/products/${id}`, formData)
  return data
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}
