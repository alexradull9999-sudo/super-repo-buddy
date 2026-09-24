import { createFileRoute } from "@tanstack/react-router";
import QuizLanding from "@/components/QuizLanding";

export const Route = createFileRoute("/kviz")({
  head: () => ({
    meta: [
      { title: "Подбор рефконтейнера за 4 вопроса — РефЭкспресс" },
      {
        name: "description",
        content:
          "Ответьте на 4 коротких вопроса: подберём 3 рефконтейнера из наличия и рассчитаем стоимость доставки в ваш город.",
      },
      { property: "og:title", content: "Подбор рефконтейнера за 4 вопроса — РефЭкспресс" },
      {
        property: "og:description",
        content:
          "3 варианта из наличия и расчёт доставки. Аренда и продажа рефконтейнеров по всей России.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: () => <QuizLanding variant="hero" />,
});
