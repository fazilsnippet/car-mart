import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif-luxury",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-spec",
});

export const metadata: Metadata = {
  title: "Wish Wheels — India's Largest Luxury & Exotic Car Collection | Mumbai",
  description:
    "We’re much beyond a car dealership — we’re an experience of taste, luxury and royalty. Explore Pre-Loved Luxury Cars, Un-Registered Exotics, and sell your car in 29 minutes.",
  keywords: [
    "Wish Wheels",
    "WishWheels",
    "Luxury Cars Mumbai",
    "Pre Loved Supercars India",
    "Porsche 911 GT3 RS India",
    "Ferrari 296 GTB Mumbai",
    "Lamborghini Huracan Spyder",
    "Sell Luxury Car 29 Minutes",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#0A0A0C] text-[#F5F5F7] antialiased selection:bg-[#D4AF37] selection:text-black">
        {children}
      </body>
    </html>
  );
}
