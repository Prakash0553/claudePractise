// ============================================================
// store/store.js — REDUX STORE CONFIGURATION
// ============================================================
// The STORE is the single centralised state container for
// the entire React app. Every piece of global state lives here.
//
// configureStore() from Redux Toolkit:
//   - Sets up the Redux DevTools Extension automatically
//   - Adds redux-thunk middleware automatically (needed for
//     async thunks in productSlice)
//   - Combines all reducers under named keys
//
// The "reducer" object keys define how state is structured:
//   store.getState() → { products: { items: [], loading, error } }
//
// To access state in a component:
//   useSelector(state => state.products.items)
//                              ↑ matches the key below
// ============================================================

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";

const store = configureStore({
  reducer: {
    // "products" is the key used in useSelector
    // productReducer manages { items, loading, error }
    products: productReducer,
  },
});

export default store;