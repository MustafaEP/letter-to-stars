# OPS (Runbook) — Letter to Stars

Bu doküman, “Yıldızlara Mektup (Letter to Stars)” projesinin VPS üzerinde güvenli ve izole şekilde çalıştırılması için operasyonel protokoldür.

## 0) Altın Kurallar (Değişmez)

- Mevcut projelere dokunma:
  - Portlarına dokunma
  - Nginx config’lerine dokunma
  - PM2/Docker yapılarına dokunma
  - Env dosyalarına dokunma
- Bu projede ilerleme disiplini:
  - Tek adım → çalışıyor → commit → sonraki adım
- `.env` dosyaları repoya girmez. Sadece `.env.example` girer.
- Webhook secret asla log’a yazılmaz.

---

## 1) Servisler ve Sorumlulukları

- **frontend**: React uygulaması (UI)
- **backend**: NestJS API
- **ai-service**: FastAPI (AI işlemleri)
- **django**: Şimdilik “hazır” (gelecekte admin/analytics için)
- **webhook**: GitHub push → deploy tetikleyici (HMAC doğrulamalı)
- **infra**: nginx, docker compose, certbot, prod yapılandırmaları
- **scripts**: deploy script’leri ve yardımcı komutlar

---

## 2) VPS Dizini ve İzolasyon

Zorunlu dizin:
- `/opt/letter-to-stars`

Bu dizin dışına taşma yok.
Diğer projelerin klasörlerine girilmez.

---

## 3) Deploy Akışı (Özet)

1) GitHub’a push olur
2) GitHub webhook → `deploy.mustafaerhanportakal.com/deploy` (örnek)
3) Nginx webhook request’ini iç servise proxy’ler
4) Webhook servisi:
   - HMAC doğrular
   - doğru event mi kontrol eder (`push`)
   - doğru branch mi kontrol eder (`DEPLOY_BRANCH`, default: `main`)
   - deploy script çalıştırır
5) Deploy script:
   - repo update
   - docker compose build/up
   - health-check
   - log üretir

> Webhook env örneği: `webhook/.env.example` (server’da `webhook/.env` olarak oluşturulur)

---

## 4) Deploy Komutları (VPS)

> Not: Komutlar örnektir. Kullandığın dizin/compose adına göre uyarlarsın.

Repo klasörüne gir:
- `cd /opt/letter-to-stars`

Container’ları ayağa kaldır:
- `docker compose -p letter-to-stars up -d --build`

Log görmek:
- `docker compose -p letter-to-stars logs -f --tail=200`

Yalnızca tek servisi yeniden başlatmak:
- `docker compose -p letter-to-stars restart backend`

---

## 5) Health Check Protokolü

Deploy sonrası şu kontroller PASS olmalı:

- Frontend:
  - `GET https://lettertostars.mustafaerhanportakal.com/` → 200
- Backend:
  - `GET https://lettertostars.mustafaerhanportakal.com/api/health` → 200
- AI Service:
  - `GET https://lettertostars.mustafaerhanportakal.com/ai/health` → 200
- Django:
  - şimdilik sadece internal test (prod’a route edilmeyebilir)

Fail olursa:
- `docker compose logs -f`
- nginx error log
- webhook deploy log

---

## 6) Log & Debug Yerleri

Önerilen:
- Deploy script log’ları: `logs/deploy-YYYYMMDD-HHMM.log`
- Nginx:
  - `/var/log/nginx/error.log`
  - `/var/log/nginx/access.log`
- Docker:
  - `docker compose logs -f`

---

## 7) Güvenlik Kontrol Listesi

- Webhook HMAC doğrulaması aktif
- Webhook servisi dünyaya port açmamalı:
  - mümkünse sadece `127.0.0.1` dinlesin
  - dış dünyaya sadece Nginx üzerinden erişilsin (443)
- Firewall:
  - açık portlar: 80/443
  - diğer portlar kapalı
- `.env` dosyaları:
  - sadece server’da
  - repo’da yok

---

## 8) Incident (Acil) Prosedürü

Deploy bozulduysa:
1) Son commit’i not al
2) Container’ların durumunu kontrol et:
   - `docker ps`
3) Log:
   - `docker compose -p letter-to-stars logs -f --tail=300`
4) En hızlı rollback:
   - `git log --oneline`
   - `git checkout <previous_commit>`
   - `docker compose -p letter-to-stars up -d --build`

---

## 9) Commit Disiplini

Örnek commit formatları:
- `docs: add ops and architecture docs`
- `chore: add deploy lock and deploy logging`
- `infra: standardize nginx routes for api and ai`
- `fix: forward required headers to webhook service`
