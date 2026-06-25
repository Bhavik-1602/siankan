import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppProvider } from "../lib/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "N&A Art of Design | Luxury Handcrafted Sarees & Designer Wear",
  description: "Exclusive pastel Banarasi sarees, custom-tailored designer cholis, festive wear, and bespoke bridesmaid lehengas. Handcrafted luxury from artisans in Varanasi.",
  keywords: ["sarees", "banarasi", "handcrafted", "luxury wear", "designer choli", "lehenga", "festive wear"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <Navbar />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
