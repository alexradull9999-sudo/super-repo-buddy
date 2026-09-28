import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Phone, ArrowRight } from 'lucide-react';

import { Footer } from '@/components/RefExpressApp';

const CATALOG_URL = 'https://refexpress.ru/prodazha-refkonteynerov/novie-refkonteyneri/';

export const Route = createFileRoute('/spasibo')({
  head: () => ({
    meta: [
      { title: 'Спасибо за заявку — РефЭкспресс' },
      {
        name: 'description',
        content:
          'Ваша заявка принята. Пока мы подбираем варианты, посмотрите каталог новых рефконтейнеров РефЭкспресс.',
      },
      { name: 'robots', content: 'noindex, follow' },
      { property: 'og:title', content: 'Спасибо за заявку — РефЭкспресс' },
      {
        property: 'og:description',
        content:
          'Ваша заявка принята. Пока мы подбираем варианты, посмотрите каталог новых рефконтейнеров РефЭкспресс.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <img src="/logo.png" alt="РефЭкспресс" className="h-10 object-contain" />
          <a
            href="tel:+79213937705"
            className="flex items-center gap-2 text-sm sm:text-lg font-bold text-gray-900 hover:text-[#00AEEF] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">+7 (921) 393-77-05</span>
            <span className="sm:hidden">Позвонить</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Спасибо! Заявка принята
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Менеджер свяжется с вами в течение 30 минут в рабочее время.
            А пока посмотрите наш каталог новых рефконтейнеров.
          </p>
          <a
            href={CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#004A99] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#004A99]/30 transition-all hover:bg-[#003875]"
          >
            ОТКРЫТЬ КАТАЛОГ РЕФКОНТЕЙНЕРОВ
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="text-sm text-gray-400 mt-6">
            Каталог откроется в новой вкладке на сайте refexpress.ru
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
