import { useState, useEffect } from 'react';
import { X, User, Calendar, Heart, Package } from 'lucide-react';
import { getProductById } from '../services/api';

export default function ProductDetail({ productId, onClose, token, onToggleFavorite }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getProductById(productId, token)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, token]);

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Ürün Detayı</h2>
            <div className="flex items-center gap-2">
              {product && token && (
                <button
                  onClick={() => {
                    if (onToggleFavorite) onToggleFavorite(productId);
                    setProduct((prev) => prev ? { ...prev, is_favorited: !prev.is_favorited } : prev);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Heart className={`w-5 h-5 ${product?.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-eco-200 border-t-eco-500 rounded-full animate-spin" />
            </div>
          ) : !product ? (
            <p className="text-center text-gray-500 py-8">Ürün bulunamadı</p>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {product.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(product.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {product.price == 0 ? (
                  <span className="bg-eco-100 text-eco-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                    Bağış
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">{product.price} ₺</span>
                )}
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  product.status === 'active' ? 'bg-green-100 text-green-700' :
                  product.status === 'reserved' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {product.status === 'active' ? 'Aktif' :
                   product.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                </span>
              </div>

              {product.category_name && (
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category_name}
                </span>
              )}

              {product.description && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Açıklama</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
