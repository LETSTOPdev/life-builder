import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Buildr — Build Your Best Life with AI",
    template: "%s | Buildr",
  },
  description:
    "Your AI-powered life operating system. Set goals, track progress, and get personalized coaching to become the best version of yourself.",
  keywords: ["AI life coach", "goal setting", "productivity", "personal development", "habit tracking"],
  authors: [{ name: "Buildr" }],
  creator: "Buildr",
  metadataBase: new URL("https://buildr.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://buildr.app",
    title: "Buildr — Build Your Best Life with AI",
    description: "Your AI-powered life operating system.",
    siteName: "Buildr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buildr — Build Your Best Life with AI",
    description: "Your AI-powered life operating system.",
    creator: "@buildrapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} dark scroll-smooth`}>
      <body className="font-sans antialiased bg-black text-white min-h-screen">
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
