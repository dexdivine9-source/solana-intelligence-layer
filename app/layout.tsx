import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solana Intelligence Layer | Wallet Analytics",
  description:
    "Translate raw Solana on-chain activity into behavioral and risk insights. Powered by Helius and GPT-4o-mini.",
  keywords: ["Solana", "blockchain", "wallet analytics", "on-chain intelligence", "DeFi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
