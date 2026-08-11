import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import OrderSummaryCard from '../components/OrderSummaryCard.jsx'
import EditItemModal from '../components/EditItemModal.jsx'
import { createOrder } from '../services/orders.service.js'
import { getApiError } from '../services/api.js'

export default function OrderSummary() {
  const { cart, removeFromCart, updateCartItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

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

      sessionStorage.setItem('burgerqr:last_order_code', order.code)
      clearCart()
      navigate('/exito', { state: { code: order.code } })
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo crear el pedido. Intenta nuevamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-neutral-800 p-5 z-40">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-neutral-400 hover:text-white transition text-lg">←</button>
          <h1 className="text-xl font-black text-yellow-400">Tu Pedido</h1>
          <div className="w-8" />
        </div>

        <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-2xl p-4">
          <p className="text-neutral-400 text-sm">Total a pagar</p>
          <p className="text-3xl font-black text-yellow-400">${total.toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {itemCount} artículo{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-neutral-500 text-lg">Tu carrito está vacío</p>
            <button onClick={() => navigate('/')} className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold">
              Agregar artículos
            </button>
          </div>
        ) : (
          cart.map((item, index) => (
            <OrderSummaryCard
              key={item.uniqueId}
              item={item}
              isLast={index === cart.length - 1}
              onRemove={removeFromCart}
              onEdit={(uniqueId) => setEditingItem(cart.find((item) => item.uniqueId === uniqueId))}
            />
          ))
        )}
      </div>

      <div className="bg-gradient-to-t from-black via-black/95 to-transparent border-t border-neutral-800 p-5 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
            ¿A nombre de quién va el pedido?
          </label>
          <input
            type="text"
            placeholder="Ej: Jorge"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || cart.length === 0}
          className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 disabled:from-neutral-500 disabled:to-neutral-600 text-black font-black rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Procesando...' : '✓ Confirmar Pedido'}
        </button>

        <p className="text-center text-xs text-neutral-600">
          Recibirás un código para retirar tu pedido
        </p>
      </div>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={(updatedItem) => {
            updateCartItem(updatedItem.uniqueId, { notes: updatedItem.notes })
            setEditingItem(null)
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}
