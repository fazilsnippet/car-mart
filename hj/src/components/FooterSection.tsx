"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
} from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-[#0A0A0C] border-t border-[#D4AF37]/25 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Royalty Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1C1E24] to-black border border-[#D4AF37]/50 flex items-center justify-center">
                <span className="font-serif-luxury text-xl font-bold text-gold-gradient">
                  W
                </span>
              </div>
              <div>
                <span className="block font-serif-luxury text-2xl font-bold text-white">
                  WISH WHEELS
                </span>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]">
                  INDIA&apos;S LARGEST LUXURY CAR COLLECTION
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-md">
              We’re much beyond a car dealership — we’re an experience of taste, luxury and royalty. Handpicked supercars and exotics with 150-point certification and 29-minute outright liquidation.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919820144512"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs font-semibold hover:bg-[#10B981] hover:text-black transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp VIP Concierge
              </a>
            </div>
          </div>

          {/* Quick Collection Links */}
          <div>
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">
              Model Range
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#vehicle-discovery" className="hover:text-[#D4AF37] transition-colors">
                  Pre-Loved Luxury Cars
                </a>
              </li>
              <li>
                <a href="#vehicle-discovery" className="hover:text-[#D4AF37] transition-colors">
                  Un-Registered Zero-Meter Exotics
                </a>
              </li>
              <li>
                <a href="#vehicle-discovery" className="hover:text-[#D4AF37] transition-colors">
                  Porsche 911 GT3 RS Weissach
                </a>
              </li>
              <li>
                <a href="#vehicle-discovery" className="hover:text-[#D4AF37] transition-colors">
                  Ferrari 296 GTB & SF90
                </a>
              </li>
              <li>
                <a href="#vehicle-discovery" className="hover:text-[#D4AF37] transition-colors">
                  Lamborghini Huracán & Urus
                </a>
              </li>
            </ul>
          </div>

          {/* Sell & Services */}
          <div>
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">
              Bespoke Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#vehicle-discovery" className="hover:text-[#D4AF37] transition-colors">
                  Sell Your Car in 29 Minutes
                </a>
              </li>
              <li>
                <a href="#private-viewing" className="hover:text-[#D4AF37] transition-colors">
                  Private Salon Viewing
                </a>
              </li>
              <li>
                <a href="#private-viewing" className="hover:text-[#D4AF37] transition-colors">
                  Stage 1 & 2 ECU Remaps
                </a>
              </li>
              <li>
                <a href="#private-viewing" className="hover:text-[#D4AF37] transition-colors">
                  XPEL Self-Healing PPF Studio
                </a>
              </li>
              <li>
                <a href="#private-viewing" className="hover:text-[#D4AF37] transition-colors">
                  RTO & Luxury Insurance Support
                </a>
              </li>
            </ul>
          </div>

          {/* Showroom Coordinates */}
          <div>
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">
              Flagship Mumbai Salon
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  Wish Wheels Showroom, Worli & Bandra West, Mumbai, Maharashtra 400018
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-mono text-white">+91 98201 44512</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Mon – Sun: 10:00 AM – 8:30 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Wish Wheels India. All rights reserved. Inspired by wishwheels.com</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>150-Point Certified</span>
            <span>•</span>
            <span>Zero-Meter Import Specialists</span>
            <span>•</span>
            <span>Raaghib Khan Signature Collection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
