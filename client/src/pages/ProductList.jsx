import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

const ProductList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products?.items ?? []);
  const loading  = useSelector((state) => state.products?.loading ?? false);
  const error    = useSelector((state) => state.products?.error ?? null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenAdd   = () => { setEditProduct(null); setShowForm(true); };
  const handleOpenEdit  = (product) => { setEditProduct(product); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditProduct(null); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">📱 Mobile Store</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} in catalogue
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-colors duration-200"
        >
          + Add Product
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-6 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && products.length === 0 && (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-lg">
          Loading products...
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-24 text-slate-400 dark:text-slate-500">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-1">No products yet</h3>
          <p className="text-sm">Click "Add Product" to add your first mobile phone.</p>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onEdit={handleOpenEdit} />
        ))}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <ProductForm onClose={handleCloseForm} editProduct={editProduct} />
      )}
    </div>
  );
};

export default ProductList;