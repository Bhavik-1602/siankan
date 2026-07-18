import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppProvider } from "../lib/AppContext";
import PageTransition from "../components/PageTransition";
import SmoothScroll from "../components/SmoothScroll";

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
    title: "Siankan — Handcrafted Indian Wear | Luxury Sarees, Lehengas & Gowns",
    description:
      "Siankan: hand-dyed lehengas, gowns and kurti sets. Small-batch contemporary Indian wear, made in India.",

   icons: {
  icon: "/favicon.png?v=3",
  shortcut: "/favicon.png?v=3",
  apple: "/favicon.png?v=3",
},
  };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
        style={{ background: '#FAF8F5', color: '#171717' }}>
        <AppProvider>
          <SmoothScroll />
          <Navbar />
          <main className="min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

