import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Coins,
  Move,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useRef } from "react";

import heroImage from "@/assets/mobile-warehouse-hero.jpg";
import loadingImage from "@/assets/mobile-warehouse-loading.jpg";
import networkImage from "@/assets/mobile-warehouse-network.jpg";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/RefExpressApp";

const benefits = [
  {
    icon: Move,
    number: "01",
    title: "Мобильность и гибкость",
    text: "Контейнер можно переместить на другую площадку и быстро перестроить логистику под текущий спрос.",
  },
  {
    icon: Coins,
    number: "02",
    title: "Экономия средств",
    text: "Аренда или покупка рефконтейнера обычно обходится дешевле строительства капитального склада.",
  },
  {
    icon: Wrench,
    number: "03",
    title: "Простой запуск",
    text: "Установка не требует сложных строительных работ — меньше времени и расходов до начала эксплуатации.",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Надёжность",
    text: "Прочная конструкция и холодильный агрегат защищают груз и поддерживают заданный температурный режим.",
  },
] as const;

const steps = [
  {
    number: "1",
    title: "Выберите контейнер",
    text: "Подберите размер и конфигурацию под груз, объём хранения и необходимый температурный режим.",
  },
  {
    number: "2",
    title: "Продумайте логистику",
    text: "Определите маршруты доставки, точки разгрузки и места временного хранения товаров.",
  },
  {
    number: "3",
    title: "Запустите площадку",
    text: "Подключите контейнер и используйте его как готовую мобильную точку хранения.",
  },
] as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function ArticleHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="На главную РефЭкспресс" className="shrink-0">
          <img src="/logo.png" alt="РефЭкспресс" className="h-9 w-auto sm:h-10" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="tel:+79213937705"
            className="hidden text-sm font-semibold text-foreground transition-colors hover:text-primary sm:inline"
          >
            +7 (921) 393-77-05
          </a>
          <Button asChild className="h-10 rounded-sm bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90">
            <a href="tel:+79213937705" aria-label="Позвонить в РефЭкспресс">
              <Phone className="size-4" />
              <span className="hidden xs:inline">Позвонить</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ScrollImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-24, 24]);

  return (
    <div ref={ref} className={`overflow-hidden bg-muted ${className ?? ""}`}>
      <motion.img
        style={{ y, scale: 1.06 }}
        src={src}
        alt={alt}
        loading="lazy"
        width={1600}
        height={1200}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function MobileWarehouseArticle() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 90]);

  return (
    <div className="article-theme min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      <ArticleHeader />

      <main>
        <section ref={heroRef} className="relative min-h-[760px] overflow-hidden pt-20 lg:min-h-[820px]">
          <motion.img
            style={{ y: heroY, scale: 1.04 }}
            src={heroImage}
            alt="Рефрижераторный контейнер на складской площадке"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/62 to-foreground/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-foreground/35 to-transparent" />

          <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-between px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <motion.div
              initial={reduceMotion ? undefined : "hidden"}
              animate="visible"
              variants={reveal}
              transition={{ duration: 0.7 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="size-4" />
                На главную
              </Link>
            </motion.div>

            <motion.div
              initial={reduceMotion ? undefined : "hidden"}
              animate="visible"
              variants={reveal}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="max-w-4xl"
            >
              <p className="mb-5 text-sm font-bold uppercase text-primary sm:text-base">Решения для бизнеса · 8 минут</p>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] text-primary-foreground sm:text-6xl lg:text-8xl">
                Мобильный склад за один день
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/85 sm:text-xl lg:text-2xl">
                Как рефконтейнеры помогают хранить товары без капитального строительства и быстро расширять логистическую сеть.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-x-10 gap-y-3 border-t border-primary-foreground/25 pt-6 text-sm text-primary-foreground/75">
              <span>Рефконтейнеры</span>
              <span>Хладологистика</span>
              <span>Мобильное хранение</span>
            </div>
          </div>
        </section>

        <article>
          <section className="border-b border-border py-20 sm:py-28">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24 lg:px-8">
              <motion.div
                initial={reduceMotion ? undefined : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={reveal}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-bold uppercase text-primary">Главная идея</p>
                <p className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  Не каждому бизнесу нужен капитальный склад.
                </p>
              </motion.div>
              <motion.div
                initial={reduceMotion ? undefined : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={reveal}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
              >
                <p>
                  Строительство традиционного склада часто обходится слишком дорого, занимает много времени и не всегда оправдано экономически. Для многих компаний хранение товара — вспомогательная задача, а производственные помещения рациональнее использовать по прямому назначению.
                </p>
                <p>
                  Рефконтейнеры дают готовое пространство для хранения и перевозки грузов с заданным температурным режимом. Холодильный агрегат поддерживает нужные условия внутри — вплоть до −40 °C даже при жаре до +50 °C снаружи.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="bg-foreground py-20 text-primary-foreground sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-bold uppercase text-primary">Почему выбирают контейнеры</p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">Склад следует за бизнесом, а не наоборот</h2>
                </div>
                <p className="max-w-sm text-primary-foreground/60">Четыре причины заменить долгую стройку готовым решением.</p>
              </div>

              <div className="grid border-l border-t border-primary-foreground/15 md:grid-cols-2">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={reduceMotion ? undefined : "hidden"}
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.25 }}
                      variants={reveal}
                      transition={{ duration: 0.55, delay: index * 0.06 }}
                      className="group min-h-72 border-b border-r border-primary-foreground/15 p-7 transition-colors hover:bg-primary-foreground/5 sm:p-10"
                    >
                      <div className="flex items-start justify-between">
                        <Icon className="size-8 text-primary" strokeWidth={1.6} />
                        <span className="text-sm text-primary-foreground/35">{benefit.number}</span>
                      </div>
                      <h3 className="mt-14 text-2xl font-bold sm:text-3xl">{benefit.title}</h3>
                      <p className="mt-4 max-w-md leading-relaxed text-primary-foreground/60">{benefit.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20 sm:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
              <ScrollImage
                src={loadingImage}
                alt="Загрузка свежих продуктов в рефрижераторный контейнер"
                className="aspect-[4/5] lg:aspect-[5/6]"
              />
              <motion.div
                initial={reduceMotion ? undefined : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={reveal}
                transition={{ duration: 0.65 }}
              >
                <p className="text-sm font-bold uppercase text-primary">Как начать</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">Три шага до первой точки хранения</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Первый шаг — выбрать подходящий рефконтейнер. «РефЭкспресс» предлагает модели разных размеров и конфигураций, которые можно адаптировать под конкретные задачи бизнеса.
                </p>

                <ol className="mt-10 border-t border-border">
                  {steps.map((step) => (
                    <li key={step.number} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6">
                      <span className="flex size-10 items-center justify-center rounded-full border border-primary font-bold text-primary">{step.number}</span>
                      <div>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </div>
          </section>

          <section className="bg-muted py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="text-sm font-bold uppercase text-primary">Оптимизация процессов</p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">Меньше пути. Больше контроля.</h2>
                </div>
                <div className="space-y-10">
                  <p className="text-xl leading-relaxed text-muted-foreground sm:text-2xl">
                    Рефконтейнеры можно использовать для временного хранения перед доставкой в розничные точки или распределительные центры. Так проще планировать поставки и сокращать время до конечного потребителя.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {["Хранение ближе к точкам продаж", "Запас под сезонный спрос", "Быстрое изменение маршрутов", "Стабильный температурный режим"].map((item) => (
                      <div key={item} className="flex min-h-28 items-start gap-3 border border-border bg-background p-5">
                        <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="font-semibold leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ScrollImage
                src={networkImage}
                alt="Сеть мобильных холодильных складов у распределительного центра"
                className="aspect-[4/3] lg:aspect-[16/8]"
              />
              <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-20">
                <motion.h2
                  initial={reduceMotion ? undefined : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={reveal}
                  className="text-4xl font-extrabold leading-tight sm:text-6xl"
                >
                  Расширяйте сеть там, где растёт спрос
                </motion.h2>
                <motion.div
                  initial={reduceMotion ? undefined : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={reveal}
                  transition={{ delay: 0.1 }}
                  className="space-y-6 text-lg leading-relaxed text-muted-foreground"
                >
                  <p>
                    Использование рефконтейнеров помогает быстро открывать мобильные точки хранения в разных регионах. Это особенно важно на конкурентном рынке, где нужно оперативно реагировать на изменения спроса.
                  </p>
                  <p>
                    «РефЭкспресс» предлагает комплексное решение: аренду, обслуживание и консультации по выбору контейнеров и логистической схемы. Это упрощает переход к мобильному хранению и помогает быстрее адаптироваться к новым условиям.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-primary py-20 sm:py-28">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
                <div>
                  <div className="flex items-center gap-3 text-sm font-bold uppercase text-primary-foreground/75">
                    <Clock3 className="size-5" />
                    Подбор за 30 минут
                  </div>
                  <h2 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-primary-foreground sm:text-6xl">
                    Подберём рефконтейнер под вашу задачу
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
                    Расскажите, что и где планируете хранить. Предложим подходящие варианты и рассчитаем доставку.
                  </p>
                </div>
                <div className="flex flex-col gap-3 lg:items-end">
                  <Button asChild className="h-14 w-full rounded-sm bg-foreground px-7 text-base font-bold text-background hover:bg-foreground/90 sm:w-auto">
                    <Link to="/kviz">
                      Получить варианты
                      <ArrowRight className="size-5" />
                    </Link>
                  </Button>
                  <a href="tel:+79213937705" className="text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground">
                    или позвоните +7 (921) 393-77-05
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}