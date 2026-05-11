import { useDispatch } from "react-redux";
import { deleteProduct } from "../store/slices/productSlice";

const ProductCard = ({ product, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      dispatch(deleteProduct(product._id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">

      {/* ── Stock Badge ── */}
      <div className="flex justify-between items-start">
        <span className="text-3xl">📱</span>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            product.inStock
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* ── Name & Brand ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 leading-tight">{product.name}</h3>
        <p className="text-sm text-slate-400 font-medium">{product.brand}</p>
      </div>

      {/* ── Specs ── */}
      <div className="flex flex-wrap gap-2">
        <SpecBadge icon="💾" label={product.ram} />
        <SpecBadge icon="🗄️" label={product.storage} />
        {product.camera && <SpecBadge icon="📷" label={product.camera} />}
      </div>

      {/* ── Description ── */}
      {product.description && (
        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
          {product.description}
        </p>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
        <span className="text-xl font-extrabold text-indigo-600">
          NPR {product.price?.toLocaleString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SpecBadge = ({ icon, label }) => (
  <span className="flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
    {icon} {label}
  </span>
);

export default ProductCard;