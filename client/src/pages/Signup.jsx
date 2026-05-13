// ============================================================
// pages/Signup.jsx
// ============================================================

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../store/slices/authSlice";

const Signup = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(clearError());

    if (formData.password !== formData.confirm) {
      return setLocalError("Passwords do not match");
    }

    dispatch(signup({ name: formData.name, email: formData.email, password: formData.password }));
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📱</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Create account</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Start managing your products</p>
        </div>

        {/* ── Error ── */}
        {displayError && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
            ⚠️ {displayError}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full Name"        name="name"     type="text"     value={formData.name}     onChange={handleChange} placeholder="John Doe" />
          <Field label="Email"            name="email"    type="email"    value={formData.email}    onChange={handleChange} placeholder="you@example.com" />
          <Field label="Password"         name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
          <Field label="Confirm Password" name="confirm"  type="password" value={formData.confirm}  onChange={handleChange} placeholder="Repeat password" />

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* ── Switch to Login ── */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, name, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
      {label}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required
      className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
    />
  </div>
);

export default Signup;