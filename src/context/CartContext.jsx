import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (variant, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id)
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { variant, quantity }]
    })
  }

  const removeFromCart = (variantId) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId))
  }

  const updateQuantity = (variantId, quantity) => {
    setCart((prev) =>
      prev.map((item) => (item.variant.id === variantId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((acc, item) => acc + (item?.quantity || 0), 0)
  const totalPrice = cart.reduce((acc, item) => acc + (item?.variant?.price || 0) * (item?.quantity || 0), 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}
