import type { Metadata } from "next";

import "./globals.css";
import "katex/dist/katex.min.css";
import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/500.css";
import "@fontsource/maple-mono/700.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Yiran Rex Ma",
  description:
    "artist, engineer, human. Ph.D. student in Theoretical and Applied Linguistics at Peking University, working on foundation language models.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "Yiran Rex Ma",
    description:
      "artist, engineer, human. Personal homepage of a Ph.D. student working on foundation language models.",
    siteName: "Yiran Rex Ma",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Yiran Rex Ma",
    description:
      "artist, engineer, human. Personal homepage of a Ph.D. student working on foundation language models."
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
