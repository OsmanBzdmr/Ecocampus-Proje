import { useState, useEffect } from 'react';
import { X, User, Calendar, Heart, Package } from 'lucide-react';
import { getProductById } from '../services/api';

export default function ProductDetail({ productId, onClose, token, onToggleFavorite }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setProduct(null);
    getProductById(productId, token)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId, token]);

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-line/40">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-black text-ink">Ürün Detayı</h2>
            <div className="flex items-center gap-2">
              {product && token && (
                <button
                  onClick={() => {
                    if (onToggleFavorite) onToggleFavorite(productId);
                  }}
                  className="p-2 hover:bg-paper rounded-lg transition"
                >
                  <Heart className={`w-5 h-5 ${product?.is_favorited ? 'fill-clay-500 text-clay-500' : 'text-ink/40'}`} />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-paper rounded-lg transition">
                <X className="w-5 h-5 text-ink/40" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-moss-200 border-t-moss-500 rounded-full animate-spin" />
            </div>
          ) : !product ? (
            <p className="text-center text-ink/40 py-8 font-body">Ürün bulunamadı</p>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-64 rounded-xl overflow-hidden bg-paper-dark flex items-center justify-center border border-line">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Package className="w-16 h-16 text-line" />
                )}
              </div>

              <h3 className="font-display text-xl font-black text-ink">{product.title}</h3>

              <div className="flex items-center gap-4 text-sm text-ink/50 font-body">
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
                  <span className="tag bg-mustard-100 text-mustard-600">Bağış</span>
                ) : (
                  <span className="font-mono text-2xl font-bold text-ink">{product.price} ₺</span>
                )}
                <span className={`tag ${
                  product.status === 'active' ? 'bg-moss-100 text-moss-700' :
                  product.status === 'reserved' ? 'bg-mustard-100 text-mustard-600' :
                  'bg-clay-100 text-clay-600'
                }`}>
                  {product.status === 'active' ? 'Aktif' :
                   product.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                </span>
              </div>

              {product.category_name && (
                <span className="inline-block bg-paper-dark text-ink/70 px-3 py-1 rounded-full text-sm font-body">
                  {product.category_name}
                </span>
              )}

              {product.description && (
                <div>
                  <h4 className="font-display font-bold text-ink/80 mb-1">Açıklama</h4>
                  <p className="text-ink/60 text-sm leading-relaxed font-body">{product.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
