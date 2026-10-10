import type { Metadata } from "next";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { LangProvider } from "@/i18n";
import { PosthogProvider } from "../components/PosthogProvider";

export const metadata: Metadata = {
  title: "The Price Wave: Toronto's unaffordability ripples outward",
  description:
    "Kitchener-Waterloo new-home prices rose 46.7% since 2017 against Toronto's 2.9%. Track the unaffordability wave across seven corridor cities, 1981-2026. Open data, MIT licensed.",
  metadataBase: new URL("https://pricewave.canada.nshipyard.com"),
  openGraph: {
    title: "The Price Wave: Toronto's unaffordability ripples outward",
    description:
      "Kitchener-Waterloo new-home prices rose 46.7% since 2017 against Toronto's 2.9%. Track the unaffordability wave across seven corridor cities, 1981-2026. Open data, MIT licensed.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Price Wave: Toronto's unaffordability ripples outward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Price Wave: Toronto's unaffordability ripples outward",
    description:
      "Kitchener-Waterloo new-home prices rose 46.7% since 2017 against Toronto's 2.9%. Track the unaffordability wave across seven corridor cities, 1981-2026. Open data, MIT licensed.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><PosthogProvider>
        <LangProvider>{children}</LangProvider>
      </PosthogProvider></body>
    </html>
  );
}
