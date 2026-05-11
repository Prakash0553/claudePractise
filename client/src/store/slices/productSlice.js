// ============================================================
// store/slices/productSlice.js — REDUX SLICE
// ============================================================
// In Redux Toolkit a "slice" bundles together:
//   1. STATE      — the initial shape of this feature's data
//   2. REDUCERS   — pure functions that update the state
//   3. ACTIONS    — auto-generated from reducer names
//   4. THUNKS     — async operations (API calls) via createAsyncThunk
//
// WHY SLICE? Instead of writing separate action-types, action-creators,
// and reducer switch-cases (old Redux), a slice collapses all three
// into one place using Redux Toolkit's createSlice + createAsyncThunk.
//
// DATA FLOW (Redux):
//
//   Component dispatches a Thunk
//       ↓
//   Thunk runs async axios call to Express API
//       ↓
//   API responds with JSON
//       ↓
//   Thunk dispatches fulfilled/rejected action automatically
//       ↓
//   extraReducers handles the action → updates state in store
//       ↓
//   useSelector in component picks up new state → re-render
// ============================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/products"

// ── ASYNC THUNKS ────────────────────────────────────────────
// createAsyncThunk(actionTypePrefix, payloadCreator)
// It auto-dispatches three actions:
//   prefix/pending   → when the async call starts
//   prefix/fulfilled → when the promise resolves (success)
//   prefix/rejected  → when the promise rejects (error)
// We handle all three in extraReducers below.

// Fetch all products — GET /api/products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.data; // returned value becomes action.payload in fulfilled
    } catch (err) {
      // rejectWithValue sends a custom error to the rejected handler
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Create a product — POST /api/products
// productData is passed in when the thunk is dispatched: dispatch(addProduct(data))
export const addProduct = createAsyncThunk(
  "products/add",
  async (productData, thunkAPI) => {
    try {
      const res = await axios.post(API_URL, productData);
      return res.data.data; // the newly created product document from MongoDB
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// Update a product — PUT /api/products/:id
// Receives { id, productData } as a single argument
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, productData);
      return res.data.data; // the updated document
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete a product — DELETE /api/products/:id
// Returns the id so we know which item to remove from state
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id; // pass id back as payload so reducer can filter it out
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// ── SLICE ───────────────────────────────────────────────────
const productSlice = createSlice({
  name: "products",

  // Initial state shape for this slice
  initialState: {
    items: [],        // array of product objects
    loading: false,   // true while any async operation is in progress
    error: null,      // error message string or null
  },

  // REDUCERS: synchronous state changes
  // These generate plain action creators automatically.
  // e.g. productSlice.actions.clearError()
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  // EXTRA REDUCERS: handle async thunk lifecycle actions
  // Builder pattern: builder.addCase(thunk.status, handler)
  // Immer (built into RTK) lets us "mutate" state directly —
  // it produces a new immutable object under the hood.
  extraReducers: (builder) => {
    builder
      // ── fetchProducts ──────────────────────────────────
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // replace full list
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── addProduct ─────────────────────────────────────
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // prepend to list
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── updateProduct ──────────────────────────────────
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Find the index of the updated product and replace it
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── deleteProduct ──────────────────────────────────
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload = the id we returned from the thunk
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the synchronous action creator
export const { clearError } = productSlice.actions;

// Export the reducer to be added to the store
export default productSlice.reducer;