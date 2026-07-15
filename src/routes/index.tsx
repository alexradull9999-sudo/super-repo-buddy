import { createFileRoute } from "@tanstack/react-router";
import RefExpressApp from "@/components/RefExpressApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lovable App" },
      {
        name: "description",
        content:
          "Imports projects from repositories into your development environment.",
      },
      { property: "og:title", content: "Lovable App" },
      {
        property: "og:description",
        content:
          "Imports projects from repositories into your development environment.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RefExpressApp,
});
