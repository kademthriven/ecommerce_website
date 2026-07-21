import { createSlice } from '@reduxjs/toolkit'
import { fetchCartData, sendCartData } from './cartSlice'

function getRejectedMessage(action, fallbackMessage) {
  return action.payload || action.error.message || fallbackMessage
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeRequestId: null,
    notification: null,
  },
  reducers: {
    showNotification(state, action) {
      state.activeRequestId = null
      state.notification = action.payload
    },
    clearNotification(state) {
      state.activeRequestId = null
      state.notification = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state, action) => {
        state.activeRequestId = action.meta.requestId
        state.notification = {
          status: 'pending',
          title: 'Sending...',
          message: 'Loading cart data!',
        }
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return
        }

        state.activeRequestId = null
        state.notification = {
          status: 'success',
          title: 'Success!',
          message: 'Loaded cart data successfully!',
        }
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return
        }

        state.activeRequestId = null
        state.notification = action.meta.aborted
          ? null
          : {
              status: 'error',
              title: 'Error!',
              message: getRejectedMessage(action, 'Could not load cart data.'),
            }
      })
      .addCase(sendCartData.pending, (state, action) => {
        state.activeRequestId = action.meta.requestId
        state.notification = {
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data!',
        }
      })
      .addCase(sendCartData.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return
        }

        state.activeRequestId = null
        state.notification = {
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        }
      })
      .addCase(sendCartData.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return
        }

        state.activeRequestId = null
        state.notification = action.meta.aborted
          ? null
          : {
              status: 'error',
              title: 'Error!',
              message: getRejectedMessage(action, 'Could not send cart data.'),
            }
      })
  },
})

export const uiActions = uiSlice.actions
export default uiSlice.reducer
