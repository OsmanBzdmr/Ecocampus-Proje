import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LogOut, Package, Home, Leaf, Search, ChevronLeft, ChevronRight, User, Heart, Menu, X, Sun, Moon, ShoppingBag, Gift } from 'lucide-react';
import { fetchProducts as fetchProductsApi, deleteProduct as deleteProductApi, fetchCategories, toggleFavorite as toggleFavoriteApi, getFavorites as getFavoritesApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ProductDetail from './ProductDetail';
import StatsCard from './StatsCard';
import Toast from './Toast';
import ProfilePage from './ProfilePage';

function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch {
    return null;
  }
}

export default function Dashboard({ token, onLogout }) {
  const { dark, toggle: toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProductId, setDetailProductId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUserId = getUserIdFromToken(token);

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
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Kategori yükleme hatası:', err));
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
      const res = await fetchProductsApi(params, token);
      setProducts(res.data);
      setTotalPages(parseInt(res.headers['x-total-pages'] || '1', 10));
      setTotalCount(parseInt(res.headers['x-total-count'] || '0', 10));
      setForSaleCount(parseInt(res.headers['x-for-sale-count'] || '0', 10));
      setDonationCount(parseInt(res.headers['x-donation-count'] || '0', 10));
    } catch (err) {
      console.error('Ürün yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, minPrice, maxPrice, statusFilter, page, limit, token]);

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    }
  }, [loadProducts, activeTab]);

  const loadFavorites = useCallback(async () => {
    setFavoritesLoading(true);
    try {
      const res = await getFavoritesApi(token);
      setFavorites(res.data);
    } catch (err) {
      console.error('Favori yükleme hatası:', err);
    } finally {
      setFavoritesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'favorites') loadFavorites();
  }, [activeTab, loadFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = async (productId) => {
    try {
      await toggleFavoriteApi(productId, token);
      if (activeTab === 'products') loadProducts();
      if (activeTab === 'favorites') loadFavorites();
    } catch (err) {
      setToast({ type: 'error', message: 'Favori işlemi başarısız' });
      console.error('Favori toggle hatası:', err);
    }
  };

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

  const handleCloseToast = useCallback(() => setToast(null), []);

  const handleViewDetail = (product) => {
    setDetailProductId(product.id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveTab('add');
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
      {toast && <Toast toast={toast} onClose={handleCloseToast} />}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen bg-paper paper-panel dark:bg-[var(--bg-primary)] flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-moss-800 dark:bg-moss-900">
          <div className="flex items-center gap-3">
            <div className="bg-moss-500 p-1.5 rounded-lg">
              <Leaf className="w-5 h-5 text-paper" />
            </div>
            <span className="font-display text-lg font-black text-paper">EcoCampus</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-paper hover:bg-moss-700 transition"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-paper hover:bg-moss-700 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar - Desktop: always visible, Mobile: slide-out drawer */}
        <aside className={`
          w-64 bg-moss-800 dark:bg-moss-900 text-paper p-6 flex flex-col
          md:min-h-screen md:static md:translate-x-0
          fixed inset-y-0 left-0 z-50 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-moss-500 p-2 rounded-lg">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-black">EcoCampus</h1>
                <p className="text-moss-300 text-xs font-body">Pazaryeri</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-moss-300 hover:bg-moss-700 transition md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2 mb-8">
            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'products'
                  ? 'bg-moss-500 text-paper'
                  : 'text-moss-200 hover:bg-moss-700'
              }`}
            >
              <Home className="w-5 h-5" />
              Tüm İlanlar
              {totalCount > 0 && (
                <span className="ml-auto bg-mustard-500 text-moss-900 px-2 py-1 rounded text-xs font-mono font-semibold">
                  {totalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('add'); setEditingProduct(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'add'
                  ? 'bg-moss-500 text-paper'
                  : 'text-moss-200 hover:bg-moss-700'
              }`}
            >
              <Package className="w-5 h-5" />
              İlan Ver
            </button>
            <button
              onClick={() => { setActiveTab('favorites'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'favorites'
                  ? 'bg-moss-500 text-paper'
                  : 'text-moss-200 hover:bg-moss-700'
              }`}
            >
              <Heart className="w-5 h-5" />
              Favorilerim
              {favorites.length > 0 && (
                <span className="ml-auto bg-clay-500 px-2 py-1 rounded text-xs font-mono font-semibold">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'profile'
                  ? 'bg-moss-500 text-paper'
                  : 'text-moss-200 hover:bg-moss-700'
              }`}
            >
              <User className="w-5 h-5" />
              Profil
            </button>
          </nav>

          <div className="mt-auto space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 bg-moss-700 hover:bg-moss-600 text-paper px-4 py-3 rounded-lg transition font-semibold font-body"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {dark ? 'Aydınlık Mod' : 'Karanlık Mod'}
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-clay-600 hover:bg-clay-700 text-paper px-4 py-3 rounded-lg transition font-semibold font-body"
            >
              <LogOut className="w-5 h-5" />
              Güvenli Çıkış
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h2 className="font-display text-3xl font-black text-ink dark:text-[var(--text-primary)] mb-2">
                Hoş Geldiniz! 👋
              </h2>
              <p className="text-ink/60 dark:text-[var(--text-secondary)] font-body">
                {new Date().toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Add/Edit Listing Tab */}
            {activeTab === 'add' && (
              <div className="flex justify-center items-start min-h-[70vh] pt-4 animate-fade-in-up">
                <div className="max-w-2xl w-full">
                  <ProductForm
                    token={token}
                    editingProduct={editingProduct}
                    onProductAdded={() => { handleProductSaved(); setActiveTab('products'); }}
                    onCancelEdit={() => { handleCancelEdit(); setActiveTab('products'); }}
                  />
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Toplam İlan"
                    value={totalCount}
                    icon="📦"
                    color="bg-moss-100 text-moss-700 dark:bg-moss-800 dark:text-moss-200"
                  />
                  <StatsCard
                    title="Satılık Ürün"
                    value={forSaleCount}
                    icon="💰"
                    color="bg-mustard-100 text-mustard-600 dark:bg-mustard-900 dark:text-mustard-200"
                  />
                  <StatsCard
                    title="Bağış"
                    value={donationCount}
                    icon="✨"
                    color="bg-clay-100 text-clay-600 dark:bg-clay-900 dark:text-clay-200"
                  />
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-4 md:p-6 space-y-4 border border-line/40 dark:border-[var(--border-color)]">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 dark:text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="İlanlarda ara..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:border-[var(--border-color)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
                      />
                    </div>
                    <div className="md:w-44">
                      <select
                        value={categoryFilter}
                        onChange={handleCategoryFilter}
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-white dark:bg-[var(--bg-secondary)] dark:border-[var(--border-color)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
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
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-white dark:bg-[var(--bg-secondary)] dark:border-[var(--border-color)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
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
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:border-[var(--border-color)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
                        min="0"
                      />
                    </div>
                    <div className="md:w-48">
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPrice}
                        placeholder="Max fiyat"
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:border-[var(--border-color)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
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
                  onToggleFavorite={handleToggleFavorite}
                  loading={loading}
                  categories={categories}
                  currentUserId={currentUserId}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-line dark:border-[var(--border-color)] text-ink/70 dark:text-[var(--text-secondary)] hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium font-body"
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
                            ? 'bg-moss-500 text-paper'
                            : 'border border-line dark:border-[var(--border-color)] text-ink/70 dark:text-[var(--text-secondary)] hover:bg-paper dark:hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-line dark:border-[var(--border-color)] text-ink/70 dark:text-[var(--text-secondary)] hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium font-body"
                    >
                      Sonraki
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="font-display text-2xl font-black text-ink dark:text-[var(--text-primary)]">Favorilerim</h2>
                {favoritesLoading ? (
                  <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8 flex justify-center border border-line/40 dark:border-[var(--border-color)]">
                    <div className="w-8 h-8 border-4 border-moss-200 border-t-moss-500 rounded-full animate-spin" />
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-12 text-center border border-line/40 dark:border-[var(--border-color)]">
                    <Heart className="w-16 h-16 text-line dark:text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-ink/70 dark:text-[var(--text-secondary)] text-lg font-display font-bold">Henüz favori ilanınız yok</p>
                    <p className="text-ink/40 dark:text-[var(--text-muted)] text-sm mt-1 font-body">İlanların üzerindeki kalp ikonuna tıklayarak favorilere ekleyebilirsiniz</p>
                  </div>
                ) : (
                  <ProductTable
                    products={favorites}
                    onDelete={(id) => setConfirmDelete(id)}
                    onEdit={handleEdit}
                    onViewDetail={handleViewDetail}
                    onToggleFavorite={handleToggleFavorite}
                    loading={favoritesLoading}
                    categories={categories}
                    currentUserId={currentUserId}
                  />
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
      <ProductDetail productId={detailProductId} onClose={() => setDetailProductId(null)} token={token} onToggleFavorite={handleToggleFavorite} />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl p-6 max-w-sm w-full space-y-4 border border-line/40 dark:border-[var(--border-color)] animate-scale-in">
            <h3 className="font-display text-xl font-black text-ink dark:text-[var(--text-primary)]">İlanı silmek istiyor musunuz?</h3>
            <p className="text-ink/60 dark:text-[var(--text-secondary)] font-body">Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-line dark:border-[var(--border-color)] text-ink/70 dark:text-[var(--text-secondary)] rounded-lg hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] font-medium transition disabled:opacity-50 font-body"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-clay-600 text-white rounded-lg hover:bg-clay-700 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2 font-body"
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