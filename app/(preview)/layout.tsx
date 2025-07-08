import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { AI } from "./actions";

export const metadata: Metadata = {
  title: "Otel Stok Yönetim Sistemi - AI Destekli Akıllı Asistan",
  description: "Turizm sektörü için AI destekli otel stok yönetim sistemi. Türkçe doğal dil ile stok sorgulama, alternatif ürün önerileri ve akıllı envanter takibi.",
  keywords: "otel stok yönetimi, turizm sektörü, AI asistan, envanter takibi, stok kontrolü, Türkçe chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Toaster position="top-center" richColors />
        <AI>{children}</AI>
      </body>
    </html>
  );
}
