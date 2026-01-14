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

## ⚙️ Kurulum ve Çalıştırma

### 1. Veritabanı Kurulumu
PostgreSQL üzerinde `ecocampus_db` adında bir veritabanı oluşturun ve aşağıdaki tabloları kurun:
```sql
-- database.sql dosyasındaki sorguları çalıştırın.
