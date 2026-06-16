import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Fontes auto-hospedadas pelo Next (sem layout shift, sem requisição a CDN).
// Expostas como CSS variables consumidas em globals.css.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rhema AI — Transcrição ao vivo",
  description: "Transcreve a palavra da pastora ao vivo e gera legendas para Instagram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`h-full ${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
