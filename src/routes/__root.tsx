import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "РефЭкспресс — аренда и продажа рефконтейнеров по всей России" },
      {
        name: "description",
        content:
          "РефЭкспресс — аренда и продажа рефрижераторных контейнеров с гарантией температуры до -60°C. Доставка по всей РФ, PTI-тестирование, сервис 24/7.",
      },
      { name: "keywords", content: "рефконтейнер, аренда рефконтейнера, продажа рефконтейнеров, рефрижераторный контейнер, Carrier, Daikin, Thermo King, холодильный контейнер, хладологистика" },
      { name: "author", content: "ООО «РефЭкспресс»" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#00AEEF" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:site_name", content: "РефЭкспресс" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:title", content: "РефЭкспресс — аренда и продажа рефконтейнеров" },
      { name: "twitter:title", content: "РефЭкспресс — аренда и продажа рефконтейнеров" },
      { property: "og:description", content: "Рефрижераторные контейнеры с гарантией температуры до -60°C. Доставка по всей России, PTI-тестирование, сервис 24/7." },
      { name: "twitter:description", content: "Рефрижераторные контейнеры с гарантией температуры до -60°C. Доставка по всей России, PTI-тестирование, сервис 24/7." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://super-repo-buddy.lovable.app/" },
      { property: "og:image", content: "https://super-repo-buddy.lovable.app/hero.jpg" },
      { name: "twitter:image", content: "https://super-repo-buddy.lovable.app/hero.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "canonical", href: "https://super-repo-buddy.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(19076140,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "РефЭкспресс",
          legalName: "ООО «РефЭкспресс»",
          url: "https://super-repo-buddy.lovable.app/",
          logo: "https://super-repo-buddy.lovable.app/logo.png",
          description: "Аренда и продажа рефрижераторных контейнеров с гарантией температуры до -60°C. Доставка по всей России.",
          areaServed: "RU",
          sameAs: [],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
