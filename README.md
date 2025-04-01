# Dawnia - Tarayıcı Tabanlı Strateji Oyunu

Dawnia, React ve TypeScript kullanılarak geliştirilmiş, tarayıcı tabanlı bir strateji oyunudur. Oyuncular kendi köylerini yönetir, kaynakları toplar, binalar inşa eder ve ordularını güçlendirir.

## 🎮 Özellikler

- **Kaynak Yönetimi**
  - Odun, Taş, Demir ve Tahıl üretimi
  - Otomatik kaynak toplama sistemi
  - Gerçek zamanlı üretim göstergeleri---

- **Bina Sistemi**
  - Ana Bina, Çiftlik, Oduncu, Taş Ocağı ve daha fazlası
  - Seviye bazlı geliştirme sistemi
  - Görsel inşaat ilerleme göstergeleri
  - 2x2 grid tabanlı yerleştirme sistemi

- **Ordu Yönetimi**
  - Kılıçlı, Okçu ve Süvari birimleri
  - Saldırı ve savunma güç hesaplamaları
  - Birim bakım maliyeti sistemi

## 🛠️ Teknolojiler

- **Frontend**: React, TypeScript
- **State Yönetimi**: Zustand
- **UI Kütüphaneleri**: Tailwind CSS, Lucide Icons
- **Geliştirme Araçları**: Vite, ESLint

## 🚀 Başlangıç

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/dawnia.git
cd dawnia
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın.

## 🎯 Oyun Mekanikleri

### Kaynak Üretimi
- Her bina tipi belirli bir kaynak üretir
- Üretim miktarı bina seviyesiyle doğru orantılıdır
- Kaynaklar otomatik olarak her saniye güncellenir

### Bina Geliştirme
- Her bina belirli bir sürede yükseltilebilir (60 saniye)
- Yükseltme maliyeti seviye ile üstel olarak artar
- Yükseltme sırasında görsel geri bildirim sağlanır

### Ordu Sistemi
- Her birim tipi farklı saldırı ve savunma değerlerine sahiptir
- Birimler tahıl tüketir (bakım maliyeti)
- Toplam ordu gücü birim sayıları ve türlerine göre hesaplanır

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız. 