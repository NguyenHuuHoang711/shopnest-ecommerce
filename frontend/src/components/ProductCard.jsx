import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, onRequireAuth }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    try {
      setLoading(true);
      await addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      alert(err.message || 'Could not add to cart');
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-10 h-10 opacity-30" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-white/90 backdrop-blur text-slate-700 rounded-md shadow-xs">
            {product.category}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-sky-700 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality e-commerce item.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">
              ${Number(product.price).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={loading || isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
