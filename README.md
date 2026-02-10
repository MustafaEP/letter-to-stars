# 🌟 Yıldızlara Mektup (Letter to Stars)

AI destekli kişisel İngilizce öğrenme ve günlük uygulaması. Kullanıcılar günlüklerini İngilizce yazar, yazılarını seçtikleri IELTS seviyesine göre dönüştürür, yeni kelimeleri öğrenir ve zamanla bir **yıldız haritası** oluşturur.

---

## 🌐 Canlı / Live

**Uygulama adresi:** [lettertostars.mustafaerhanportakal.com](http://lettertostars.mustafaerhanportakal.com/)

Yayın, Git commit ile otomatik güncellenir: depoya push yapıldığında canlı ortam yeniden deploy edilir.

---

## 📘 Projenin Amacı

- **Günlük tutma** — İngilizce günlük yazma alışkanlığı
- **Seviye dönüşümü** — Yazıları IELTS 6 / 7 / 8 / 9 seviyelerine göre AI ile yeniden yazma
- **Kelime takibi** — AI çıktısındaki yeni kelimeleri ve Türkçe anlamlarını öğrenme
- **Yıldız haritası** — Her gün = 1 yıldız; zamanla görsel bir ilerleme haritası

---

## 🧑‍🚀 Kullanıcı Akışı

### Günlük kullanım
1. Kullanıcı gününü İngilizce yazar
2. IELTS seviyesi seçer (6 / 7 / 8 / 9)
3. AI işlemi çalışır
4. Ekranda üç alan görünür:
   - **✍️ Orijinal metin**
   - **🤖 Seçilen seviyeye dönüştürülmüş metin**
   - **📚 Yeni kelimeler + Türkçe anlamları**
5. İsteğe bağlı görsel eklenebilir
6. Kayıt → o gün için **1 yıldız** 🌟

### Geçmişe bakış
- Takvim veya yıldız haritası görünümü
- Önceki günlere tıklayarak yazı, AI çıktısı, kelime listesi ve görsel görüntülenir

---

## 🏗️ Mimari

```
[ React + Tailwind ]
         │
         ▼
[ NestJS API ]
         │
         ▼
[ FastAPI – AI Service ]
         │
         ▼
[ Gemini API ]
```

- **Frontend:** React + TypeScript + Tailwind — hızlı UI, animasyon, günlük/kart/yıldız deneyimi
- **Backend:** NestJS + TypeScript — auth, günlük kayıtları, görsel upload, AI servisi ile iletişim
- **AI katmanı:** FastAPI — Gemini çağrıları, prompt mühendisliği, NLP; mikroservis olarak izole
- **Django:** İleride admin panel, analytics ve gelişim raporları için planlanıyor

---

## 📁 Proje Yapısı

| Klasör | Açıklama |
|--------|----------|
| `frontend/` | React + Vite + Tailwind |
| `backend/` | NestJS ana API |
| `ai-service/` | FastAPI + Gemini entegrasyonu |
| `django/` | İleride admin & analytics |
| `infra/` | Docker Compose (prod) |

### Önerilen frontend bileşenleri
- `DiaryEditor` — Günlük metin alanı
- `LevelSelector` — IELTS seviye seçimi
- `ResultPanel` — Orijinal / dönüştürülmüş metin
- `VocabularyList` — Yeni kelimeler + anlamlar
- `StarCalendar` — Takvim / yıldız haritası görünümü

---

## 🤖 AI Stratejisi

- **Girdi:** Kullanıcı metni + hedef IELTS seviyesi
- **İşlem:** Grammar, kelime zenginliği, cümle çeşitliliği, IELTS tonu
- **Kelime analizi:** Kullanıcı metni ile AI çıktısı arasındaki set farkı → yeni kelimeler + Türkçe anlamlar

**Örnek çıktı formatı (JSON):**
```json
{
  "rewritten_text": "...",
  "new_words": [
    {
      "word": "contemplate",
      "meaning_tr": "derin düşünmek"
    }
  ]
}
```

- Prompt’lar dosyalarda tutulur
- AI çıktısı yapılandırılmış (JSON) zorunlu

---

## 📅 Geliştirme Fazları

| Faz | İçerik |
|-----|--------|
| **1 – MVP** | Auth yok; günlük yaz → AI dönüşümü → kelime listesi |
| **2** | Kullanıcı sistemi, günlük arşivi, yıldız takvimi |
| **3** | Görsel upload, ilerleme grafikleri, günlük streak |
| **4** | Haftalık AI geri bildirimi, kişisel kelime defteri |

---

## 🛠️ Teknoloji Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **AI:** FastAPI, Python, Gemini API
- **İleride:** Django (admin, analytics)

---

## 🚀 Kurulum

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (NestJS)
cd backend && npm install && npm run start:dev

# AI Service
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload
```

AI servisi için `ai-service/.env` dosyasında Gemini API anahtarını tanımlayın (`.env.example` referans alınabilir).

---

## 📚 Öğrenme Kazanımları

Bu proje ile:
- **Yazılım:** Clean architecture, mikroservis, API tasarımı, frontend state yönetimi
- **AI:** Prompt engineering, NLP kavramları, yapılandırılmış çıktı, model sınırlamalarıyla çalışma
- **Ürün:** Kullanıcı akışı, MVP odaklı geliştirme, portfolyo projesi

---

## 📄 Lisans

Bu proje kişisel / eğitim amaçlıdır.

---

Auto Deploy# Updated Tue Feb 10 10:51:12 UTC 2026
