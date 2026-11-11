import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CashCollect Finance OS",
  description:
    "A Claude-connected finance workspace for invoices, collections and clearer books. Built for Indian SMEs.",
  keywords: [
    "invoicing",
    "collections",
    "finance",
    "SME",
    "MCP",
    "Claude",
    "accounting",
  ],
  icons: {
    icon: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
