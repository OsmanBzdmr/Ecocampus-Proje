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
      
      <div className={`bg-white rounded-2xl shadow-lg p-8 ${isEditing ? 'ring-2 ring-eco-400' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditing ? 'bg-amber-100' : 'bg-eco-100'}`}>
              {isEditing ? (
                <Pencil className="w-6 h-6 text-amber-600" />
              ) : (
                <Plus className="w-6 h-6 text-eco-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'İlanı Düzenle' : 'Yeni İlan Ver'}
            </h2>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition font-medium"
            >
              <X className="w-4 h-4" />
              İptal
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ürün Adı
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Örn: Kullanılmış Laptop"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition bg-white"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fiyat (₺)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0 (Bağış için), veya 100"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">💡 Fiyat 0 ₺ ise otomatik olarak "Bağış" olarak işaretlenir</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ürün hakkında bilgi verin..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Görsel
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-eco-50 file:text-eco-700 file:font-semibold hover:file:bg-eco-100"
            />
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF veya WEBP (max 5MB). Veya URL girmek isterseniz:</p>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setImageFile(null); }}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition mt-2"
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition bg-white"
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
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${isEditing ? 'flex-1' : 'w-full'} bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2`}
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
