import React, { useState } from 'react';
import { LogOut, Package, Home, Leaf } from 'lucide-react';
import { deleteProduct as deleteProductApi } from '../services/api';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import StatsCard from './StatsCard';
import Toast from './Toast';

export default function Dashboard({ token, onLogout, products, loading, onProductAdded, fetchProducts }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteProductApi(id, token);
      setToast({ type: 'success', message: 'İlan başarıyla silindi' });
      setConfirmDelete(null);
      fetchProducts();
    } catch (error) {
      setToast({ type: 'error', message: 'Silme işleminde hata oluştu' });
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 md:min-h-screen">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-eco-500 p-2 rounded-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EcoCampus</h1>
              <p className="text-gray-400 text-xs">Pazaryeri</p>
            </div>
          </div>

          <nav className="space-y-2 mb-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'dashboard'
                  ? 'bg-eco-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'products'
                  ? 'bg-eco-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Package className="w-5 h-5" />
              İlanlarım
              <span className="ml-auto bg-eco-600 px-2 py-1 rounded text-xs font-semibold">
                {products.length}
              </span>
            </button>
          </nav>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold mt-auto"
          >
            <LogOut className="w-5 h-5" />
            Güvenli Çıkış
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Hoş Geldiniz! 👋
              </h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Toplam İlan"
                    value={products.length}
                    icon="📦"
                    color="bg-blue-100 text-blue-600"
                  />
                  <StatsCard
                    title="Satılık Ürün"
                    value={products.filter(p => p.price > 0).length}
                    icon="💰"
                    color="bg-green-100 text-green-600"
                  />
                  <StatsCard
                    title="Bağış"
                    value={products.filter(p => p.price == 0).length}
                    icon="✨"
                    color="bg-eco-100 text-eco-600"
                  />
                </div>

                {/* Add Product Form */}
                <ProductForm token={token} onProductAdded={onProductAdded} />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <ProductTable
                products={products}
                onDelete={(id) => setConfirmDelete(id)}
                loading={loading}
              />
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-900">İlanı silmek istiyor musunuz?</h3>
            <p className="text-gray-600">Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? '...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
