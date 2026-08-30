import type { Metadata } from "next";

import "./globals.css";
import "katex/dist/katex.min.css";
import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/500.css";
import "@fontsource/maple-mono/700.css";
import { Providers } from "@/components/providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";
const SITE_NAME = "Yiran Rex Ma";
const DESCRIPTION =
  "Yiran Rex Ma (马义然) — Ph.D. student in Theoretical and Applied Linguistics at Peking University, working on foundation language models, continual learning, and personal models.";
const OG_IMAGE = "/og.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`
  },
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png"
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }]
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE]
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
