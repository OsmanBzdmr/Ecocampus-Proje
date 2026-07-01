import React from 'react';
import { Trash2, Pencil, Heart, AlertCircle } from 'lucide-react';

export default function ProductTable({ products, onDelete, onEdit, onViewDetail, onToggleFavorite, loading, categories = [], currentUserId }) {
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '—';
  };

  const statusTag = (status) => {
    const map = {
      active: 'bg-moss-100 text-moss-700',
      reserved: 'bg-mustard-100 text-mustard-600',
      sold: 'bg-clay-100 text-clay-600',
    };
    const label = { active: 'Aktif', reserved: 'Rezerve', sold: 'Satıldı' };
    return (
      <span className={`tag ${map[status] || map.sold}`}>
        {label[status] || 'Satıldı'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-line/40">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-moss-200 border-t-moss-500 rounded-full animate-spin"></div>
          <p className="text-ink/60 font-body">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-line/40">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="w-16 h-16 text-line" />
          <p className="text-ink/70 text-lg font-display font-bold">Henüz ilan eklenmemiş</p>
          <p className="text-ink/40 text-sm font-body">Yukarıdaki formdan ilk ilanınızı ekleyebilirsiniz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-line/40">
      <div className="p-8">
        <h2 className="font-display text-2xl font-black text-ink mb-6">Yayındaki İlanlar ({products.length})</h2>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full font-body">
            <thead>
              <tr className="border-b-2 border-line">
                <th className="text-left py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">Resim</th>
                <th className="text-left py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">Başlık</th>
                <th className="text-left py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">Fiyat</th>
                <th className="text-left py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">Durum</th>
                <th className="text-left py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">İşlem</th>
                <th className="text-center py-3 px-4 font-semibold text-ink/70 text-xs uppercase tracking-wide">Fav</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line/50 hover:bg-paper/50 transition">
                  <td className="py-4 px-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover border border-line"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-paper-dark border border-line" />
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <button
                        onClick={() => onViewDetail(product)}
                        className="font-semibold text-ink hover:text-moss-600 transition text-left"
                      >
                        {product.title}
                      </button>
                      {product.description && (
                        <p className="text-sm text-ink/50 truncate">{product.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block bg-paper-dark text-ink/70 px-3 py-1 rounded-full text-sm font-body">
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {product.price == 0 ? (
                      <span className="tag bg-mustard-100 text-mustard-600">BAĞIŞ</span>
                    ) : (
                      <span className="font-mono font-semibold text-ink">{product.price} ₺</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {statusTag(product.status)}
                  </td>
                  <td className="py-4 px-4">
                    {currentUserId && product.user_id === currentUserId ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="flex items-center gap-2 text-moss-600 hover:text-moss-800 hover:bg-moss-50 px-3 py-2 rounded-lg transition font-medium"
                        >
                          <Pencil className="w-4 h-4" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="flex items-center gap-2 text-clay-600 hover:text-clay-700 hover:bg-clay-50 px-3 py-2 rounded-lg transition font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </div>
                    ) : null}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
                      className="transition hover:scale-110"
                    >
                      <Heart
                        className={`w-5 h-5 ${product.is_favorited ? 'fill-clay-500 text-clay-500' : 'text-line'}`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 font-body">
          {products.map((product) => (
            <div key={product.id} className="bg-paper/60 rounded-lg p-4 space-y-3 border border-line/40">
              <div className="flex gap-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-line"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-paper-dark flex-shrink-0 border border-line" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-ink">{product.title}</p>
                  <span className="inline-block bg-paper-dark text-ink/70 px-2 py-0.5 rounded text-xs mt-1">
                    {getCategoryName(product.category_id)}
                  </span>
                  {product.description && (
                    <p className="text-sm text-ink/50 truncate">{product.description}</p>
                  )}
                  {product.price == 0 ? (
                    <div className="mt-1">
                      <span className="tag bg-mustard-100 text-mustard-600">BAĞIŞ</span>
                    </div>
                  ) : (
                    <p className="text-sm font-mono font-semibold text-ink mt-1">{product.price} ₺</p>
                  )}
                  <div className="mt-1">
                    {statusTag(product.status)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg border border-line transition"
                >
                  <Heart
                    className={`w-5 h-5 ${product.is_favorited ? 'fill-clay-500 text-clay-500' : 'text-line'}`}
                  />
                </button>
                {currentUserId && product.user_id === currentUserId ? (
                  <>
                    <button
                      onClick={() => onEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 text-moss-600 hover:text-moss-800 hover:bg-moss-50 px-3 py-2 rounded-lg transition font-medium border border-moss-200"
                    >
                      <Pencil className="w-4 h-4" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-clay-600 hover:text-clay-700 hover:bg-clay-50 px-3 py-2 rounded-lg transition font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
