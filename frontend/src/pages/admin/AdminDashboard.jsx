import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../../services/products.service.js'
import { getOrders } from '../../services/orders.service.js'
import { getApiError } from '../../services/api.js'

const statusLabels = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  ENTREGADO: 'Entregado',
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [productData, orderData] = await Promise.all([getProducts(), getOrders()])
        if (active) {
          setProducts(productData)
          setOrders(orderData)
        }
      } catch (requestError) {
        if (active) setError(getApiError(requestError, 'No se pudo cargar el dashboard.'))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()
    return () => { active = false }
  }, [])

  const summary = useMemo(() => {
    const pending = orders.filter((order) => order.status === 'PENDIENTE').length
    const preparing = orders.filter((order) => order.status === 'PREPARANDO').length
    const delivered = orders.filter((order) => order.status === 'ENTREGADO').length
    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0)

    return {
      totalOrders: orders.length,
      pending,
      preparing,
      delivered,
      revenue,
      availableProducts: products.filter((product) => product.available).length,
    }
  }, [orders, products])

  if (loading) {
    return <p className="text-neutral-400">Cargando dashboard...</p>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Pedidos</p>
          <p className="mt-4 text-3xl font-black text-white">{summary.totalOrders}</p>
          <p className="mt-2 text-sm text-neutral-400">{summary.pending} pendientes</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Cocina</p>
          <p className="mt-4 text-3xl font-black text-yellow-400">{summary.preparing}</p>
          <p className="mt-2 text-sm text-neutral-400">En preparación</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Productos</p>
          <p className="mt-4 text-3xl font-black text-white">{summary.availableProducts}</p>
          <p className="mt-2 text-sm text-neutral-400">Disponibles</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Ingresos</p>
          <p className="mt-4 text-3xl font-black text-white">${summary.revenue.toFixed(2)}</p>
          <p className="mt-2 text-sm text-neutral-400">Pedidos registrados</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
        <div className="mb-5">
          <h3 className="text-xl font-black text-white">Pedidos recientes</h3>
          <p className="text-sm text-neutral-400">Información real del backend.</p>
        </div>

        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="rounded-3xl border border-white/10 bg-black/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-white">{order.code}</p>
                  <p className="text-sm text-neutral-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                    {statusLabels[order.status] || order.status}
                  </span>
                  <p className="mt-2 text-sm text-neutral-300">${order.total}</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-neutral-400">
                {order.orderItems?.map((item) => (
                  <p key={item.id}>• {item.quantity} × {item.product?.name || 'Producto'}</p>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-neutral-500">Todavía no hay pedidos.</p>
          )}
        </div>
      </div>
    </div>
  )
}
