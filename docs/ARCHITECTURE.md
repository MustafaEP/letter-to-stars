# Architecture — Letter to Stars

Bu doküman, proje mimarisinin “sözleşme” halidir. Port, path, ve servis sorumlulukları burada tanımlanır.
Bu doküman güncellenmeden mimari değiştirilmez.

---

## 1) Sistem Bileşenleri

### 1.1 Frontend (React + Tailwind)
- Kullanıcı arayüzü
- Backend ile HTTP üzerinden konuşur

### 1.2 Backend (Node.js + NestJS)
- Uygulama API katmanı
- Auth / günlük / kelime / yıldız mantığı burada

### 1.3 AI Service (FastAPI)
- Metin rewrite, seviye dönüşümü, analiz
- Backend tarafından çağrılır (frontend doğrudan çağırmaz tercih edilir)

### 1.4 Django (hazır)
- Şimdilik pasif
- Gelecekte: admin/analytics/learning history

### 1.5 Webhook Deploy Service
- GitHub push event ile deploy tetikler
- HMAC doğrulaması zorunlu

---

## 2) Domain & Routing (Path Sözleşmesi)

Üretim domain:
- `lettertostars.mustafaerhanportakal.com`

Reverse proxy path’leri:

- `/` → Frontend (React)
- `/api/*` → Backend (NestJS)
- `/ai/*` → AI Service (FastAPI)

Webhook ayrı subdomain önerisi:
- `deploy.mustafaerhanportakal.com`
  - `/deploy` → webhook service

> Not: Webhook’u ana domain altında da çalıştırabilirsin ama ayrı subdomain izolasyonu daha temiz.

---

## 3) Port Sözleşmesi (Internal)

Aşağıdaki portlar sadece server içinde anlamlıdır (public internete açılmaz):

Örnek:
- Frontend container: `3000`
- Backend container: `3001`
- AI Service container: `8001`
- Django container: `8002`
- Webhook service: `9000`

Kural:
- Public internete açık sadece: **80/443 (Nginx)**

---

## 4) Veri Akışı

### 4.1 Normal kullanıcı akışı
1) Kullanıcı → Frontend
2) Frontend → `/api/...` (NestJS)
3) NestJS → gerekirse `/ai/...` (FastAPI)
4) NestJS → Frontend’e sonuç döner

### 4.2 Deploy akışı
1) GitHub → Webhook endpoint (Nginx üzerinden)
2) Nginx → webhook service
3) webhook service:
   - event kontrol
   - HMAC doğrulama
   - deploy script
4) deploy script:
   - update/build/up
   - health-check

---

## 5) Güvenlik İlkeleri

- AI servis endpoint’leri mümkünse sadece backend tarafından erişilecek şekilde tasarlanır.
- HMAC doğrulaması olmayan webhook request’i kabul edilmez.
- `.env` dosyaları repo dışıdır.
- Servisler arası iletişim internal network üzerinden olmalı (docker network).

---

## 6) Konfigürasyon Sahipliği

- `infra/`:
  - nginx config
  - docker compose prod
  - certbot notları
- `scripts/`:
  - deploy ve yardımcı script’ler
- `docs/`:
  - bu sözleşme dokümanları

---

## 7) Değişiklik Protokolü

Bir şeyi değiştirmeden önce:
1) Bu dokümana güncelleme yapılır
2) Küçük bir commit ile değişiklik uygulanır
3) Health-check PASS
4) Sonraki adıma geçilir
