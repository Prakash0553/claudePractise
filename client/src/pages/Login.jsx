// ============================================================
// pages/Login.jsx
// ============================================================
// Dispatches the login thunk on submit.
// On success, Redux state.auth.user is set → App.jsx redirects
// to the product list automatically via conditional rendering.
// ============================================================

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/slices/authSlice";

const Login = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📱</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Welcome back</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Login to your account</p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="you@example.com" required
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="••••••••" required
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ── Switch to Signup ── */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;