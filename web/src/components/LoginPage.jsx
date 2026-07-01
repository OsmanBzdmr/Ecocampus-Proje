import React, { useState } from 'react';
import { Lock, Leaf } from 'lucide-react';
import { login as loginApi } from '../services/api';

export default function LoginPage({ setToken, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginApi({ email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'E-posta veya şifre hatalı');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper paper-panel flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Etiket ipi */}
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
          <p className="text-moss-200 text-sm mt-1 font-medium">Kampüs Takas Pazarı</p>
        </div>

        {/* Fiş gövdesi */}
        <div className="bg-white rounded-b-2xl shadow-2xl px-8 py-8 space-y-5 border-x border-b border-line">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-clay-50 border border-clay-100 rounded-lg p-3 flex items-start gap-3">
                <span className="text-clay-600 font-medium text-sm">{error}</span>
              </div>
            )}

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
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Giriş Yap
                </>
              )}
            </button>
          </form>

          <p className="text-center text-ink/60 text-sm">
            Hesabın yok mu?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-clay-600 font-semibold hover:underline"
            >
              Kayıt ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
