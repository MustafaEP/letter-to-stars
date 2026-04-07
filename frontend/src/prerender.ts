interface PrerenderInput {
  url: string;
}

const routeContent: Record<string, { title: string; description: string; html: string }> = {
  '/': {
    title: 'Letter to Stars | IELTS Odaklı İngilizce Günlük Uygulaması',
    description:
      'Her gün İngilizce günlük yaz, IELTS hedef seviyeni seç ve AI destekli yeniden yazım, gramer geri bildirimi ve kelime önerileri al.',
    html: `
      <main style="max-width:960px;margin:0 auto;padding:80px 24px;color:#e2e8f0;font-family:Inter,system-ui,sans-serif">
        <h1 style="font-size:42px;line-height:1.2;margin:0 0 16px;">IELTS odaklı günlük yazma ile İngilizceni geliştir</h1>
        <p style="font-size:18px;line-height:1.6;color:#cbd5e1;margin:0 0 22px;">
          Letter to Stars, IELTS 6/7/8/9 hedeflerine göre AI destekli düzeltme, yeni kelime çıkarma ve günlük yazma pratiği sunar.
        </p>
        <p style="margin:0;">
          <a href="/register" style="display:inline-block;background:#22d3ee;color:#082f49;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;">Ücretsiz Başla</a>
        </p>
      </main>
    `,
  },
  '/login': {
    title: 'Giriş Yap | Letter to Stars',
    description:
      'Günlük IELTS yazma pratiğine devam etmek ve İngilizce gelişim zincirini takip etmek için giriş yap.',
    html: `
      <main style="max-width:760px;margin:0 auto;padding:80px 24px;color:#e2e8f0;font-family:Inter,system-ui,sans-serif">
        <h1 style="font-size:34px;line-height:1.25;margin:0 0 12px;">IELTS yazma yolculuğuna devam et</h1>
        <p style="font-size:18px;line-height:1.6;color:#cbd5e1;margin:0;">
          Günlük geçmişine, gramer gelişimine ve kelime ilerlemene ulaşmak için giriş yap.
        </p>
      </main>
    `,
  },
  '/register': {
    title: 'Kayıt Ol | Letter to Stars',
    description:
      'Hesabını oluştur ve IELTS seviyesine uygun AI geri bildirimleriyle İngilizce yazmanı geliştirmeye başla.',
    html: `
      <main style="max-width:760px;margin:0 auto;padding:80px 24px;color:#e2e8f0;font-family:Inter,system-ui,sans-serif">
        <h1 style="font-size:34px;line-height:1.25;margin:0 0 12px;">Ücretsiz IELTS odaklı yazma pratiğine başla</h1>
        <p style="font-size:18px;line-height:1.6;color:#cbd5e1;margin:0;">
          Günlük girdilerinden AI yeniden yazım, gramer düzeltmeleri ve kelime önerileri almak için kayıt ol.
        </p>
      </main>
    `,
  },
};

export function prerender({ url }: PrerenderInput) {
  const content = routeContent[url] ?? routeContent['/'];

  return {
    html: content.html,
    head: {
      title: content.title,
      elements: new Set([
        {
          type: 'meta',
          props: {
            name: 'description',
            content: content.description,
          },
        },
      ]),
    },
  };
}
