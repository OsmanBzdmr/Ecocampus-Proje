import { useState, useEffect } from 'react';
import { getMe, deleteAccount } from '../services/api';
import { User, Package, DollarSign, Heart, Trash2, AlertTriangle } from 'lucide-react';

export default function ProfilePage({ token, onLogout }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getMe(token)
      .then((res) => {
        setUser(res.data.user);
        setStats(res.data.stats);
        setListings(res.data.listings);
      })
      .catch(() => setError('Profil yüklenemedi'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moss-500" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 text-ink/50 font-body">
        <User className="w-12 h-12 mx-auto mb-4 text-line" />
        <p>{error || 'Profil yüklenemedi.'}</p>
      </div>
    );
  }

  const initials = user.username.charAt(0).toUpperCase();
  const createdDate = new Date(user.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <>
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-line/40">
          <div className="w-16 h-16 rounded-full bg-moss-100 text-moss-800 flex items-center justify-center text-2xl font-display font-black mb-3">
            {initials}
          </div>
          <h3 className="font-display font-bold text-lg text-ink">{user.username}</h3>
          <p className="text-ink/50 text-sm font-body">{user.email}</p>
          <p className="text-ink/40 text-xs mt-1 font-body">Üye oldu: {createdDate}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-line/40">
          <div className="flex items-center gap-3 text-ink/70 font-body">
            <Package className="w-5 h-5 text-moss-500" />
            <span className="text-sm">Toplam: <strong className="font-mono">{stats.totalListings}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-ink/70 font-body">
            <DollarSign className="w-5 h-5 text-moss-500" />
            <span className="text-sm">Aktif: <strong className="font-mono">{stats.activeListings}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-ink/70 font-body">
            <Heart className="w-5 h-5 text-mustard-500" />
            <span className="text-sm">Bağış: <strong className="font-mono">{stats.donationListings}</strong></span>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center justify-center gap-2 border border-clay-100 text-clay-600 hover:bg-clay-50 px-4 py-3 rounded-lg transition font-medium font-body"
        >
          <Trash2 className="w-5 h-5" />
          Hesabı Sil
        </button>
      </aside>

      {/* Right Content */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-paper/60 rounded-xl p-6 border border-line/40">
            <p className="text-ink/50 text-sm font-body">Toplam İlan</p>
            <p className="font-mono text-3xl font-bold text-ink mt-1">{stats.totalListings}</p>
          </div>
          <div className="bg-paper/60 rounded-xl p-6 border border-line/40">
            <p className="text-ink/50 text-sm font-body">Toplam Değer</p>
            <p className="font-mono text-3xl font-bold text-ink mt-1">{stats.totalValue} ₺</p>
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl font-black text-ink mb-4">İlanlarım</h3>
          {listings.length === 0 ? (
            <div className="text-center py-12 text-ink/40 font-body">
              <Package className="w-12 h-12 mx-auto mb-3" />
              <p>Henüz ilan eklemediniz</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between border border-line/40">
                  <div>
                    <p className="font-semibold text-ink font-body">{item.title}</p>
                    <p className="text-sm text-ink/50 font-mono">
                      {item.price == 0 ? 'Bağış' : `${item.price} ₺`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status && (
                      <span className={`tag ${
                        item.status === 'active' ? 'bg-moss-100 text-moss-700' :
                        item.status === 'reserved' ? 'bg-mustard-100 text-mustard-600' :
                        'bg-clay-100 text-clay-600'
                      }`}>
                        {item.status === 'active' ? 'Aktif' :
                         item.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-line/40">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-clay-500 mx-auto mb-3" />
            <h3 className="font-display text-xl font-black text-ink">Hesabı Sil</h3>
            <p className="text-ink/60 text-sm mt-2 font-body">
              Bu işlem geri alınamaz. Tüm ilanlarınız kalıcı olarak silinecek.
            </p>
          </div>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Şifrenizi girin"
            className="w-full px-4 py-2.5 rounded-lg border border-line focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition font-body"
          />
          {deleteError && (
            <p className="text-clay-600 text-sm text-center font-body">{deleteError}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
              disabled={deleting}
              className="flex-1 px-4 py-2 border border-line text-ink/70 rounded-lg hover:bg-paper font-medium transition disabled:opacity-50 font-body"
            >
              İptal
            </button>
            <button
              onClick={async () => {
                if (!deletePassword) { setDeleteError('Şifre gerekli'); return; }
                setDeleting(true);
                setDeleteError('');
                try {
                  await deleteAccount(deletePassword, token);
                  onLogout();
                } catch (err) {
                  setDeleteError(err.response?.data?.message || 'Silme işlemi başarısız');
                } finally {
                  setDeleting(false);
                }
              }}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-clay-600 text-white rounded-lg hover:bg-clay-700 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2 font-body"
            >
              {deleting ? 'Siliniyor...' : 'Hesabı Sil'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}