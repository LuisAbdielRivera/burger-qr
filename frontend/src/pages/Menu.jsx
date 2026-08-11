import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProducts } from '../services/products.service.js'
import { getApiError } from '../services/api.js'

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
        if (active) setProducts(data.filter((product) => product.available))
      } catch (requestError) {
        if (active) setError(getApiError(requestError, 'No se pudo cargar el menú'))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProducts()
    return () => { active = false }
  }, [])

  return (
    <div className="bg-black min-h-screen p-5">
      <h1 className="text-yellow-400 text-3xl font-black text-center">MENÚ</h1>

      {loading && (
        <p className="mt-8 text-center text-neutral-400">Cargando menú...</p>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="mt-8 text-center text-neutral-500">
          No hay productos disponibles.
        </p>
      )}

      <div className="grid gap-5 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {getTotalItems() > 0 && (
        <button
          onClick={() => navigate('/pedido')}
          className="fixed bottom-5 right-5 bg-yellow-400 px-6 py-4 rounded-full font-bold shadow-lg"
        >
          Ver pedido ({getTotalItems()})
        </button>
      )}
    </div>
  )
}
