import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slug}/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/categories/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchBanners = createAsyncThunk(
  'products/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/banners/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    categories: [],
    banners: [],
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = Array.isArray(action.payload.results || action.payload) ? 
          (action.payload.results || action.payload) : []
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload
        state.categories = []
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.error = action.payload
        state.banners = []
      })
  },
})

export const { clearProduct } = productSlice.actions
export default productSlice.reducer

