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
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-line/40 dark:border-[var(--border-color)] animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-black text-ink dark:text-[var(--text-primary)]">Ürün Detayı</h2>
            <div className="flex items-center gap-2">
              {product && token && (
                <button
                  onClick={() => {
                    if (onToggleFavorite) onToggleFavorite(productId);
                  }}
                  className="p-2 hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] rounded-lg transition"
                >
                  <Heart className={`w-5 h-5 ${product?.is_favorited ? 'fill-clay-500 text-clay-500 dark:fill-clay-400 dark:text-clay-400' : 'text-ink/40 dark:text-[var(--text-muted)]'}`} />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-paper dark:hover:bg-[var(--bg-tertiary)] rounded-lg transition">
                <X className="w-5 h-5 text-ink/40 dark:text-[var(--text-muted)]" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-moss-200 border-t-moss-500 rounded-full animate-spin" />
            </div>
          ) : !product ? (
            <p className="text-center text-ink/40 dark:text-[var(--text-muted)] py-8 font-body">Ürün bulunamadı</p>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-64 rounded-xl overflow-hidden bg-paper-dark dark:bg-[var(--bg-tertiary)] flex items-center justify-center border border-line dark:border-[var(--border-color)]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Package className="w-16 h-16 text-line dark:text-[var(--text-muted)]" />
                )}
              </div>

              <h3 className="font-display text-xl font-black text-ink dark:text-[var(--text-primary)]">{product.title}</h3>

              <div className="flex items-center gap-4 text-sm text-ink/50 dark:text-[var(--text-muted)] font-body">
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
                  <span className="tag bg-mustard-100 text-mustard-600 dark:bg-mustard-900 dark:text-mustard-300">Bağış</span>
                ) : (
                  <span className="font-mono text-2xl font-bold text-ink dark:text-[var(--text-primary)]">{product.price} ₺</span>
                )}
                <span className={`tag ${
                  product.status === 'active' ? 'bg-moss-100 text-moss-700 dark:bg-moss-800 dark:text-moss-200' :
                  product.status === 'reserved' ? 'bg-mustard-100 text-mustard-600 dark:bg-mustard-900 dark:text-mustard-300' :
                  'bg-clay-100 text-clay-600 dark:bg-clay-900 dark:text-clay-300'
                }`}>
                  {product.status === 'active' ? 'Aktif' :
                   product.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                </span>
              </div>

              {product.category_name && (
                <span className="inline-block bg-paper-dark dark:bg-[var(--bg-tertiary)] text-ink/70 dark:text-[var(--text-secondary)] px-3 py-1 rounded-full text-sm font-body">
                  {product.category_name}
                </span>
              )}

              {product.description && (
                <div>
                  <h4 className="font-display font-bold text-ink/80 dark:text-[var(--text-primary)] mb-1">Açıklama</h4>
                  <p className="text-ink/60 dark:text-[var(--text-secondary)] text-sm leading-relaxed font-body">{product.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
