import { createFileRoute } from "@tanstack/react-router";

import MobileWarehouseArticle from "@/components/MobileWarehouseArticle";

const title = "Мобильный склад из рефконтейнера за один день — РефЭкспресс";
const description =
  "Как создать мобильную сеть хранения с помощью рефконтейнеров: преимущества, этапы запуска и способы оптимизации логистики.";
const pageUrl = "https://super-repo-buddy.lovable.app/blog/mobilnye-sklady-iz-refkonteynerov";

export const Route = createFileRoute("/blog/mobilnye-sklady-iz-refkonteynerov")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: pageUrl },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: pageUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Мобильный склад из рефконтейнера за один день",
          description,
          author: { "@type": "Organization", name: "РефЭкспресс" },
          publisher: { "@type": "Organization", name: "РефЭкспресс" },
          mainEntityOfPage: pageUrl,
          inLanguage: "ru-RU",
        }),
      },
    ],
  }),
  component: MobileWarehouseArticle,
});