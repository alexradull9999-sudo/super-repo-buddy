import { createFileRoute } from "@tanstack/react-router";
import QuizLanding from "@/components/QuizLanding";

export const Route = createFileRoute("/kviz")({
  head: () => ({
    meta: [
      { title: "Получите каталог рефконтейнеров в течение 30 минут — РефЭкспресс" },
      {
        name: "description",
        content:
          "Ответьте на 4 коротких вопроса — пришлём каталог рефконтейнеров с ценами в течение 30 минут.",
      },
      { property: "og:title", content: "Получите каталог рефконтейнеров в течение 30 минут — РефЭкспресс" },
      {
        property: "og:description",
        content:
          "Каталог с актуальными ценами в течение 30 минут. Аренда и продажа рефконтейнеров по всей России.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: () => <QuizLanding variant="hero" />,
});
