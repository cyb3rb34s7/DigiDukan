import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirana Digital Dukaan",
  description: "Inventory & Price Tracker for Indian Grocery Stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
