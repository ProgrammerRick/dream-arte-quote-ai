import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "DreamFlow Studio | Dream Arte",
    template: "%s | DreamFlow Studio",
  },
  description:
    "DreamFlow Studio — plataforma de gestão da Dream Arte para clientes, projetos, financeiro e produtividade da agência de criação de sites.",
  applicationName: "DreamFlow Studio",
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[var(--bg-app)] font-sans text-[var(--text-primary)] antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
