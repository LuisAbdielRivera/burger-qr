import { useEffect, useMemo, useState } from 'react'
import {
  ClipboardList,
  CookingPot,
  UtensilsCrossed,
  CircleDollarSign,
  Clock3,
  PackageCheck,
} from 'lucide-react'

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
        const [productData, orderData] = await Promise.all([
          getProducts(),
          getOrders(),
        ])

        if (active) {
          setProducts(productData)
          setOrders(orderData)
        }
      } catch (requestError) {
        if (active) {
          setError(
            getApiError(
              requestError,
              'No se pudo cargar el dashboard.'
            )
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const summary = useMemo(() => {
    const pending = orders.filter(
      (order) => order.status === 'PENDIENTE'
    ).length

    const preparing = orders.filter(
      (order) => order.status === 'PREPARANDO'
    ).length

    const delivered = orders.filter(
      (order) => order.status === 'ENTREGADO'
    ).length

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    )

    return {
      totalOrders: orders.length,
      pending,
      preparing,
      delivered,
      revenue,
      availableProducts: products.filter(
        (product) => product.available
      ).length,
    }
  }, [orders, products])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9FF00]/30 border-t-[#D9FF00]" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-7">

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">

        {/* PEDIDOS */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#F700C6]/30 bg-[#090909] p-4 transition-all duration-300 hover:border-[#F700C6]/70 sm:rounded-[28px] sm:p-6">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#F700C6]/10 blur-2xl transition group-hover:bg-[#F700C6]/20 sm:h-28 sm:w-28" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                Pedidos
              </p>

              <p className="mt-3 text-3xl font-black text-white sm:mt-5 sm:text-4xl">
                {summary.totalOrders}
              </p>

              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#F700C6] sm:mt-2 sm:text-sm">
                <Clock3 size={14} />
                {summary.pending} pendientes
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F700C6]/10 text-[#F700C6] sm:h-14 sm:w-14 sm:rounded-2xl">
              <ClipboardList
                size={22}
                strokeWidth={2.2}
                className="sm:h-7 sm:w-7"
              />
            </div>

          </div>
        </div>

        {/* COCINA */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#D9FF00]/30 bg-[#090909] p-4 transition-all duration-300 hover:border-[#D9FF00]/70 sm:rounded-[28px] sm:p-6">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#D9FF00]/10 blur-2xl transition group-hover:bg-[#D9FF00]/20 sm:h-28 sm:w-28" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                Cocina
              </p>

              <p className="mt-3 text-3xl font-black text-[#D9FF00] sm:mt-5 sm:text-4xl">
                {summary.preparing}
              </p>

              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-400 sm:mt-2 sm:text-sm">
                <CookingPot size={14} />
                En preparación
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D9FF00]/10 text-[#D9FF00] sm:h-14 sm:w-14 sm:rounded-2xl">
              <CookingPot
                size={22}
                strokeWidth={2.2}
                className="sm:h-7 sm:w-7"
              />
            </div>

          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#FFD400]/30 bg-[#090909] p-4 transition-all duration-300 hover:border-[#FFD400]/70 sm:rounded-[28px] sm:p-6">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FFD400]/10 blur-2xl transition group-hover:bg-[#FFD400]/20 sm:h-28 sm:w-28" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                Productos
              </p>

              <p className="mt-3 text-3xl font-black text-[#FFD400] sm:mt-5 sm:text-4xl">
                {summary.availableProducts}
              </p>

              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-400 sm:mt-2 sm:text-sm">
                <PackageCheck size={14} />
                Disponibles
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400] sm:h-14 sm:w-14 sm:rounded-2xl">
              <UtensilsCrossed
                size={22}
                strokeWidth={2.2}
                className="sm:h-7 sm:w-7"
              />
            </div>

          </div>
        </div>

        {/* INGRESOS */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#F700C6]/30 bg-[#090909] p-4 transition-all duration-300 hover:border-[#F700C6]/70 sm:rounded-[28px] sm:p-6">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#F700C6]/10 blur-2xl transition group-hover:bg-[#F700C6]/20 sm:h-28 sm:w-28" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                Ingresos
              </p>

              <p className="mt-3 truncate text-2xl font-black text-white sm:mt-5 sm:text-4xl">
                ${summary.revenue.toFixed(2)}
              </p>

              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-400 sm:mt-2 sm:text-sm">
                <CircleDollarSign size={14} />
                Pedidos registrados
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F700C6]/10 text-[#F700C6] sm:h-14 sm:w-14 sm:rounded-2xl">
              <CircleDollarSign
                size={22}
                strokeWidth={2.2}
                className="sm:h-7 sm:w-7"
              />
            </div>

          </div>
        </div>

      </div>

      <section className="relative overflow-hidden rounded-2xl border border-[#FFD400]/30 bg-[#080808] sm:rounded-[32px]">

        {/* Decoración */}
        <div className="pointer-events-none absolute right-5 top-0 flex gap-1.5 opacity-70 sm:right-8 sm:gap-2">
          <span className="h-7 w-1 rotate-[18deg] bg-[#F700C6] sm:h-8" />
          <span className="h-10 w-1 rotate-[8deg] bg-[#D9FF00] sm:h-12" />
          <span className="h-5 w-1 rotate-[-15deg] bg-[#FFD400] sm:h-6" />
        </div>

        {/* Encabezado */}
        <div className="border-b border-white/10 px-5 py-5 sm:px-8 sm:py-6">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD400] sm:text-xs sm:tracking-[0.25em]">
                Actividad
              </p>

              <h3 className="mt-1.5 text-xl font-black text-white sm:mt-2 sm:text-2xl">
                Pedidos recientes
              </h3>

              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                Información real del backend.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-[#FFD400]/10 p-3 text-[#FFD400] sm:block">
              <ClipboardList size={26} />
            </div>

          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3 p-4 sm:space-y-4 sm:p-8">

          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-white/10 bg-black/70 p-4 transition hover:border-[#FFD400]/30 sm:rounded-3xl sm:p-5"
            >

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                  <p className="font-black text-white">
                    {order.code}
                  </p>

                  <p className="mt-1 truncate text-sm text-neutral-400">
                    {order.customer}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">

                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold sm:px-4 sm:py-2 sm:text-xs ${
                      order.status === 'PENDIENTE'
                        ? 'bg-[#F700C6]/10 text-[#F700C6]'
                        : order.status === 'PREPARANDO'
                          ? 'bg-[#D9FF00]/10 text-[#D9FF00]'
                          : 'bg-[#FFD400]/10 text-[#FFD400]'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>

                  <p className="font-black text-white">
                    ${order.total}
                  </p>

                </div>
              </div>

              <div className="mt-3 border-t border-white/5 pt-3 text-xs text-neutral-500 sm:mt-4 sm:pt-4 sm:text-sm">
                {order.orderItems?.map((item) => (
                  <p key={item.id}>
                    {item.quantity} ×{' '}
                    {item.product?.name || 'Producto'}
                  </p>
                ))}
              </div>

            </div>
          ))}

          {/* Sin pedidos */}
          {orders.length === 0 && (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/30 px-5 text-center sm:min-h-[260px] sm:rounded-3xl">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD400]/10 text-[#FFD400] sm:mb-5 sm:h-20 sm:w-20">
                <ClipboardList
                  size={32}
                  strokeWidth={1.8}
                  className="sm:h-[38px] sm:w-[38px]"
                />
              </div>

              <h4 className="text-base font-black text-white sm:text-lg">
                Todavía no hay pedidos
              </h4>

              <p className="mt-2 max-w-sm text-xs text-neutral-500 sm:text-sm">
                Cuando un cliente realice un pedido,
                aparecerá aquí automáticamente.
              </p>

              <div className="mt-4 flex gap-2 sm:mt-5">
                <span className="h-1.5 w-6 rounded-full bg-[#F700C6] sm:w-8" />
                <span className="h-1.5 w-6 rounded-full bg-[#FFD400] sm:w-8" />
                <span className="h-1.5 w-6 rounded-full bg-[#D9FF00] sm:w-8" />
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  )
}