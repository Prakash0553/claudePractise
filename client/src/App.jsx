// ============================================================
// App.jsx — ROOT + AUTH GUARD
// ============================================================
// Instead of React Router, we use simple conditional rendering:
//   - No user in Redux → show Login or Signup
//   - User exists      → show ProductList
//
// This is the "auth guard" pattern without a router library.
// ============================================================

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/slices/authSlice";
import ProductList from "./pages/ProductList";
import Login  from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [dark, setDark]       = useState(() => localStorage.getItem("theme") === "dark");
  const [showLogin, setShowLogin] = useState(true); // toggle between Login and Signup

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // null if not logged in

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    dark
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

      {/* ── Top Bar (always visible) ── */}
      <div className="flex justify-between items-center px-6 py-4">
        {/* Show user info + logout when logged in */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
            <button
              onClick={() => dispatch(logout())}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📱 Mobile Store</span>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* ── Page Content ── */}
      {user ? (
        // ✅ Logged in — show products
        <ProductList />
      ) : showLogin ? (
        // 🔐 Not logged in — show Login
        <Login onSwitch={() => setShowLogin(false)} />
      ) : (
        // 📝 Not logged in — show Signup
        <Signup onSwitch={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;