import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-rene" });

export const metadata: Metadata = {
  title: "LinkedIn Speak — Traduce tu vida al corporativo",
  description: "Convierte cualquier situación real en un post motivacional de LinkedIn. El Google Translate para LinkedIn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${greatVibes.variable}`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
