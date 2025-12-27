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

export const metadata: Metadata = {
  title: "Silai Sathi - Premium Tailoring Services | Custom Kurta & Pyjama",
  description:
    "Experience the art of custom-made clothing with Silai Sathi. Expert tailoring for kurta, pyjama, and complete sets. Premium fabrics, perfect fit guaranteed. Order online today!",
  keywords: [
    "tailoring",
    "custom kurta",
    "pyjama tailoring",
    "traditional tailoring",
    "premium fabrics",
    "custom clothing",
    "silai studio",
  ],
  authors: [{ name: "Silai Sathi" }],
  openGraph: {
    title: "Silai Sathi - Premium Tailoring Services",
    description: "Traditional tailoring meets modern convenience. Perfect fit, perfectly crafted.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
