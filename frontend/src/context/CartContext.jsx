import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const useCart = () => useContext(CartContext)

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prev) => [
      ...prev,
      {
        ...product,
        productId: product.id,
        uniqueId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        quantity: 1,
        notes: [],
      },
    ])
  }

  const decreaseQuantity = (uniqueId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.uniqueId === uniqueId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const increaseQuantity = (uniqueId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  const removeFromCart = (uniqueId) => {
    setCart((prev) => prev.filter((item) => item.uniqueId !== uniqueId))
  }

  const updateCartItem = (uniqueId, updates) => {
    setCart((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, ...updates } : item,
      ),
    )
  }

  const clearCart = () => setCart([])

  const getTotalItems = () =>
    cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        updateCartItem,
        clearCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
