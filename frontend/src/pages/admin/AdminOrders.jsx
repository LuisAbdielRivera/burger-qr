import { useEffect, useMemo, useState } from 'react'
import { getOrders, updateOrderStatus } from '../../services/orders.service.js'
import { getApiError } from '../../services/api.js'

const statusOrder = ['PENDIENTE', 'PREPARANDO', 'ENTREGADO']
const statusLabels = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  ENTREGADO: 'Entregado',
}
const statusBadge = {
  PENDIENTE: 'bg-yellow-400 text-black',
  PREPARANDO: 'bg-blue-500 text-white',
  ENTREGADO: 'bg-emerald-400 text-black',
}
const statusBar = {
  PENDIENTE: 'border-l-4 border-yellow-400',
  PREPARANDO: 'border-l-4 border-blue-500',
  ENTREGADO: 'border-l-4 border-emerald-400',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState('PENDIENTE')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadOrders = async () => {
    try {
      setOrders(await getOrders())
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudieron cargar los pedidos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const groupedOrders = useMemo(
    () =>
      statusOrder.reduce((acc, status) => {
        acc[status] = orders.filter((order) => order.status === status)
        return acc
      }, {}),
    [orders],
  )

  const handleNextStatus = async (order) => {
    const nextStatus = order.status === 'PENDIENTE'
      ? 'PREPARANDO'
      : order.status === 'PREPARANDO'
        ? 'ENTREGADO'
        : null

    if (!nextStatus) return

    setUpdatingId(order.id)
    setError('')

    try {
      const updated = await updateOrderStatus(order.id, nextStatus)
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo actualizar el pedido.'))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-white">Pedidos operativos</h3>
            <p className="text-sm text-neutral-400">Estados reales provenientes de PostgreSQL.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {statusOrder.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeStatus === status
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                {statusLabels[status]} ({groupedOrders[status]?.length ?? 0})
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[0.9fr_0.4fr]">
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-6 text-neutral-400">
              Cargando pedidos...
            </div>
          ) : groupedOrders[activeStatus]?.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-6 text-center text-neutral-400">
              No hay pedidos en <strong>{statusLabels[activeStatus]}</strong>.
            </div>
          ) : (
            groupedOrders[activeStatus].map((order) => (
              <article
                key={order.id}
                className={`rounded-3xl border border-white/10 bg-neutral-950/90 p-5 ${statusBar[order.status]}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">{order.code}</p>
                    <h4 className="text-2xl font-black text-white">{order.customer}</h4>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Total</p>
                    <p className="mt-2 text-3xl font-black text-yellow-400">${order.total}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.orderItems?.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-black/80 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">
                          {item.quantity} × {item.product?.name || 'Producto'}
                        </p>
                        <p className="text-sm text-neutral-400">${item.unitPrice}</p>
                      </div>

                      {item.notes && (
                        <p className="mt-2 text-sm text-neutral-400">
                          Nota: <span className="text-neutral-200">{item.notes}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {order.status !== 'ENTREGADO' && (
                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      disabled={updatingId === order.id}
                      onClick={() => handleNextStatus(order)}
                      className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black disabled:opacity-60"
                    >
                      {updatingId === order.id
                        ? 'Actualizando...'
                        : order.status === 'PENDIENTE'
                          ? 'Marcar preparando'
                          : 'Marcar entregado'}
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Resumen</p>
            <div className="mt-4 space-y-3">
              {statusOrder.map((status) => (
                <div key={status} className="flex items-center justify-between rounded-2xl bg-black/80 px-4 py-3">
                  <span className="text-sm text-neutral-300">{statusLabels[status]}</span>
                  <span className="font-black text-white">{groupedOrders[status]?.length ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
