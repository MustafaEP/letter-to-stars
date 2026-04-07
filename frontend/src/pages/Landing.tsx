import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20 md:py-28">
        <p className="inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
          IELTS odaklı İngilizce günlük uygulaması
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          AI desteği ve IELTS seviyeleriyle her gün İngilizce yazma pratiği yap
        </h1>
        <p className="max-w-3xl text-lg text-slate-300">
          Letter to Stars ile her gün İngilizce günlük yaz. Hedef IELTS seviyeni (6, 7, 8 veya 9)
          seç, AI ile yeniden yazım, gramer düzeltmeleri ve kelime önerileri al. Yıldızlarla
          devamlılığını takip et.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Ücretsiz Başla
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-600 px-5 py-3 font-medium text-slate-100 transition hover:border-slate-400"
          >
            Giriş Yap
          </Link>
        </div>
      </section>
    </main>
  );
}
