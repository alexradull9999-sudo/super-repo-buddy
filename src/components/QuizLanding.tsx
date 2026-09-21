import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronLeft, Send, Snowflake, ShieldCheck, Truck, Phone } from 'lucide-react';

import { sendAmoLead } from '@/lib/amocrm.functions';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/5r6wxgf3i5750sdcv4kn7nrpfza3l55u';
const YM_COUNTER_ID = 19076140;

const reachGoal = (goal: string, params?: Record<string, unknown>) => {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).ym === 'function') {
      (window as any).ym(YM_COUNTER_ID, 'reachGoal', goal, params);
    }
  } catch (err) {
    console.error('Yandex Metrika reachGoal error:', err);
  }
};

const GOALS = [
  { value: 'Купить контейнер' },
  { value: 'Арендовать контейнер' },
  { value: 'Хочу узнать цены' },
];

const TASKS = [
  '20 ft рефконтейнер',
  '40 ft рефконтейнер',
  'Заморозка до -25°C',
  'Глубокая заморозка до -60°C',
  'Хранение / склад на площадке',
  'Пока не знаю, нужна консультация',
];

const STEPS_TOTAL = 4;

const QuizLanding = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [task, setTask] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const goNext = (next: number) => {
    if (step === 1) reachGoal('quiz_start', { form: 'retargeting_quiz' });
    setStep(next);
  };

  const buildComment = () =>
    [
      'Квиз (ретаргетинг)',
      `Задача: ${goal || '—'}`,
      `Контейнер: ${task || '—'}`,
      `Город доставки: ${city || '—'}`,
    ].join('. ');

  const handleSubmit = async () => {
    if (phone.trim().length < 6 || isSending) return;
    setIsSending(true);
    reachGoal('quiz_finish', { form: 'retargeting_quiz' });
    reachGoal('submit_form', { form: 'retargeting_quiz' });

    const payload = {
      name: 'Квиз (ретаргетинг)',
      phone,
      source: 'Лендинг-квиз /kviz',
      answers: {
        'Что необходимо': goal,
        'Контейнер / задача': task,
        'Город доставки': city,
      },
      submittedAt: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          text: [
            '🆕 Заявка с квиза (ретаргетинг)',
            '',
            `Телефон: ${phone}`,
            `Что необходимо: ${goal || '—'}`,
            `Контейнер / задача: ${task || '—'}`,
            `Город доставки: ${city || '—'}`,
          ].join('\n'),
        }),
      });
    } catch (err) {
      console.error('Webhook error:', err);
    }

    try {
      await sendAmoLead({ data: { phone, comment: buildComment() } });
    } catch (err) {
      console.error('AmoCRM error:', err);
    }

    setIsSending(false);
    setIsDone(true);
  };

  const progress = Math.round(((step - 1) / STEPS_TOTAL) * 100);

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="w-6 h-6 text-[#00AEEF]" />
            <span className="font-extrabold text-gray-900 tracking-tight">РефЭкспресс</span>
          </div>
          <a
            href="tel:+79213937705"
            onClick={() => reachGoal('click_phone')}
            className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#00AEEF] transition-colors"
          >
            <Phone className="w-4 h-4" />
            +7 (921) 393-77-05
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight text-center mb-3">
          Подберём 3 варианта из наличия и рассчитаем{' '}
          <span className="text-[#00AEEF]">стоимость доставки</span>
        </h1>
        <p className="text-center text-gray-600 mb-8">
          4 коротких вопроса — ответ в течение 30 минут в рабочее время.
        </p>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-10">
          {/* Progress */}
          {!isDone && (
            <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                <span>Шаг {step} из {STEPS_TOTAL}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00AEEF]"
                  animate={{ width: `${Math.max(progress, 8)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Заявка отправлена!</h2>
                <p className="text-gray-600">
                  Подберём 3 варианта под вашу задачу и позвоним на {phone} в течение 30 минут.
                </p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Что вам сейчас необходимо?</h2>
                <div className="space-y-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => { setGoal(g.value); goNext(2); }}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        goal === g.value
                          ? 'border-[#00AEEF] bg-[#00AEEF]/5 text-gray-900'
                          : 'border-gray-200 hover:border-[#00AEEF] text-gray-700'
                      }`}
                    >
                      {g.value}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Какой контейнер или для какой задачи нужен?
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {TASKS.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTask(t); setStep(3); }}
                      className={`text-left px-5 py-4 rounded-xl border-2 font-semibold transition-all ${
                        task === t
                          ? 'border-[#00AEEF] bg-[#00AEEF]/5 text-gray-900'
                          : 'border-gray-200 hover:border-[#00AEEF] text-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 3 ? (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  В какой город необходима доставка?
                </h2>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && city.trim()) setStep(4); }}
                  placeholder="Например: Санкт-Петербург"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all mb-4"
                />
                <button
                  onClick={() => setStep(4)}
                  disabled={!city.trim()}
                  className="w-full bg-[#004A99] hover:bg-[#003875] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-colors"
                >
                  ПРОДОЛЖИТЬ
                </button>
              </motion.div>
            ) : (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Куда отправить варианты?</h2>
                <p className="text-gray-600 mb-6">
                  Укажите номер телефона — пришлём подборку и расчёт доставки.
                </p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all mb-4"
                />
                <button
                  onClick={handleSubmit}
                  disabled={phone.trim().length < 6 || isSending}
                  className="w-full bg-[#004A99] hover:bg-[#003875] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSending ? 'ОТПРАВЛЯЕМ...' : 'ПОЛУЧИТЬ 3 ВАРИАНТА'}
                  <Send className="w-5 h-5" />
                </button>
                <p className="text-xs text-gray-400 text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isDone && step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#00AEEF] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
          )}
        </div>

        {/* Trust row */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: ShieldCheck, text: 'PTI-тест и гарантия' },
            { icon: Truck, text: 'Доставка по всей РФ' },
            { icon: Snowflake, text: 'Режим до -60°C' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
              <Icon className="w-5 h-5 text-[#00AEEF]" />
              <span className="text-sm font-semibold text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuizLanding;
