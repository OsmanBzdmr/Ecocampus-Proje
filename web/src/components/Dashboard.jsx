import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Package, Home, Leaf, Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { fetchProducts as fetchProductsApi, deleteProduct as deleteProductApi, fetchCategories } from '../services/api';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ProductDetail from './ProductDetail';
import StatsCard from './StatsCard';
import Toast from './Toast';
import ProfilePage from './ProfilePage';

export default function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProductId, setDetailProductId] = useState(null);

  // Search / filter / pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [forSaleCount, setForSaleCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const limit = 10;

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Kategori yükleme hatası:', err));
  }, []);

  const loadStats = useCallback(() => {
    fetchProductsApi({ page: 1, limit: 1 }).then((res) => {
      setTotalCount(parseInt(res.headers['x-total-count'] || '0', 10));
      setForSaleCount(parseInt(res.headers['x-for-sale-count'] || '0', 10));
      setDonationCount(parseInt(res.headers['x-donation-count'] || '0', 10));
    }).catch((err) => console.error('İstatistik yükleme hatası:', err));
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (categoryFilter) params.category_id = categoryFilter;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (statusFilter) params.status = statusFilter;
      const res = await fetchProductsApi(params);
      setProducts(res.data);
      setTotalPages(parseInt(res.headers['x-total-pages'] || '1', 10));
    } catch (err) {
      console.error('Ürün yükleme hatası:', err);
    } finally {
      setLoading(false);
      loadStats();
    }
  }, [search, categoryFilter, minPrice, maxPrice, statusFilter, page, limit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleViewDetail = (product) => {
    setDetailProductId(product.id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveTab('dashboard');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    setEditingProduct(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteProductApi(id, token);
      setToast({ type: 'success', message: 'İlan başarıyla silindi' });
      setConfirmDelete(null);
      loadProducts();
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
        <aside className="w-full md:w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 md:min-h-screen flex flex-col">
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
              onClick={() => { setActiveTab('dashboard'); setEditingProduct(null); }}
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
              {totalCount > 0 && (
                <span className="ml-auto bg-eco-600 px-2 py-1 rounded text-xs font-semibold">
                  {totalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'profile'
                  ? 'bg-eco-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              Profil
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
                    value={totalCount}
                    icon="📦"
                    color="bg-blue-100 text-blue-600"
                  />
                  <StatsCard
                    title="Satılık Ürün"
                    value={forSaleCount}
                    icon="💰"
                    color="bg-green-100 text-green-600"
                  />
                  <StatsCard
                    title="Bağış"
                    value={donationCount}
                    icon="✨"
                    color="bg-eco-100 text-eco-600"
                  />
                </div>

                {/* Product Form (Add / Edit) */}
                <ProductForm
                  token={token}
                  editingProduct={editingProduct}
                  onProductAdded={handleProductSaved}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="İlanlarda ara..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div className="md:w-44">
                      <select
                        value={categoryFilter}
                        onChange={handleCategoryFilter}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition bg-white"
                      >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:w-40">
                      <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition bg-white"
                      >
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="reserved">Rezerve</option>
                        <option value="sold">Satıldı</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-48">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPrice}
                        placeholder="Min fiyat"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
                        min="0"
                      />
                    </div>
                    <div className="md:w-48">
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPrice}
                        placeholder="Max fiyat"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Table */}
                <ProductTable
                  products={products}
                  onDelete={(id) => setConfirmDelete(id)}
                  onEdit={handleEdit}
                  onViewDetail={handleViewDetail}
                  loading={loading}
                  categories={categories}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Önceki
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          p === page
                            ? 'bg-eco-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Sonraki
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <ProfilePage token={token} onLogout={onLogout} />
            )}
          </div>
        </main>
      </div>

      {/* Product Detail Modal */}
      <ProductDetail productId={detailProductId} onClose={() => setDetailProductId(null)} />

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