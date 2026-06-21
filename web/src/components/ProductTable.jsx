import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { fetchCategories } from '../services/api';

export default function ProductTable({ products, onDelete, loading }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Kategori yükleme hatası:', err));
  }, []);

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '—';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-eco-200 border-t-eco-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="w-16 h-16 text-gray-300" />
          <p className="text-gray-600 text-lg font-medium">Henüz ilan eklenmemiş</p>
          <p className="text-gray-400 text-sm">Yukarıdaki formdan ilk ilanınızı ekleyebilirsiniz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Yayındaki İlanlar ({products.length})</h2>
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Resim</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Başlık</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fiyat</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{product.title}</p>
                      {product.description && (
                        <p className="text-sm text-gray-600 truncate">{product.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {product.price == 0 ? (
                      <span className="inline-block bg-eco-100 text-eco-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ✨ BAĞIŞ
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-900">{product.price} TL</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => onDelete(product.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex gap-4">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.title}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mt-1">
                    {getCategoryName(product.category_id)}
                  </span>
                  {product.description && (
                    <p className="text-sm text-gray-600 truncate">{product.description}</p>
                  )}
                  {product.price == 0 ? (
                    <span className="inline-block bg-eco-100 text-eco-700 px-2 py-1 rounded text-xs font-semibold mt-1">
                      ✨ BAĞIŞ
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 mt-1">{product.price} TL</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDelete(product.id)}
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
