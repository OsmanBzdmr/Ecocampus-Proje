# 🌿 EcoCampus: Sürdürülebilir Kampüs Pazaryeri

EcoCampus, üniversite öğrencilerinin kampüs içinde eşya paylaşımını kolaylaştıran, atık oluşumunu azaltan ve öğrenci ekonomisine katkı sağlayan **Full-Stack** bir pazaryeri uygulamasıdır. 

Bu proje; **YMH3007 Fullstack Web ve Mobil Uygulama Geliştirme** dersi final ödevi kapsamında geliştirilmiştir.

---

## 🚀 Temel Özellikler

* **🔒 Güvenli Kimlik Doğrulama:** Bcrypt ile şifre hashleme ve JWT (JSON Web Token) tabanlı oturum yönetimi.
* **📱 Mobil Uygulama (React Native):** Öğrencilerin ilanları görüntüleyebileceği ve detaylara erişebileceği kullanıcı arayüzü.
* **💻 Web Dashboard (React):** İlan yönetimi, silme ve istatistik takibi için tasarlanmış yönetim paneli.
* **🤝 Bağış Sistemi:** Fiyatı 0 TL olarak girilen ürünlerin otomatik olarak "BAĞIŞ" etiketiyle listelenmesi.
* **🔄 Veri Senkronizasyonu:** PostgreSQL veritabanı sayesinde tüm platformlar arasında anlık veri tutarlılığı.

---

## 🛠️ Kullanılan Teknolojiler

### **Backend**
* **Node.js & Express.js:** RESTful API geliştirme.
* **PostgreSQL:** İlişkisel veritabanı yönetimi.
* **JWT & Bcrypt:** Kimlik doğrulama ve veri güvenliği.

### **Frontend**
* **React.js:** Web yönetim paneli (Dashboard).
* **React Native (Expo):** Cross-platform mobil uygulama.
* **Axios:** API haberleşmesi.

---

## 🛠️ Kurulum ve Çalıştırma Talimatları

Projenin yerel ortamda (Localhost) hatasız çalışması için aşağıdaki adımları sırasıyla takip ediniz.

### 1. Veritabanı Yapılandırması (PostgreSQL)
1. PostgreSQL üzerinde `ecocampus_db` adında bir veritabanı oluşturun.
2. Ana dizinde bulunan `database.sql` dosyasındaki sorguları pgAdmin veya terminal üzerinden çalıştırarak tabloları ve örnek verileri oluşturun.

### 2. Backend (Sunucu) Kurulumu
1. `backend` klasörüne gidin: `cd backend`
2. Gerekli kütüphaneleri yükleyin: `npm install`
3. `.env.example` dosyasının adını `.env` olarak değiştirin ve kendi PostgreSQL kullanıcı adınızı/şifrenizi girin.
4. Sunucuyu başlatın: `node server.js`
   * *Sunucu `http://localhost:5000`adresinde çalışacaktır.*

### 3. Web Yönetim Paneli Kurulumu
1. `web` klasörüne gidin: `cd web`
2. Kütüphaneleri yükleyin: `npm install`
3. Uygulamayı başlatın: `npm start`

### 4. Mobil Uygulama Kurulumu (Expo)
1. `mobile` klasörüne gidin: `cd mobile`
2. Kütüphaneleri yükleyin: `npm install`
3. **Önemli:** API bağlantısı için `src/api/config.js` (veya ilgili dosya) içerisindeki IP adresini bilgisayarınızın yerel IP adresiyle güncelleyin.
4. Uygulamayı başlatın: `npx expo start`
5. Expo Go uygulaması ile QR kodu taratarak fiziksel cihazda veya emülatörde test edin.

---

## 📋 Fonksiyonel Özellikler (Senaryolar)

* **Kimlik Doğrulama:** Kullanıcılar kayıt olabilir, giriş yapabilir ve JWT üzerinden token alarak işlem yapabilir.
* **Vitrin:** Giriş yapmayan kullanıcılar ürünleri listeleyebilir; ancak iletişim bilgilerini görmek ve ilan vermek için giriş yapmalıdır.
* **Dinamik İlan Yönetimi:** İlan ekleme formunda fiyat `0 TL` girilirse, sistem bu ürünü otomatik olarak "BAĞIŞ" etiketiyle işaretler.
* **Veri Senkronizasyonu:** Web ve Mobil platformlar aynı PostgreSQL veritabanını kullanır. Bir platformda silinen ilan, diğerinde de anında güncellenir.

---

## 📂 Proje Yapısı

* `/backend`: Node.js, Express ve Veritabanı modelleri.
* `/web`: React.js yönetim paneli kodları.
* `/mobile`: Expo & React Native mobil uygulama kodları.
* `/screenshots`: Uygulama içi ekran görüntüleri.
* `database.sql`: Veritabanı şeması ve başlangıç verileri.

⚠️ ÖNEMLİ (Bağlantı Ayarı): Mobil uygulamanın backend sunucusuyla iletişim kurabilmesi için index.tsx dosyası içerisindeki axios.get veya fetch satırlarında bulunan IP adresini, bilgisayarınızın o anki yerel ağ IP adresiyle (Örn: http://192.168.x.x:5000) güncellediğinizden emin olun. localhost adresi fiziksel cihazlarda/emülatörlerde çalışmayacaktır.


