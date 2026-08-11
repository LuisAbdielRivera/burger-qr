import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

  useEffect(() => {
    let active = true
    const id = searchParams.get('id')

    async function loadProduct() {
      try {
        const products = await getProducts()
        const found = products.find((item) => item.id === id)

        if (active) {
          if (found?.available) setProduct(found)
          else setError('Producto no encontrado o no disponible.')
        }
      } catch (requestError) {
        if (active) setError(getApiError(requestError, 'No se pudo cargar el producto'))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProduct()
    return () => { active = false }
  }, [searchParams])

  const handleAdd = () => {
    if (!product) return
    addToCart(product)
    navigate('/')
  }

  if (loading) {
    return <div className="bg-black min-h-screen text-white flex items-center justify-center">Cargando producto...</div>
  }

  if (error || !product) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-5 gap-4">
        <p className="text-red-300">{error || 'Producto no encontrado.'}</p>
        <button onClick={() => navigate('/')} className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold">
          Volver al menú
        </button>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-neutral-800 p-5 z-40">
        <button onClick={() => navigate(-1)} className="text-neutral-400 hover:text-white transition text-lg">
          ←
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="rounded-3xl overflow-hidden h-64 bg-neutral-900">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-yellow-400">{product.name}</h1>
          <p className="text-neutral-400 text-sm leading-relaxed">{product.desc}</p>

          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-2xl p-4">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Precio</p>
            <p className="text-3xl font-black text-yellow-400 mt-2">${product.price}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Nota</p>
          <p className="text-sm text-neutral-300">
            Podrás personalizar este producto después, en la pantalla de tu pedido.
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-800 p-5 bg-gradient-to-t from-black via-black/95 to-transparent">
        <button
          onClick={handleAdd}
          className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-black rounded-2xl transition-all duration-300 shadow-lg"
        >
          ✓ Agregar al pedido
        </button>
      </div>
    </div>
  )
}
