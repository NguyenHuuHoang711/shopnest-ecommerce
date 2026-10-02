import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import AdminModal from './components/AdminModal';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { ShoppingBag, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [orderSuccessBanner, setOrderSuccessBanner] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Fashion', label: 'Fashion' },
    { id: 'Home', label: 'Home & Living' },
    { id: 'Sports', label: 'Sports' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts({
        category: selectedCategory,
        search: searchTerm,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const handleOrderPlaced = () => {
    setCheckoutModalOpen(false);
    setOrderSuccessBanner(true);
    setTimeout(() => setOrderSuccessBanner(false), 5000);
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Notification / Success Banner */}
      {orderSuccessBanner && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Your order has been placed successfully! Check your orders list.</span>
          <button
            onClick={() => setOrdersModalOpen(true)}
            className="underline ml-2 hover:text-emerald-100"
          >
            View Orders
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Minimal Header / Subheader */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Curated Lifestyle Goods
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Explore the Collection
              </h1>
              <p className="mt-1 text-sm text-slate-500 max-w-xl">
                Simple, reliable essentials designed for your everyday workspace and home.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="aspect-[4/3] bg-slate-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or clearing category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span>Showing {products.length} products</span>
              {selectedCategory !== 'all' && (
                <span className="font-medium text-slate-700">Filter: {selectedCategory}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRequireAuth={() => setAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ShopNest</span>
            <span>— Simple, Clean E-Commerce</span>
          </div>
          <div>
            Built with React, Node.js, Docker, Terraform & Jenkins
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <CartDrawer onProceedToCheckout={() => setCheckoutModalOpen(true)} />
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />
      <OrdersModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
      />
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onProductChange={fetchProducts}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
