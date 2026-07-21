import { createSlice } from '@reduxjs/toolkit'
import { getCartItems } from '../api/cart'
import { uiActions } from './uiSlice'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isVisible: false,
  },
  reducers: {
    toggleCart(state) {
      state.isVisible = !state.isVisible
    },
    hideCart(state) {
      state.isVisible = false
    },
  },
})

export const cartActions = cartSlice.actions

export function fetchCartData(userEmail, signal) {
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Loading cart data!',
    }))

    try {
      const cartItems = await getCartItems(userEmail, signal)

      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Loaded cart data successfully!',
      }))

      return cartItems
    } catch (error) {
      if (error.name !== 'AbortError') {
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message,
        }))
      }

      throw error
    }
  }
}

export default cartSlice.reducer
