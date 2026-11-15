import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import "./globals.css";
export const metadata = {
  title: "Plante Doctor AI - طبيب النباتات",
  description: "صور نبتتك و خلي Gemini يشخصها ليك",
  icons: { icon: "data:image/svg+xml,[STRIPPED]" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" style={{ colorScheme: "light" }}>
      <body style={{ background: "#E8F5E9", color: "#111", margin: 0 }}>{children}</body>
    </html>
  );
}