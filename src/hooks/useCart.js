import { useContext } from 'react'
import CartContext from '../context/cartContext'

function useCart() {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return cartContext
}

export default useCart
