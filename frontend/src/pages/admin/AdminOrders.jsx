import { useEffect, useMemo, useState } from 'react'
import {
  ClipboardList,
  Clock3,
  CookingPot,
  CheckCircle2,
  ChevronRight,
  PackageCheck,
  RefreshCw,
  CircleX,
} from 'lucide-react'

import {
  getOrders,
  updateOrderStatus,
} from '../../services/orders.service.js'

import { getApiError } from '../../services/api.js'

const statusOrder = [
  'PENDIENTE',
  'PREPARANDO',
  'ENTREGADO',
]

const statusLabels = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  ENTREGADO: 'Entregado',
}

const statusConfig = {
  PENDIENTE: {
    color: '#F700C6',
    bg: 'bg-[#F700C6]/10',
    text: 'text-[#F700C6]',
    border: 'border-[#F700C6]/30',
    icon: Clock3,
  },

  PREPARANDO: {
    color: '#D9FF00',
    bg: 'bg-[#D9FF00]/10',
    text: 'text-[#D9FF00]',
    border: 'border-[#D9FF00]/30',
    icon: CookingPot,
  },

  ENTREGADO: {
    color: '#FFD400',
    bg: 'bg-[#FFD400]/10',
    text: 'text-[#FFD400]',
    border: 'border-[#FFD400]/30',
    icon: CheckCircle2,
  },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState('PENDIENTE')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadOrders = async () => {
    try {
      setLoading(true)

      setOrders(await getOrders())
      setError('')
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'No se pudieron cargar los pedidos.'
        )
      )
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
        acc[status] = orders.filter(
          (order) => order.status === status
        )

        return acc
      }, {}),
    [orders]
  )

  const handleNextStatus = async (order) => {
    const nextStatus =
      order.status === 'PENDIENTE'
        ? 'PREPARANDO'
        : order.status === 'PREPARANDO'
          ? 'ENTREGADO'
          : null

    if (!nextStatus) return

    setUpdatingId(order.id)
    setError('')

    try {
      const updated = await updateOrderStatus(
        order.id,
        nextStatus
      )

      setOrders((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      )
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'No se pudo actualizar el pedido.'
        )
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const activeConfig = statusConfig[activeStatus]
  const ActiveIcon = activeConfig.icon

  return (
    <div className="space-y-6">

      <section className="relative overflow-hidden rounded-[28px] border border-[#F700C6]/30 bg-[#080808] p-5 sm:p-7">

        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#F700C6]/10 blur-3xl" />

        <div className="relative">

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">
                  <ClipboardList
                    size={24}
                    strokeWidth={2.3}
                  />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F700C6]">
                    Operación
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                    Pedidos
                  </h3>

                </div>

              </div>

              <p className="mt-4 max-w-xl text-sm text-neutral-400">
                Gestiona los pedidos y actualiza su estado
                conforme avanzan en la cocina.
              </p>

            </div>

            {/* Recargar */}
            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50 sm:h-11 sm:w-11"
              aria-label="Actualizar pedidos"
            >
              <RefreshCw
                size={18}
                className={loading ? 'animate-spin' : ''}
              />
            </button>

          </div>

        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

          <CircleX
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>

        </div>
      )}

      <section className="rounded-[28px] border border-white/10 bg-[#080808] p-4 sm:p-5">

        <div className="grid grid-cols-3 gap-2 sm:gap-3">

          {statusOrder.map((status) => {
            const config = statusConfig[status]
            const Icon = config.icon
            const isActive = activeStatus === status
            const count = groupedOrders[status]?.length ?? 0

            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`relative overflow-hidden rounded-2xl border p-3 text-left transition sm:p-4 ${
                  isActive
                    ? `${config.bg} ${config.border}`
                    : 'border-white/10 bg-black/40 hover:bg-white/5'
                }`}
              >

                {isActive && (
                  <span
                    className="absolute left-0 top-0 h-1 w-full"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <Icon
                    size={20}
                    strokeWidth={2.2}
                    className={
                      isActive
                        ? config.text
                        : 'text-neutral-500'
                    }
                  />

                  <span
                    className={`text-2xl font-black ${
                      isActive
                        ? config.text
                        : 'text-white'
                    }`}
                  >
                    {count}
                  </span>

                </div>

                <p
                  className={`mt-2 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${
                    isActive
                      ? config.text
                      : 'text-neutral-500'
                  }`}
                >
                  {statusLabels[status]}
                </p>

              </button>
            )
          })}

        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_280px]">

        <div className="space-y-4">

          {/* Encabezado del estado */}
          <div className="flex items-center justify-between gap-3 px-1">

            <div className="flex items-center gap-3">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeConfig.bg} ${activeConfig.text}`}
              >
                <ActiveIcon
                  size={20}
                  strokeWidth={2.2}
                />
              </div>

              <div>

                <h4 className="font-black text-white">
                  {statusLabels[activeStatus]}
                </h4>

                <p className="text-xs text-neutral-500">
                  {groupedOrders[activeStatus]?.length ?? 0}{' '}
                  pedidos
                </p>

              </div>

            </div>

          </div>


          {/* Cargando */}
          {loading ? (

            <div className="flex min-h-[260px] items-center justify-center rounded-[28px] border border-white/10 bg-[#080808]">

              <div className="flex items-center gap-3 text-neutral-400">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9FF00]/30 border-t-[#D9FF00]" />

                <span>
                  Cargando pedidos...
                </span>

              </div>

            </div>

          ) : groupedOrders[activeStatus]?.length === 0 ? (

            /* Sin pedidos */
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#080808] px-5 text-center">

              <div
                className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${activeConfig.bg} ${activeConfig.text}`}
              >
                <ActiveIcon
                  size={38}
                  strokeWidth={1.7}
                />
              </div>

              <h4 className="text-lg font-black text-white">
                No hay pedidos
              </h4>

              <p className="mt-2 max-w-sm text-sm text-neutral-500">
                No existen pedidos en estado{' '}
                <span className={activeConfig.text}>
                  {statusLabels[activeStatus].toLowerCase()}
                </span>
                .
              </p>

            </div>

          ) : (

            /* Pedidos */
            groupedOrders[activeStatus].map((order) => {

              const config = statusConfig[order.status]
              const OrderStatusIcon = config.icon

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]"
                >

                  {/* Línea superior de estado */}
                  <div
                    className="h-1 w-full"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />

                  <div className="p-5 sm:p-6">

                    {/* Información principal */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                            {order.code}
                          </span>

                          <span
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${config.bg} ${config.text}`}
                          >
                            <OrderStatusIcon size={12} />
                            {statusLabels[order.status]}
                          </span>

                        </div>

                        <h4 className="mt-3 text-xl font-black text-white sm:text-2xl">
                          {order.customer}
                        </h4>

                      </div>


                      {/* Total */}
                      <div className="sm:text-right">

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#FFD400] sm:text-3xl">
                          ${order.total}
                        </p>

                      </div>

                    </div>


                    {/* Productos */}
                    <div className="mt-5 space-y-2">

                      {order.orderItems?.map((item) => (

                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/5 bg-black/60 p-4"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <p className="font-bold text-white">
                                {item.quantity} ×{' '}
                                {item.product?.name || 'Producto'}
                              </p>

                              {item.notes && (
                                <p className="mt-1.5 text-xs leading-5 text-neutral-500">
                                  <span className="font-semibold text-neutral-400">
                                    Nota:
                                  </span>{' '}
                                  <span className="text-neutral-300">
                                    {item.notes}
                                  </span>
                                </p>
                              )}

                            </div>

                            <p className="shrink-0 text-sm font-semibold text-neutral-400">
                              ${item.unitPrice}
                            </p>

                          </div>

                        </div>

                      ))}

                    </div>


                    {/* Acción */}
                    {order.status !== 'ENTREGADO' && (

                      <div className="mt-5 border-t border-white/5 pt-5">

                        <button
                          type="button"
                          disabled={
                            updatingId === order.id
                          }
                          onClick={() =>
                            handleNextStatus(order)
                          }
                          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            order.status === 'PENDIENTE'
                              ? 'bg-[#D9FF00] text-black hover:bg-[#e4ff45]'
                              : 'bg-[#FFD400] text-black hover:bg-[#ffdf3b]'
                          }`}
                        >

                          {updatingId === order.id ? (

                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                              Actualizando...
                            </>

                          ) : (

                            <>
                              {order.status === 'PENDIENTE'
                                ? 'Marcar como preparando'
                                : 'Marcar como entregado'}

                              <ChevronRight size={18} />

                            </>

                          )}

                        </button>

                      </div>

                    )}

                  </div>

                </article>
              )
            })
          )}

        </div>

        <aside className="h-fit rounded-[28px] border border-[#FFD400]/25 bg-[#080808] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
              <PackageCheck size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                Resumen
              </p>

              <h4 className="font-black text-white">
                Estado de pedidos
              </h4>
            </div>

          </div>


          <div className="mt-5 space-y-2">

            {statusOrder.map((status) => {

              const config = statusConfig[status]
              const Icon = config.icon
              const count =
                groupedOrders[status]?.length ?? 0

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    activeStatus === status
                      ? `${config.bg} ${config.border}`
                      : 'border-white/5 bg-black/60 hover:bg-white/5'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <Icon
                      size={17}
                      className={
                        activeStatus === status
                          ? config.text
                          : 'text-neutral-500'
                      }
                    />

                    <span
                      className={`text-sm font-semibold ${
                        activeStatus === status
                          ? config.text
                          : 'text-neutral-300'
                      }`}
                    >
                      {statusLabels[status]}
                    </span>

                  </div>

                  <span className="font-black text-white">
                    {count}
                  </span>

                </button>
              )
            })}

          </div>

        </aside>

      </section>

    </div>
  )
}