import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "katex/dist/katex.min.css";
import { Providers } from "@/components/providers";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Academic Homepage Template",
  description:
    "Bilingual academic homepage template for researchers, students, and labs.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg"
  },
  openGraph: {
    title: "Academic Homepage Template",
    description:
      "Bilingual academic homepage template for researchers, students, and labs.",
    url: "https://example.com",
    siteName: "Academic Homepage Template",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Homepage Template",
    description:
      "Bilingual academic homepage template for researchers, students, and labs."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
