import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowRight,
  UtensilsCrossed,
  MessageCircle,
  RefreshCw,
} from 'lucide-react'

import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProducts } from '../services/products.service.js'
import { getApiError } from '../services/api.js'

const WHATSAPP_NUMBER = '7641307526'

export default function Menu() {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadProducts() {
      try {
        const data = await getProducts()

        if (active) {
          setProducts(
            data.filter((product) => product.available)
          )
        }
      } catch (requestError) {
        if (active) {
          setError(
            getApiError(
              requestError,
              'No se pudo cargar el menú.'
            )
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      'Hola, tengo una duda sobre mi pedido.'
    )

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const totalItems = getTotalItems()

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="relative overflow-hidden border-b border-white/10 bg-[#080808]">

        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[#F700C6]/10 blur-[90px]" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#D9FF00]/10 blur-[90px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-7 pt-8 sm:px-8 sm:pb-9">

          <div className="mb-6 flex h-1.5 w-28 overflow-hidden rounded-full">
            <span className="w-1/3 bg-[#F700C6]" />
            <span className="w-1/3 bg-[#FFD400]" />
            <span className="w-1/3 bg-[#D9FF00]" />
          </div>

          <div className="flex items-end justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">
                  <UtensilsCrossed
                    size={24}
                    strokeWidth={2.2}
                  />
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFD400] sm:text-xs">
                    Bienvenido
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Nuestro menú
                  </h1>

                </div>

              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-neutral-400">
                Elige tus favoritos, personaliza tu pedido
                y disfruta de una buena hamburguesa.
              </p>

            </div>

            {totalItems > 0 && (
              <button
                type="button"
                onClick={() => navigate('/pedido')}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6] transition hover:bg-[#F700C6]/20"
                aria-label="Ver pedido"
              >
                <ShoppingBag
                  size={21}
                  strokeWidth={2.2}
                />

                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFD400] px-1 text-[10px] font-black text-black">
                  {totalItems}
                </span>
              </button>
            )}

          </div>

        </div>

      </header>


      <div className="mx-auto max-w-6xl px-5 py-6 pb-28 sm:px-8 sm:py-8">

        {loading && (

          <div className="flex min-h-[300px] flex-col items-center justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">

              <RefreshCw
                size={28}
                className="animate-spin"
              />

            </div>

            <p className="mt-5 text-sm font-semibold text-neutral-400">
              Cargando menú...
            </p>

            <p className="mt-1 text-xs text-neutral-600">
              Estamos preparando todo para ti.
            </p>

          </div>

        )}


        {!loading && error && (

          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">

              <MessageCircle
                size={28}
                strokeWidth={1.8}
              />

            </div>

            <h2 className="mt-5 text-lg font-black text-white">
              No pudimos cargar el menú
            </h2>

            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-[#F700C6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ff25d4]"
            >
              <RefreshCw size={16} />
              Intentar nuevamente
            </button>

          </div>

        )}


        {!loading &&
          !error &&
          products.length === 0 && (

            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD400]/10 text-[#FFD400]">

                <UtensilsCrossed
                  size={28}
                  strokeWidth={1.8}
                />

              </div>

              <h2 className="mt-5 text-lg font-black text-white">
                El menú está vacío
              </h2>

              <p className="mt-2 max-w-sm text-sm text-neutral-500">
                Por el momento no hay productos disponibles.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          products.length > 0 && (

            <section>

              <div className="mb-5 flex items-end justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D9FF00]">
                    Para ti
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Elige tu favorito
                  </h2>

                </div>

                <p className="text-xs text-neutral-600">
                  {products.length}{' '}
                  {products.length === 1
                    ? 'producto'
                    : 'productos'}
                </p>

              </div>


              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>

            </section>

          )}

      </div>


      <button
        type="button"
        onClick={openWhatsApp}
        className={`fixed left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#111111] bg-[#25D366] text-white shadow-xl shadow-black/50 transition-transform duration-200 hover:bg-[#20bd5a] active:scale-90 ${
          totalItems > 0
            ? 'bottom-[92px]'
            : 'bottom-5'
        }`}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle
          size={28}
          strokeWidth={2.2}
        />
      </button>


      {totalItems > 0 && (

        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 sm:left-auto sm:max-w-md">

          <button
            type="button"
            onClick={() => navigate('/pedido')}
            className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl border border-[#F700C6]/30 bg-[#F700C6] px-4 py-3.5 text-white shadow-2xl shadow-[#F700C6]/20 transition hover:bg-[#ff25d4]"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">

                <ShoppingBag
                  size={20}
                  strokeWidth={2.2}
                />

              </div>

              <div className="text-left">

                <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Tu pedido
                </p>

                <p className="text-sm font-black">
                  {totalItems}{' '}
                  {totalItems === 1
                    ? 'producto'
                    : 'productos'}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="text-sm font-black">
                Ver pedido
              </span>

              <ArrowRight
                size={18}
                strokeWidth={2.5}
              />

            </div>

          </button>

        </div>

      )}

    </main>
  )
}