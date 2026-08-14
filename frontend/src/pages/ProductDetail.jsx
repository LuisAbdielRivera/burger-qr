import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  CircleAlert,
  RefreshCw,
  Check,
  UtensilsCrossed,
} from 'lucide-react'

import { useCart } from '../context/CartContext.jsx'
import { getProducts } from '../services/products.service.js'
import { getApiError } from '../services/api.js'

export default function ProductDetail() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    const id = searchParams.get('id')

    async function loadProduct() {
      try {
        const products = await getProducts()
        const found = products.find(
          (item) => item.id === id
        )

        if (active) {
          if (found?.available) {
            setProduct(found)
          } else {
            setError(
              'Producto no encontrado o no disponible.'
            )
          }
        }
      } catch (requestError) {
        if (active) {
          setError(
            getApiError(
              requestError,
              'No se pudo cargar el producto.'
            )
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      active = false
    }
  }, [searchParams])

  const handleAdd = () => {
    if (!product) return

    addToCart(product)
    setAdded(true)

    setTimeout(() => {
      navigate('/')
    }, 450)
  }
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">

        <div className="flex flex-col items-center text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F700C6]/10 text-[#F700C6]">

            <RefreshCw
              size={28}
              className="animate-spin"
            />

          </div>

          <p className="mt-5 text-sm font-semibold text-neutral-400">
            Cargando producto...
          </p>

        </div>

      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 text-white">

        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#F700C6]/10 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#D9FF00]/10 blur-[100px]" />

        <section className="relative w-full max-w-md rounded-[30px] border border-white/10 bg-[#080808] p-6 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">

            <CircleAlert
              size={30}
              strokeWidth={1.8}
            />

          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Producto
          </p>

          <h1 className="mt-2 text-xl font-black text-white">
            No pudimos encontrarlo
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {error || 'Producto no encontrado.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F700C6] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#ff25d4]"
          >
            <ArrowLeft size={18} />
            Volver al menú
          </button>

        </section>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-6">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>


          <div className="flex items-center gap-2">

            <UtensilsCrossed
              size={18}
              className="text-[#F700C6]"
            />

            <span className="text-sm font-black text-white">
              Detalle
            </span>

          </div>


          <div className="h-10 w-10" />

        </div>

      </header>

      <div className="mx-auto max-w-2xl px-5 pb-32 pt-5 sm:px-6 sm:pt-7">

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#080808]">

          <div className="aspect-[4/3] w-full sm:aspect-[16/10]">

            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />

          </div>


          {/* Disponible */}
          <div className="absolute left-4 top-4">

            <span className="flex items-center gap-1.5 rounded-full bg-[#D9FF00] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black shadow-lg">

              <span className="h-1.5 w-1.5 rounded-full bg-black" />

              Disponible

            </span>

          </div>

        </section>

        <section className="mt-6">

          <div className="flex items-start justify-between gap-5">

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F700C6]">
                Burger QR
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">
                {product.name}
              </h1>

            </div>


            <div className="shrink-0 text-right">

              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                Precio
              </p>

              <p className="mt-1 text-2xl font-black text-[#FFD400] sm:text-3xl">
                ${product.price}
              </p>

            </div>

          </div>


          {/* Descripción */}
          <div className="mt-5">

            <p className="text-sm leading-7 text-neutral-400">
              {product.desc}
            </p>

          </div>

        </section>

        <section className="mt-7 overflow-hidden rounded-[26px] border border-[#D9FF00]/20 bg-[#080808]">

          <div className="flex items-center gap-3 border-b border-white/10 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9FF00]/10 text-[#D9FF00]">

              <Check
                size={20}
                strokeWidth={2.2}
              />

            </div>

            <div>

              <p className="text-sm font-black text-white">
                Personaliza tu producto
              </p>

              <p className="mt-0.5 text-xs text-neutral-500">
                Podrás modificarlo antes de confirmar tu pedido.
              </p>

            </div>

          </div>


          <div className="p-5">

            <p className="text-xs leading-5 text-neutral-500">
              Agrega el producto primero. En la pantalla de
              tu pedido podrás indicar cambios como quitar
              ingredientes o solicitar extras.
            </p>

          </div>

        </section>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 px-5 pb-5 pt-4 backdrop-blur-xl">

        <div className="mx-auto max-w-2xl">

          <button
            type="button"
            onClick={handleAdd}
            disabled={added}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-black shadow-lg transition ${
              added
                ? 'bg-[#D9FF00] text-black shadow-[#D9FF00]/10'
                : 'bg-[#F700C6] text-white shadow-[#F700C6]/10 hover:bg-[#ff25d4]'
            }`}
          >

            {added ? (
              <>
                <Check size={19} />
                ¡Agregado al pedido!
              </>
            ) : (
              <>
                <ShoppingBag size={19} />
                Agregar al pedido
              </>
            )}

          </button>

        </div>

      </div>

    </main>
  )
}