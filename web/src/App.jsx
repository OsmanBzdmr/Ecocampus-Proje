import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newProduct, setNewProduct] = useState({
    title: '', price: '', description: '', image_url: '', category_id: 1
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (error) { alert("Giriş Hatalı!"); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: token }
      });
      setNewProduct({ title: '', price: '', description: '', image_url: '', category_id: 1 });
      fetchProducts();
      alert("Ürün eklendi!");
    } catch (error) { alert("Hata: Giriş yapmamış olabilirsiniz."); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Silinsin mi?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  // --- MODERN FULL SCREEN STYLES ---
  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', margin: 0, padding: 0, boxSizing: 'border-box', color: '#000' }, // Genel yazı siyah
    sidebar: { width: '260px', backgroundColor: '#2c3e50', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' },
    main: { flex: 1, padding: '30px', overflowY: 'auto', color: '#000' }, // Ana içerik yazı rengi siyah
    card: { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    // Label stili eklendi (Ürün Adı, Fiyat vb. yazıları için)
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#000', fontSize: '14px' }, 
    input: { padding: '12px', borderRadius: '5px', border: '2px solid #ddd', width: '100%', marginBottom: '15px', boxSizing: 'border-box', fontSize: '14px', color: '#000' },
    btnGreen: { backgroundColor: '#27ae60', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '16px' },
    logoutBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginTop: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', color: '#000', fontWeight: 'bold' }, // Tablo başlıkları siyah
    td: { padding: '12px', borderBottom: '1px solid #eee', color: '#333' }, // Tablo içeriği koyu gri/siyah
    img: { width: '45px', height: '45px', borderRadius: '5px', objectFit: 'cover' },
    // Bağış Etiketi Stili
    donationBadge: { backgroundColor: '#2ecc71', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
  };
  
  if (!token) {
    return (
      <div style={{ ...styles.wrapper, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ ...styles.card, width: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#2c3e50' }}>EcoCampus Admin</h2>
          <form onSubmit={handleLogin}>
            <input style={styles.input} type="email" placeholder="E-posta" onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Şifre" onChange={e => setPassword(e.target.value)} />
            <button style={styles.btnGreen} type="submit">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* SOL MENÜ (SIDEBAR) */}
      <div style={styles.sidebar}>
        <h2 style={{ borderBottom: '1px solid #34495e', paddingBottom: '15px' }}>EcoCampus</h2>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#bdc3c7' }}>YÖNETİM PANELİ</div>
        <p style={{ cursor: 'pointer', color: '#ecf0f1' }}>🏠 Dashboard</p>
        <p style={{ cursor: 'pointer' }}>📦 İlanlarım</p>
        <p style={{ cursor: 'pointer' }}>👤 Profil</p>
        <button onClick={() => { localStorage.removeItem('token'); setToken(null); }} style={styles.logoutBtn}>Güvenli Çıkış</button>
      </div>

      {/* SAĞ İÇERİK (MAIN) */}
      <div style={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Hoş Geldiniz, Osman</h2>
          <span style={{ color: '#7f8c8d' }}>13 Ocak 2026</span>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* İLAN EKLEME FORMU (SOL TARAF) */}
          <div style={{ ...styles.card, flex: 1 }}>
            <h3>Yeni İlan Ver</h3>
            <form onSubmit={handleAddProduct}>
              <label>Ürün Adı</label>
              <input style={styles.input} value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} required />
              <label>Fiyat (TL)</label>
              <input style={styles.input} type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              <label>Görsel URL</label>
              <input style={styles.input} value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} required />
              <button style={styles.btnGreen} type="submit">Sisteme Ekle</button>
            </form>
          </div>

          {/* İSTATİSTİK (SAĞ TARAF) */}
          <div style={{ ...styles.card, width: '300px', textAlign: 'center', backgroundColor: '#2ecc71', color: 'white' }}>
            <h4 style={{ margin: 0 }}>Toplam İlanınız</h4>
            <h1 style={{ fontSize: '50px', margin: '10px 0' }}>{products.length}</h1>
            <p>Aktif Yayında</p>
          </div>
        </div>

        {/* İLAN LİSTESİ (ALT TARAF) */}
        <div style={styles.card}>
          <h3>Yayındaki İlanlar</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Resim</th>
                <th style={styles.th}>Başlık</th>
                <th style={styles.th}>Fiyat</th>
                <th style={styles.th}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={styles.td}><img src={p.image_url} style={styles.img} alt="" /></td>
                  <td style={styles.td}><strong>{p.title}</strong></td>
                  <td style={styles.td}>{p.price == 0 ? "BAĞIŞ" : `${p.price} TL`}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(p.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>İlanı Kaldır</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;