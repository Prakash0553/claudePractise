import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct } from "../store/slices/productSlice";

const INITIAL_FORM = {
  name: "", brand: "", price: "", ram: "",
  storage: "", camera: "", description: "", inStock: true,
};

const ProductForm = ({ onClose, editProduct }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.products.loading);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name:        editProduct.name        || "",
        brand:       editProduct.brand       || "",
        price:       editProduct.price       || "",
        ram:         editProduct.ram         || "",
        storage:     editProduct.storage     || "",
        camera:      editProduct.camera      || "",
        description: editProduct.description || "",
        inStock:     editProduct.inStock     ?? true,
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const payload = { ...formData, price: Number(formData.price) };
    try {
      if (editProduct) {
        await dispatch(updateProduct({ id: editProduct._id, productData: payload })).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
      }
      setFormData(INITIAL_FORM);
      onClose();
    } catch (err) {
      setFormError(Array.isArray(err) ? err.join(", ") : err);
    }
  };

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      {/* ── Modal ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {editProduct ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Error ── */}
        {formError && (
          <div className="mx-6 mt-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {formError}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" name="name"    value={formData.name}    onChange={handleChange} placeholder="e.g. Galaxy S24 Ultra" />
            <Field label="Brand *"        name="brand"   value={formData.brand}   onChange={handleChange} placeholder="e.g. Samsung" />
            <Field label="Price (NPR) *"  name="price"   value={formData.price}   onChange={handleChange} type="number" placeholder="e.g. 155000" />
            <Field label="RAM *"          name="ram"     value={formData.ram}     onChange={handleChange} placeholder="e.g. 12GB" />
            <Field label="Storage *"      name="storage" value={formData.storage} onChange={handleChange} placeholder="e.g. 256GB" />
            <Field label="Camera"         name="camera"  value={formData.camera}  onChange={handleChange} placeholder="e.g. 108MP" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief product description..."
              rows={3}
              className="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 resize-none transition"
            />
          </div>

          {/* In Stock */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">In Stock</span>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={label.includes("*")}
      className="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
    />
  </div>
);

export default ProductForm;