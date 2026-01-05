import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/api'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/items/', {
        product: product.id,
        quantity,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cart/items/${itemId}/`, { quantity })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/items/${itemId}/delete/`)
      return itemId
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart/clear/')
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalItems = action.payload.total_items || 0
        state.totalPrice = parseFloat(action.payload.total_price || 0)
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Refetch cart to get updated data
        // In a real app, you might want to optimistically update here
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        // Refetch cart to get updated data
        // In a real app, you might want to optimistically update here
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.totalItems = 0
        state.totalPrice = 0
      })
  },
})

export default cartSlice.reducer

