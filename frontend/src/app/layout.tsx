import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, DM_Sans } from "next/font/google";
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

// Thrive design system fonts
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "N&A Art of Design | Luxury Handcrafted Sarees & Designer Wear",
  description: "Exclusive pastel Banarasi sarees, custom-tailored designer cholis, festive wear, and bespoke bridesmaid lehengas. Handcrafted luxury from artisans in Varanasi.",
  keywords: ["sarees", "banarasi", "handcrafted", "luxury wear", "designer choli", "lehenga", "festive wear"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
        style={{ background: '#FAF8F5', color: '#171717' }}>
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
