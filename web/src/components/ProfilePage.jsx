import { useState, useEffect } from 'react';
import { getMe } from '../services/api';
import { User, LogOut, Package, DollarSign, Heart } from 'lucide-react';

export default function ProfilePage({ token, onLogout }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-eco-100 text-eco-800 flex items-center justify-center text-2xl font-bold mb-3">
            {initials}
          </div>
          <h3 className="font-bold text-lg text-gray-900">{user.username}</h3>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-400 text-xs mt-1">Üye oldu: {createdDate}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Package className="w-5 h-5 text-eco-500" />
            <span className="text-sm">Toplam: <strong>{stats.totalListings}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm">Satılık: <strong>{stats.activeListings}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-sm">Bağış: <strong>{stats.donationListings}</strong></span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold"
        >
          <LogOut className="w-5 h-5" />
          Güvenli Çıkış
        </button>
      </aside>

      {/* Right Content */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-500 text-sm">Toplam İlan</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalListings}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-500 text-sm">Toplam Değer</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalValue} TL</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">İlanlarım</h3>
          {listings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3" />
              <p>Henüz ilan eklemediniz</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.price == 0 ? 'Bağış' : `${item.price} TL`}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.price > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.price > 0 ? 'Aktif' : 'Bağış'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
