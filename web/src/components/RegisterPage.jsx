import React, { useState } from 'react';
import { UserPlus, Leaf } from 'lucide-react';
import { register as registerApi } from '../services/api';

export default function RegisterPage({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await registerApi({ username, email, password });
      setSuccess(true);
    } catch (err) {
      const message = err.response?.data?.message || 'Kayıt sırasında bir hata oluştu';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-paper paper-panel flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="flex justify-center mb-0">
            <div className="w-px h-8 bg-line" />
          </div>
          <div className="bg-moss-700 rounded-t-2xl px-8 pt-8 pb-10 text-center relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-paper border-2 border-line" />
            <div className="flex justify-center mb-3">
              <div className="bg-moss-500 p-3 rounded-full border-2 border-moss-400">
                <Leaf className="w-8 h-8 text-paper" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-black text-paper tracking-tight">Kayıt başarılı! 🎉</h1>
          </div>
          <div className="bg-white rounded-b-2xl shadow-2xl px-8 py-8 space-y-5 border-x border-b border-line text-center">
            <p className="text-ink/70 font-body">Artık giriş yapabilirsin.</p>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-moss-600 hover:bg-moss-700 text-paper font-display font-bold py-3 rounded-lg transition-all duration-200 tracking-wide"
            >
              Giriş Sayfasına Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper paper-panel flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-0">
          <div className="w-px h-8 bg-line" />
        </div>

        <div className="bg-moss-700 rounded-t-2xl px-8 pt-8 pb-10 text-center relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-paper border-2 border-line" />
          <div className="flex justify-center mb-3">
            <div className="bg-moss-500 p-3 rounded-full border-2 border-moss-400">
              <Leaf className="w-8 h-8 text-paper" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-black text-paper tracking-tight">EcoCampus</h1>
          <p className="text-moss-200 text-sm mt-1 font-medium">Yeni Hesap Oluştur</p>
        </div>

        <div className="bg-white rounded-b-2xl shadow-2xl px-8 py-8 space-y-5 border-x border-b border-line">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-clay-50 border border-clay-100 rounded-lg p-3 flex items-start gap-3">
                <span className="text-clay-600 font-medium text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kullanici_adi"
                className="w-full px-4 py-3 rounded-lg border border-line bg-paper/40 focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@university.edu"
                className="w-full px-4 py-3 rounded-lg border border-line bg-paper/40 focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full px-4 py-3 rounded-lg border border-line bg-paper/40 focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2">
                Şifre (Tekrar)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-line bg-paper/40 focus:ring-2 focus:ring-moss-400 focus:border-transparent outline-none transition font-body"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-moss-600 hover:bg-moss-700 text-paper font-display font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-wide"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin"></div>
                  Kayıt Olunuyor...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Kayıt Ol
                </>
              )}
            </button>
          </form>

          <p className="text-center text-ink/60 text-sm">
            Zaten hesabın var mı?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-clay-600 font-semibold hover:underline"
            >
              Giriş yap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
