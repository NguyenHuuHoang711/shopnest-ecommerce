import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { cartItems, totalPrice, clearCart, fetchCart } = useCart();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a delivery address.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.checkout({
        address: address.trim(),
        paymentMethod,
      });
      clearCart();
      await fetchCart();
      onOrderPlaced();
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-lg">Secure Checkout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Delivery Address
            </label>
            <textarea
              rows="3"
              required
              placeholder="House/Apartment number, street name, city..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 text-left border rounded-lg flex items-center gap-2 text-xs font-medium transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-sky-600 bg-sky-50 text-sky-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Truck className="w-4 h-4 text-sky-600" />
                <span>Cash on Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 text-left border rounded-lg flex items-center gap-2 text-xs font-medium transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-sky-600 bg-sky-50 text-sky-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>Online / Card</span>
              </button>
            </div>
          </div>

          {/* Order Summary box */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items ({cartItems.length}):</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
              <span>Total to Pay:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
