import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Loader, X } from 'lucide-react';
import { addProduct as addProductApi, updateProduct as updateProductApi, fetchCategories } from '../services/api';
import Toast from './Toast';

export default function ProductForm({ token, editingProduct, onProductAdded, onCancelEdit }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image_url: '',
    category_id: '',
    status: 'active',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const isEditing = !!editingProduct;

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setForm((prev) => ({ ...prev, category_id: res.data[0].id }));
        }
      })
      .catch((err) => console.error('Kategori yükleme hatası:', err));
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        title: editingProduct.title || '',
        price: editingProduct.price?.toString() || '',
        description: editingProduct.description || '',
        image_url: editingProduct.image_url || '',
        category_id: editingProduct.category_id?.toString() || '',
        status: editingProduct.status || 'active',
      });
      setImageFile(null);
    } else if (categories.length > 0) {
      setForm((prev) => ({
        ...prev,
        category_id: categories[0].id
      }));
    }
  }, [editingProduct, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      setToast({ type: 'error', message: 'Lütfen gerekli alanları doldurunuz' });
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('price', form.price);
      if (form.description) fd.append('description', form.description);
      if (form.image_url && !imageFile) fd.append('image_url', form.image_url);
      if (form.category_id) fd.append('category_id', form.category_id);
      if (isEditing && form.status) fd.append('status', form.status);
      if (imageFile) fd.append('image', imageFile);

      if (isEditing) {
        await updateProductApi(editingProduct.id, fd, token);
        setToast({ type: 'success', message: 'İlan başarıyla güncellendi!' });
      } else {
        await addProductApi(fd, token);
        const isDonation = parseFloat(form.price) === 0;
        setToast({
          type: 'success',
          message: isDonation ? 'Bağış başarıyla eklendi!' : 'Ürün başarıyla eklendi!'
        });
      }

      setForm({
        title: '',
        price: '',
        description: '',
        image_url: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        status: 'active',
      });
      setImageFile(null);

      onProductAdded();
    } catch (error) {
      setToast({ type: 'error', message: isEditing ? 'Güncelleme sırasında hata oluştu' : 'Ürün eklenirken hata oluştu' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      
      <div className={`bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8 border border-line/40 dark:border-[var(--border-color)] ${isEditing ? 'ring-2 ring-mustard-400' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditing ? 'bg-mustard-100 dark:bg-mustard-900/50' : 'bg-moss-100 dark:bg-moss-800'}`}>
              {isEditing ? (
                <Pencil className="w-6 h-6 text-mustard-600 dark:text-mustard-400" />
              ) : (
                <Plus className="w-6 h-6 text-moss-600 dark:text-moss-400" />
              )}
            </div>
            <h2 className="font-display text-2xl font-black text-ink dark:text-[var(--text-primary)]">
              {isEditing ? 'İlanı Düzenle' : 'Yeni İlan Ver'}
            </h2>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center gap-2 text-ink/50 dark:text-[var(--text-muted)] hover:text-ink/80 dark:hover:text-[var(--text-primary)] hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg transition font-medium font-body"
            >
              <X className="w-4 h-4" />
              İptal
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ink/70 dark:text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Ürün Adı
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Örn: Kullanılmış Laptop"
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/70 dark:text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Kategori
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-secondary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
            >
              {categories.length === 0 && <option value="">Kategoriler yükleniyor...</option>}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/70 dark:text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Fiyat (₺)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0 (Bağış için), veya 100"
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-ink/40 dark:text-[var(--text-muted)] mt-1 font-body">💡 Fiyat 0 ₺ ise otomatik olarak "Bağış" olarak işaretlenir</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/70 dark:text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Açıklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ürün hakkında bilgi verin..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition resize-none font-body"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/70 dark:text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Görsel
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-moss-100 dark:file:bg-moss-700 file:text-moss-700 dark:file:text-moss-200 file:font-semibold hover:file:bg-moss-200 dark:hover:file:bg-moss-600 font-body"
            />
            <p className="text-xs text-ink/40 dark:text-[var(--text-muted)] mt-1 font-body">JPG, PNG, GIF veya WEBP (max 5MB). Veya URL girmek isterseniz:</p>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setImageFile(null); }}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-paper/40 dark:bg-[var(--bg-tertiary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition mt-2 font-body"
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-xs font-semibold text-ink/70 dark:text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                Durum
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-secondary)] dark:text-[var(--text-primary)] focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
              >
                <option value="active">Aktif</option>
                <option value="reserved">Rezerve</option>
                <option value="sold">Satıldı</option>
              </select>
            </div>
          )}

          <div className="flex gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="flex-1 px-4 py-3 border border-line dark:border-[var(--border-color)] text-ink/70 dark:text-[var(--text-secondary)] rounded-lg hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] font-medium transition font-body"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${isEditing ? 'flex-1' : 'w-full'} bg-moss-600 hover:bg-moss-700 text-paper font-display font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-wide`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {isEditing ? 'Güncelleniyor...' : 'Ekleniyor...'}
                </>
              ) : (
                <>
                  {isEditing ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isEditing ? 'Kaydet' : 'İlan Ekle'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
