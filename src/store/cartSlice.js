import { createSlice } from '@reduxjs/toolkit'

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
