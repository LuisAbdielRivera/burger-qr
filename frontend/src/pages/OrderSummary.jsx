import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  UserRound,
  CheckCircle2,
  LoaderCircle,
  CircleAlert,
  UtensilsCrossed,
} from 'lucide-react'

import { useCart } from '../context/CartContext.jsx'
import OrderSummaryCard from '../components/OrderSummaryCard.jsx'
import EditItemModal from '../components/EditItemModal.jsx'
import { createOrder } from '../services/orders.service.js'
import { getApiError } from '../services/api.js'

export default function OrderSummary() {
  const {
    cart,
    removeFromCart,
    updateCartItem,
    clearCart,
  } = useCart()

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  )

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Por favor, ingresa tu nombre.')
      return
    }

    if (cart.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const order = await createOrder({
        customer: name.trim(),
        items: cart,
      })

      sessionStorage.setItem(
        'burgerqr:last_order_code',
        order.code
      )

      clearCart()

      navigate('/exito', {
        state: {
          code: order.code,
        },
      })
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'No se pudo crear el pedido. Intenta nuevamente.'
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-xl">

        <div className="mx-auto max-w-2xl px-5 py-4 sm:px-6">

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Volver"
            >
              <ArrowLeft size={20} />
            </button>


            <div className="flex items-center gap-2">

              <ShoppingBag
                size={19}
                className="text-[#F700C6]"
              />

              <h1 className="text-lg font-black text-white">
                Tu pedido
              </h1>

            </div>


            {/* Espaciador */}
            <div className="h-10 w-10" />

          </div>

        </div>

      </header>

      <div className="mx-auto max-w-2xl px-5 pb-44 pt-6 sm:px-6 sm:pt-8">


        <section className="relative overflow-hidden rounded-[28px] border border-[#F700C6]/30 bg-[#080808] p-5 sm:p-6">

          {/* Decoración */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#F700C6]/10 blur-[80px]" />

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">
                <ShoppingBag
                  size={23}
                  strokeWidth={2}
                />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F700C6]">
                  Resumen
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Revisa tu pedido
                </h2>

              </div>

            </div>


            <div className="mt-6 flex items-end justify-between gap-4">

              <div>

                <p className="text-xs text-neutral-500">
                  {itemCount}{' '}
                  {itemCount === 1
                    ? 'artículo'
                    : 'artículos'}
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  Total a pagar
                </p>

              </div>


              <p className="text-3xl font-black text-[#FFD400]">
                ${total.toFixed(2)}
              </p>

            </div>

          </div>

        </section>

        <section className="mt-7">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D9FF00]">
                Productos
              </p>

              <h2 className="mt-1 text-lg font-black text-white">
                Tu selección
              </h2>

            </div>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-neutral-500">
              {itemCount}
            </span>

          </div>


          {cart.length === 0 ? (

            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#080808] px-5 py-12 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD400]/10 text-[#FFD400]">

                <UtensilsCrossed
                  size={30}
                  strokeWidth={1.8}
                />

              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                Tu carrito está vacío
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Agrega algunos productos para continuar.
              </p>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-5 rounded-2xl bg-[#F700C6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ff25d4]"
              >
                Ver menú
              </button>

            </div>

          ) : (

            <div className="space-y-3">

              {cart.map((item) => (

                <OrderSummaryCard
                  key={item.uniqueId}
                  item={item}
                  onRemove={removeFromCart}
                  onEdit={(uniqueId) =>
                    setEditingItem(
                      cart.find(
                        (cartItem) =>
                          cartItem.uniqueId === uniqueId
                      )
                    )
                  }
                />

              ))}

            </div>

          )}

        </section>

        {cart.length > 0 && (

          <section className="mt-7">

            <div className="mb-4">

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                Identificación
              </p>

              <h2 className="mt-1 text-lg font-black text-white">
                ¿A nombre de quién va?
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                Usaremos este nombre para identificar tu pedido.
              </p>

            </div>


            <div className="relative">

              <UserRound
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
              />

              <input
                type="text"
                placeholder="Ej. Jorge"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)

                  if (error) {
                    setError('')
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                  }
                }}
                className="w-full rounded-2xl border border-white/10 bg-[#080808] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-700 outline-none transition focus:border-[#F700C6] focus:ring-2 focus:ring-[#F700C6]/10"
                autoComplete="name"
              />

            </div>

          </section>

        )}

        {error && (

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">

            <CircleAlert
              size={19}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <p className="text-sm leading-5 text-red-300">
              {error}
            </p>

          </div>

        )}

      </div>

      {cart.length > 0 && (

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 px-5 pb-5 pt-4 backdrop-blur-xl sm:px-6">

          <div className="mx-auto max-w-2xl">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-xs text-neutral-500">
                Total del pedido
              </span>

              <span className="text-lg font-black text-[#FFD400]">
                ${total.toFixed(2)}
              </span>

            </div>


            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F700C6] px-4 py-4 text-sm font-black text-white shadow-lg shadow-[#F700C6]/10 transition hover:bg-[#ff25d4] disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 disabled:shadow-none"
            >

              {isSubmitting ? (

                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />

                  Procesando pedido...
                </>

              ) : (

                <>
                  <CheckCircle2 size={19} />

                  Confirmar pedido

                </>

              )}

            </button>


            <p className="mt-2 text-center text-[10px] text-neutral-600">
              Recibirás un código para retirar tu pedido.
            </p>

          </div>

        </div>

      )}

      {editingItem && (

        <EditItemModal
          item={editingItem}
          onSave={(updatedItem) => {

            updateCartItem(
              updatedItem.uniqueId,
              {
                notes: updatedItem.notes,
              }
            )

            setEditingItem(null)
          }}
          onClose={() => setEditingItem(null)}
        />

      )}

    </main>
  )
}