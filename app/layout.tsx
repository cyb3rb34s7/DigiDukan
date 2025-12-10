import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirana Digital Dukaan",
  description: "Inventory & Price Tracker for Indian Grocery Stores",
  manifest: "/manifest.json",
  themeColor: "#1d4ed8",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dukaan",
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
    <html lang="hi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dukaan" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
