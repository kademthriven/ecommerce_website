import { useCallback, useEffect, useMemo, useState } from 'react'
import { createCartItem, deleteCartItem, getCartItems } from '../api/cart'
import useAuth from '../hooks/useAuth'
import CartContext from './cartContext'

function getCartItemKey(item) {
  return item.productId || item.title
}

function groupCartItems(savedCartItems) {
  return savedCartItems.reduce((groupedItems, savedItem) => {
    const itemKey = getCartItemKey(savedItem)
    const existingItem = groupedItems.find((item) => getCartItemKey(item) === itemKey)
    const quantity = Number(savedItem.quantity) || 1

    if (existingItem) {
      existingItem.quantity += quantity
      if (savedItem._id) {
        existingItem.recordIds.push(savedItem._id)
      }
      return groupedItems
    }

    return [
      ...groupedItems,
      {
        imageUrl: savedItem.imageUrl,
        price: savedItem.price,
        productId: savedItem.productId,
        quantity,
        recordIds: savedItem._id ? [savedItem._id] : [],
        title: savedItem.title,
      },
    ]
  }, [])
}

function CartProvider({ children }) {
  const { userEmail } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartError, setCartError] = useState('')
  const [isCartLoading, setIsCartLoading] = useState(false)

  const loadCartItems = useCallback(async () => {
    if (!userEmail) {
      setCartItems([])
      return []
    }

    setCartError('')
    setIsCartLoading(true)

    try {
      const savedCartItems = await getCartItems(userEmail)

      const groupedCartItems = groupCartItems(savedCartItems)
      setCartItems(groupedCartItems)
      return groupedCartItems
    } catch (error) {
      setCartError(error.message)
      throw error
    } finally {
      setIsCartLoading(false)
    }
  }, [userEmail])

  const addItemToCart = useCallback(
    async (product) => {
      if (!userEmail) {
        throw new Error('Please log in before adding products to your cart.')
      }

      setCartError('')
      const savedItem = await createCartItem(userEmail, product)
      const itemKey = getCartItemKey(product)

      setCartItems((currentCartItems) => {
        const existingItem = currentCartItems.find(
          (item) => getCartItemKey(item) === itemKey,
        )

        if (existingItem) {
          return currentCartItems.map((item) =>
            getCartItemKey(item) === itemKey
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  recordIds: savedItem._id
                    ? [...item.recordIds, savedItem._id]
                    : item.recordIds,
                }
              : item,
          )
        }

        return [
          ...currentCartItems,
          {
            imageUrl: product.imageUrl,
            price: product.price,
            productId: itemKey,
            quantity: 1,
            recordIds: savedItem._id ? [savedItem._id] : [],
            title: product.title,
          },
        ]
      })
    },
    [userEmail],
  )

  const decreaseItemQuantity = useCallback(
    async (itemKey) => {
      const cartItem = cartItems.find((item) => getCartItemKey(item) === itemKey)

      if (!cartItem || !userEmail) {
        return
      }

      const recordId = cartItem.recordIds.at(-1)

      if (!recordId) {
        const error = new Error('Could not update the cart item: its saved record is missing.')
        setCartError(error.message)
        throw error
      }

      setCartError('')
      setIsCartLoading(true)

      try {
        await deleteCartItem(userEmail, recordId)
        setCartItems((currentCartItems) =>
          currentCartItems.flatMap((item) => {
            if (getCartItemKey(item) !== itemKey) {
              return [item]
            }

            if (item.quantity <= 1) {
              return []
            }

            return [{
              ...item,
              quantity: item.quantity - 1,
              recordIds: item.recordIds.filter((id) => id !== recordId),
            }]
          }),
        )
      } catch (error) {
        setCartError(error.message)
        throw error
      } finally {
        setIsCartLoading(false)
      }
    },
    [cartItems, userEmail],
  )

  const removeItemFromCart = useCallback(
    async (itemKey) => {
      const cartItem = cartItems.find((item) => getCartItemKey(item) === itemKey)

      if (!cartItem || !userEmail) {
        return
      }

      setCartError('')
      setIsCartLoading(true)

      try {
        await Promise.all(
          cartItem.recordIds.map((recordId) => deleteCartItem(userEmail, recordId)),
        )
        setCartItems((currentCartItems) =>
          currentCartItems.filter((item) => getCartItemKey(item) !== itemKey),
        )
      } catch (error) {
        setCartError(error.message)
        throw error
      } finally {
        setIsCartLoading(false)
      }
    },
    [cartItems, userEmail],
  )

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  useEffect(() => {
    if (!userEmail) {
      return undefined
    }

    let isCurrent = true

    getCartItems(userEmail)
      .then((savedCartItems) => {
        if (isCurrent) {
          setCartItems(groupCartItems(savedCartItems))
          setCartError('')
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setCartError(error.message)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [userEmail])

  const value = useMemo(
    () => ({
      addItemToCart,
      cartError,
      cartItems,
      cartQuantity,
      cartTotal,
      decreaseItemQuantity,
      increaseItemQuantity: addItemToCart,
      isCartLoading,
      loadCartItems,
      removeItemFromCart,
    }),
    [
      addItemToCart,
      cartError,
      cartItems,
      cartQuantity,
      cartTotal,
      decreaseItemQuantity,
      isCartLoading,
      loadCartItems,
      removeItemFromCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
