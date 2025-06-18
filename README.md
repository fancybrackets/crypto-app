# CryptoGuard - Güvenli Şifreleme Sistemi

## Proje Özeti

## Live Demo:
https://fancybrackets.github.io/crypto-app/

CryptoGuard, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir kriptografi uygulamasıdır. Bu uygulama AES ve RSA şifreleme algoritmalarını destekler ve SHA-256 hash fonksiyonunu içerir.
![image](https://github.com/user-attachments/assets/80d7613c-bc40-41f0-ae6e-0b804463a2a7)

## Özellikler

### 🔐 AES Şifreleme
![image](https://github.com/user-attachments/assets/40234d67-2d89-4ab7-afee-ad344cad2c5a)


- **Simetrik şifreleme algoritması**
- Desteklenen modlar: CBC, GCM, CTR
- ![image](https://github.com/user-attachments/assets/950278ac-61f8-41ee-8bad-2c38d1649f66)

- Anahtar boyutları: 128, 192, 256 bit
- ![image](https://github.com/user-attachments/assets/c4bcacd9-8126-453b-b4c7-37ef35ee7c0f)

- PBKDF2 ile güvenli anahtar türetme
- Otomatik şifre oluşturma özelliği

### 🔑 RSA Şifreleme
![image](https://github.com/user-attachments/assets/9c11e4ed-9cfa-4a8a-a67b-b5dfa6465238)


- **Asimetrik şifreleme algoritması**
- Anahtar boyutları: 1024, 2048, 4096 bit
- ![image](https://github.com/user-attachments/assets/1244907b-b9c6-4086-963a-ea199f5bda1f)

- Otomatik anahtar çifti oluşturma
- PEM formatında anahtar dışa aktarma
- RSA-OAEP padding ile güvenlik

### 🔍 SHA-256 Hash
![image](https://github.com/user-attachments/assets/0be70255-95f1-4d55-bb05-51aebb69b5b0)

![image](https://github.com/user-attachments/assets/e568b8c6-f071-41fb-976e-321114e487a8)

- **Kriptografik hash fonksiyonu**
- Metin ve dosya girişi desteği
- 256 bit sabit uzunlukta çıktı
- Veri bütünlüğü doğrulama

### 🎨 Modern Tasarım
- Karanlık tema ile profesyonel görünüm
- Responsive tasarım (mobil uyumlu)
- ![image](https://github.com/user-attachments/assets/2ef27546-c282-47f0-9979-e341b3a5958a)

- ![image](https://github.com/user-attachments/assets/1020d6b2-f403-486a-9942-de010a4fda4e)


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

