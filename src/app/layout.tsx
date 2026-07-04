import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nara — Consultora de Negócios IA",
  description: "Consultoria de negócios com IA para empreendedoras brasileiras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
