import React, { useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { addProduct as addProductApi } from '../services/api';
import Toast from './Toast';

export default function ProductForm({ token, onProductAdded }) {
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    image_url: '',
    category_id: 1
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProduct.title || !newProduct.price || !newProduct.image_url) {
      setToast({ type: 'error', message: 'Lütfen tüm alanları doldurunuz' });
      return;
    }

    setLoading(true);

    try {
      await addProductApi(newProduct, token);
      
      const isDonation = parseFloat(newProduct.price) === 0;
      setToast({ 
        type: 'success', 
        message: isDonation ? '✨ Bağış başarıyla eklendi!' : '✅ Ürün başarıyla eklendi!' 
      });
      
      setNewProduct({
        title: '',
        price: '',
        description: '',
        image_url: '',
        category_id: 1
      });
      
      onProductAdded();
    } catch (error) {
      setToast({ type: 'error', message: 'Ürün eklenirken hata oluştu' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-eco-100 p-2 rounded-lg">
            <Plus className="w-6 h-6 text-eco-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Yeni İlan Ver</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ürün Adı
            </label>
            <input
              type="text"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              placeholder="Örn: Kullanılmış Laptop"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fiyat (TL)
            </label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="0 (Bağış için), veya 100"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">💡 Fiyat 0 TL ise otomatik olarak "Bağış" olarak işaretlenir</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Ürün hakkında bilgi verin..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Görsel URL
            </label>
            <input
              type="url"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Ekleniyor...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                İlan Ekle
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
