import { createFileRoute } from "@tanstack/react-router";
import RefExpressApp from "@/components/RefExpressApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "РефЭкспресс — аренда и продажа рефконтейнеров" },
      {
        name: "description",
        content:
          "B2B-лендинг РефЭкспресс: аренда и продажа рефрижераторных контейнеров с гарантией температуры от -40°C.",
      },
      { property: "og:title", content: "РефЭкспресс — аренда и продажа рефконтейнеров" },
      {
        property: "og:description",
        content:
          "Аренда и продажа рефрижераторных контейнеров с гарантией температуры от -40°C.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RefExpressApp,
});
