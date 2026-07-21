import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createCartItem, deleteCartItem } from '../api/cart'
import useAuth from '../hooks/useAuth'
import { fetchCartData, sendCartData } from '../store/cartSlice'
import { uiActions } from '../store/uiSlice'
import CartContext from './cartContext'

function getCartItemKey(item) {
  return item.productId || item.title
}

function getCartErrorMessage(error) {
  return typeof error === 'string' ? error : error.message
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
  const dispatch = useDispatch()
  const [cartItems, setCartItems] = useState([])
  const [cartError, setCartError] = useState('')
  const [hasHydratedCart, setHasHydratedCart] = useState(false)
  const [isCartLoading, setIsCartLoading] = useState(false)

  const loadCartItems = useCallback(async () => {
    if (!userEmail) {
      setCartItems([])
      return []
    }

    setCartError('')
    setIsCartLoading(true)

    try {
      const savedCartItems = await dispatch(fetchCartData(userEmail)).unwrap()

      const groupedCartItems = groupCartItems(savedCartItems)
      setCartItems(groupedCartItems)
      setHasHydratedCart(true)
      return groupedCartItems
    } catch (error) {
      setCartError(getCartErrorMessage(error))
      throw error
    } finally {
      setIsCartLoading(false)
    }
  }, [dispatch, userEmail])

  const addItemToCart = useCallback(
    async (product) => {
      if (!userEmail) {
        throw new Error('Please log in before adding products to your cart.')
      }

      setCartError('')
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      }))

      try {
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
        dispatch(uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        }))
      } catch (error) {
        setCartError(error.message)
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message,
        }))
        throw error
      }
    },
    [dispatch, userEmail],
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
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message,
        }))
        throw error
      }

      setCartError('')
      setIsCartLoading(true)
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      }))

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
        dispatch(uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        }))
      } catch (error) {
        setCartError(error.message)
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message,
        }))
        throw error
      } finally {
        setIsCartLoading(false)
      }
    },
    [cartItems, dispatch, userEmail],
  )

  const removeItemFromCart = useCallback(
    async (itemKey) => {
      const cartItem = cartItems.find((item) => getCartItemKey(item) === itemKey)

      if (!cartItem || !userEmail) {
        return
      }

      setCartError('')
      setIsCartLoading(true)
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      }))

      try {
        await Promise.all(
          cartItem.recordIds.map((recordId) => deleteCartItem(userEmail, recordId)),
        )
        setCartItems((currentCartItems) =>
          currentCartItems.filter((item) => getCartItemKey(item) !== itemKey),
        )
        dispatch(uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        }))
      } catch (error) {
        setCartError(error.message)
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message,
        }))
        throw error
      } finally {
        setIsCartLoading(false)
      }
    },
    [cartItems, dispatch, userEmail],
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
    const controller = new AbortController()

    dispatch(fetchCartData(userEmail, { signal: controller.signal }))
      .unwrap()
      .then((savedCartItems) => {
        if (isCurrent) {
          setCartItems(groupCartItems(savedCartItems))
          setCartError('')
          setHasHydratedCart(true)
        }
      })
      .catch((error) => {
        if (isCurrent && error.name !== 'AbortError') {
          setCartError(getCartErrorMessage(error))
        }
      })

    return () => {
      isCurrent = false
      controller.abort()
    }
  }, [dispatch, userEmail])

  useEffect(() => {
    if (!userEmail || !hasHydratedCart) {
      return undefined
    }

    const controller = new AbortController()
    const items = cartItems.map(({ imageUrl, price, productId, quantity, title }) => ({
      imageUrl,
      price,
      productId,
      quantity,
      title,
    }))
    const cart = {
      items,
      totalAmount: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      totalQuantity: items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    }

    dispatch(sendCartData({ userEmail, cart }, { signal: controller.signal }))

    return () => {
      controller.abort()
    }
  }, [cartItems, dispatch, hasHydratedCart, userEmail])

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
