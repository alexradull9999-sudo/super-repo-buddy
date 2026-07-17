import { createFileRoute } from "@tanstack/react-router";
import RefExpressApp from "@/components/RefExpressApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "РефЭкспресс — аренда и продажа рефконтейнеров по всей России" },
      {
        name: "description",
        content:
          "Аренда и продажа рефрижераторных контейнеров Carrier, Daikin, Thermo King. Температура до -60°C, доставка по всей РФ, PTI-тестирование, сервис 24/7.",
      },
      { property: "og:title", content: "РефЭкспресс — аренда и продажа рефконтейнеров" },
      {
        property: "og:description",
        content:
          "Рефрижераторные контейнеры с гарантией температуры до -60°C. Подбор за 30 минут, доставка по всей России.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://super-repo-buddy.lovable.app/" },
      { property: "og:image", content: "https://super-repo-buddy.lovable.app/hero.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://super-repo-buddy.lovable.app/" }],
  }),
  component: RefExpressApp,
});
