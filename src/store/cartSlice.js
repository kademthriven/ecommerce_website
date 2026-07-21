import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCartItems, putCartData } from '../api/cart'

export const fetchCartData = createAsyncThunk(
  'cart/fetchCartData',
  async (userEmail, { rejectWithValue, signal }) => {
    try {
      return await getCartItems(userEmail, signal)
    } catch (error) {
      if (signal.aborted) {
        throw error
      }

      return rejectWithValue(error.message)
    }
  },
)

export const sendCartData = createAsyncThunk(
  'cart/sendCartData',
  async ({ userEmail, cart }, { rejectWithValue, signal }) => {
    try {
      return await putCartData(userEmail, cart, signal)
    } catch (error) {
      if (signal.aborted) {
        throw error
      }

      return rejectWithValue(error.message)
    }
  },
)

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
export default cartSlice.reducer
