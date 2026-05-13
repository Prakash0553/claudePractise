// ============================================================
// store/slices/authSlice.js — AUTH SLICE
// ============================================================
// Manages: user object, token, loading, error
//
// Token is stored in localStorage so the user stays
// logged in after page refresh.
//
// On every API call, axios reads the token from Redux state
// and adds it to the Authorization header via an axios
// interceptor set up in axiosInstance.js
// ============================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/auth";

// Load saved user from localStorage (persists across refreshes)
const savedUser = JSON.parse(localStorage.getItem("user") || "null");

// ── THUNKS ───────────────────────────────────────────────────

export const signup = createAsyncThunk("auth/signup", async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, userData);
    // Save to localStorage so user stays logged in on refresh
    localStorage.setItem("user", JSON.stringify(res.data.data));
    return res.data.data; // { _id, name, email, token }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Signup failed");
  }
});

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem("user", JSON.stringify(res.data.data));
    return res.data.data; // { _id, name, email, token }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// ── SLICE ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    savedUser,  // { _id, name, email, token } or null
    loading: false,
    error:   null,
  },
  reducers: {
    // Synchronous logout — clear state and localStorage
    logout(state) {
      state.user  = null;
      state.error = null;
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signup.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(signup.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(signup.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      // login
      .addCase(login.pending,    (state) => { state.loading = true;  state.error = null; })
      .addCase(login.fulfilled,  (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected,   (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;