import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/providers/i18n-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "arXiv Whitepaper Finder | ChatGPT-Powered Research Assistant",
  description: "An intelligent chatbot that searches, retrieves, and discusses academic whitepapers from arXiv using ChatGPT. Built with Next.js, shadcn/ui, and LangChain for seamless research workflows.",
  keywords: ["arXiv", "whitepaper finder", "research assistant", "ChatGPT", "AI research", "academic search", "LangChain", "Next.js", "scientific papers", "machine learning"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
