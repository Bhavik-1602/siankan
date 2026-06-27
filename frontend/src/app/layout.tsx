import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppProvider } from "../lib/AppContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
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
        className={`${cormorant.variable} ${plusJakarta.variable} font-sans antialiased bg-[#FAF8F5] text-neutral-800 selection:bg-[#4A0E17]/10 selection:text-[#4A0E17]`}
      >
        <AppProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

