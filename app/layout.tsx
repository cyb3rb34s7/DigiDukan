import type { Metadata } from "next";
import { Manrope, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/contexts/Providers";

// Manrope font configuration (Primary)
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Noto Sans Devanagari for Hindi text
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Munafa OS - Kirana Digital Dukaan",
  description: "Inventory & Price Tracker for Indian Grocery Stores",
  manifest: "/manifest.json",
  themeColor: "#4F46E5", // Electric Indigo
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Munafa",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${manrope.variable} ${notoDevanagari.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Munafa" />
      </head>
      <body className="font-sans antialiased bg-canvas text-text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
