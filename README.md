# CryptoGuard - Güvenli Şifreleme Sistemi

## Proje Özeti

CryptoGuard, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir kriptografi uygulamasıdır. Bu uygulama AES ve RSA şifreleme algoritmalarını destekler ve SHA-256 hash fonksiyonunu içerir.

## Özellikler

### 🔐 AES Şifreleme
![image](https://github.com/user-attachments/assets/ebe1d3ad-3144-4875-8646-ebe9de148753)

- **Simetrik şifreleme algoritması**
- Desteklenen modlar: CBC, GCM, CTR
- Anahtar boyutları: 128, 192, 256 bit
- PBKDF2 ile güvenli anahtar türetme
- Otomatik şifre oluşturma özelliği

### 🔑 RSA Şifreleme
- **Asimetrik şifreleme algoritması**
- Anahtar boyutları: 1024, 2048, 4096 bit
- Otomatik anahtar çifti oluşturma
- PEM formatında anahtar dışa aktarma
- RSA-OAEP padding ile güvenlik

### 🔍 SHA-256 Hash
- **Kriptografik hash fonksiyonu**
- Metin ve dosya girişi desteği
- 256 bit sabit uzunlukta çıktı
- Veri bütünlüğü doğrulama

### 🎨 Modern Tasarım
- Karanlık tema ile profesyonel görünüm
- Responsive tasarım (mobil uyumlu)
- Animasyonlar ve geçiş efektleri
- Kullanıcı dostu arayüz

## Teknik Özellikler

### Güvenlik
- Web Crypto API kullanımı
- Güvenli rastgele sayı üretimi
- Salt ve IV kullanımı
- Modern kriptografi standartları

### Performans
- Asenkron işlemler
- Performans ölçümü
- Optimized algoritma implementasyonları

### Kullanıcı Deneyimi
- Bildirim sistemi
- Kopyalama ve indirme özellikleri
- Klavye kısayolları (Ctrl+Enter, Ctrl+Shift+C)
- Otomatik kaydetme (localStorage)

## Dosya Yapısı

```
crypto-app/
├── index.html          # Ana HTML dosyası
├── style.css           # CSS stilleri
└── script.js           # JavaScript fonksiyonları
```

## Kullanım Kılavuzu

### AES Şifreleme
1. "AES" sekmesine tıklayın
2. Şifreleme modunu ve anahtar boyutunu seçin
3. Şifrelenecek metni girin
4. Güçlü bir şifre girin veya "🎲 Oluştur" butonunu kullanın
5. "🔒 Şifrele" butonuna tıklayın
6. Sonucu kopyalayın veya indirin

### RSA Şifreleme
1. "RSA" sekmesine tıklayın
2. Anahtar boyutunu seçin
3. "🔧 Anahtar Çifti Oluştur" butonuna tıklayın
4. Şifrelenecek metni girin
5. "🔒 Şifrele" butonuna tıklayın
6. Sonucu kopyalayın veya indirin

### SHA-256 Hash
1. "SHA256" sekmesine tıklayın
2. Metin girin veya dosya seçin
3. "🔍 Hash Hesapla" butonuna tıklayın
4. Hash değerini kopyalayın veya indirin

## Klavye Kısayolları

- **Ctrl + Enter**: Aktif sekmede şifreleme/hash hesaplama
- **Ctrl + Shift + C**: Aktif sekmeyi temizleme

## Tarayıcı Uyumluluğu

- Chrome 60+
- Firefox 57+
- Safari 11+
- Edge 79+

## Güvenlik Notları

⚠️ **Önemli**: Bu uygulama eğitim amaçlı geliştirilmiştir. Gerçek uygulamalarda:
- Profesyonel kriptografi kütüphaneleri kullanın
- Anahtar yönetimi sistemleri implementedin
- Güvenlik denetimi yaptırın
- HTTPS kullanın

## Geliştirici Bilgileri

- **Framework**: Vanilla JavaScript (Framework kullanılmamıştır)
- **API**: Web Crypto API
- **Tasarım**: CSS3 ile modern tasarım
- **Responsive**: Mobile-first yaklaşım

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir ve özgürce kullanılabilir.

