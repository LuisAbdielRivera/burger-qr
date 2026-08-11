import api from './api'

export async function createOrder({ customer, items }) {
  const payload = {
    customer,
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      notes: Array.isArray(item.notes) ? item.notes.join(', ') : item.notes || null,
    })),
  }

  const { data } = await api.post('/orders', payload)
  return data
}

export async function getOrders() {
  const { data } = await api.get('/orders')
  return data
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status })
  return data
}
