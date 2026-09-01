"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  Car,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Scale,
  Settings,
  ChevronDown,
} from "lucide-react";

interface NavigationHeaderProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSellModal: () => void;
  onOpenCompareModal: () => void;
  compareCount: number;
  currency: "INR" | "USD" | "EUR";
  onChangeCurrency: (c: "INR" | "USD" | "EUR") => void;
  onOpenAdminModal: () => void;
  inquiryCount: number;
}

export function NavigationHeader({
  activeCategory,
  onSelectCategory,
  onOpenSellModal,
  onOpenCompareModal,
  compareCount,
  currency,
  onChangeCurrency,
  onOpenAdminModal,
  inquiryCount,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "All Vehicles", category: "All" },
    { label: "Pre-Loved Cars", category: "Pre-Loved Luxury" },
    { label: "Un-Registered Exotics", category: "Un-Registered Exotics" },
    { label: "Bespoke Showroom", category: "Bespoke Showroom" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0C]/90 border-b border-[#D4AF37]/25 transition-all">
      {/* Top micro announcement strip */}
      <div className="bg-[#121317] border-b border-white/5 px-4 py-1.5 text-xs text-[#A1A1AA]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#D4AF37] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              MUMBAI FLAGSHIP SHOWROOM OPEN
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">
              100% Verified Titles • 29-Minute Outright Valuation • Zero-Meter Import Exotics
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency toggle */}
            <div className="flex items-center gap-1 bg-black/60 border border-[#D4AF37]/30 rounded-full px-2.5 py-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider mr-1">
                Currency:
              </span>
              {(["INR", "USD", "EUR"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onChangeCurrency(curr)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                    currency === curr
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {curr === "INR" ? "₹ INR" : curr === "USD" ? "$ USD" : "€ EUR"}
                </button>
              ))}
            </div>

            {/* Admin / Showroom Concierge Suite trigger */}
            <button
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-[#D4AF37] font-mono text-[11px] transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>SHOWROOM CONCIERGE</span>
              {inquiryCount > 0 && (
                <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {inquiryCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Wish Wheels */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onSelectCategory("All");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center gap-3 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C1E24] via-[#101114] to-black border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:border-[#D4AF37] transition-all">
                <div className="text-center">
                  <span className="block font-serif-luxury text-xl font-bold text-gold-gradient leading-none">
                    W
                  </span>
                  <span className="block text-[7px] tracking-[0.25em] text-[#D4AF37] uppercase font-mono">
                    WHEELS
                  </span>
                </div>
              </div>
              <div>
                <span className="block font-serif-luxury text-2xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                  WISH WHEELS
                </span>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]/90 font-medium">
                  INDIA&apos;S LARGEST LUXURY CAR COLLECTION
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Categories & Quick Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive = activeCategory === item.category;
              return (
                <button
                  key={item.category}
                  onClick={() => {
                    onSelectCategory(item.category);
                    const el = document.getElementById("vehicle-discovery");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black shadow-[0_4px_16px_rgba(212,175,55,0.35)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={onOpenSellModal}
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sell in 29 Mins</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare button */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#18191E] border border-[#D4AF37] text-xs font-semibold text-white hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-[#D4AF37] text-black font-mono font-bold text-[11px] w-5 h-5 rounded-full inline-flex items-center justify-center">
                  {compareCount}
                </span>
              </button>
            )}

            {/* WhatsApp VIP Concierge */}
            <a
              href="https://wa.me/919820144512?text=Hello%20Wish%20Wheels%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20supercar."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981] hover:text-black text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp VIP</span>
            </a>

            {/* Direct Helpline / Book Private Viewing */}
            <a
              href="#private-viewing"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E2C35D] to-[#BF953F] text-black text-xs font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:brightness-110 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Book Salon Viewing</span>
              <span className="md:hidden">Book VIP</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101115] border-t border-[#D4AF37]/20 px-4 pt-3 pb-6 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold px-2 py-1">
            Collection Filter
          </div>
          {navLinks.map((item) => (
            <button
              key={item.category}
              onClick={() => {
                onSelectCategory(item.category);
                setMobileMenuOpen(false);
                const el = document.getElementById("vehicle-discovery");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === item.category
                  ? "bg-[#D4AF37] text-black"
                  : "text-zinc-300 hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellModal();
              }}
              className="w-full py-3 rounded-xl bg-[#18191E] border border-[#D4AF37]/50 text-center text-xs font-bold uppercase tracking-wider text-[#D4AF37]"
            >
              Sell Your Car in 29 Minutes
            </button>
            <a
              href="https://wa.me/919820144512?text=Hello%20Wish%20Wheels"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-center text-xs font-bold text-[#10B981]"
            >
              Chat on WhatsApp VIP Concierge
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
