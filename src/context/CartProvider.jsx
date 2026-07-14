import { useState } from 'react'
import CartContext from './cartContext'

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addItemToCart = (product) => {
    setCartItems((currentCartItems) => {
      const existingItem = currentCartItems.find(
        (item) => item.title === product.title,
      )

      if (existingItem) {
        return currentCartItems.map((item) =>
          item.title === product.title
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCartItems, { ...product, quantity: 1 }]
    })
  }

  const removeItemFromCart = (title) => {
    setCartItems((currentCartItems) =>
      currentCartItems.filter((item) => item.title !== title),
    )
  }

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const value = {
    addItemToCart,
    cartItems,
    cartQuantity,
    cartTotal,
    removeItemFromCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
