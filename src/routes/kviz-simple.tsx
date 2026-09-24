import { createFileRoute } from "@tanstack/react-router";
import QuizLanding from "@/components/QuizLanding";

export const Route = createFileRoute("/kviz-simple")({
  head: () => ({
    meta: [
      { title: "Быстрый подбор рефконтейнера — РефЭкспресс" },
      {
        name: "description",
        content:
          "Короткий квиз РефЭкспресс: ответьте на 4 вопроса и получите 3 подходящих рефконтейнера с расчётом доставки.",
      },
      { property: "og:title", content: "Быстрый подбор рефконтейнера — РефЭкспресс" },
      {
        property: "og:description",
        content: "Компактный квиз для подбора рефконтейнера и расчёта доставки по России.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: QuizLanding,
});