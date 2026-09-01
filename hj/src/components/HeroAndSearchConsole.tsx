"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
  Gauge,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export interface FilterState {
  brand: string;
  category: string;
  bodyType: string;
  fuelType: string;
  ownerHistory: string;
  seatingCapacity: string;
  minYear: number;
  maxYear: number;
  search: string;
  sortBy: string;
}

interface HeroAndSearchConsoleProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  onOpenSellModal: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    tag: "PRE-LOVED LUXURY CARS",
    category: "Pre-Loved Luxury",
    title: "2024 PORSCHE 911 GT3 RS",
    subtitle: "Weissach Package • Chalk Grey • 1,450 KMs • MH-01 Mumbai",
    price: "₹ 3.85 CR",
    stats: [
      { label: "0-100 KM/H", value: "3.0 SEC" },
      { label: "AERODYNAMICS", value: "DRS ACTIVE WING" },
      { label: "ENGINE", value: "4.0L FLAT-6 518 HP" },
      { label: "CERTIFIED", value: "150-PT PORSCHE CPO" },
    ],
    image:
      "https://images.pexels.com/photos/30687976/pexels-photo-30687976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800",
    badge: "IMMEDIATE DELIVERY",
  },
  {
    id: 2,
    tag: "UN-REGISTERED EXOTIC MACHINES",
    category: "Un-Registered Exotics",
    title: "2025 FERRARI 296 GTB",
    subtitle: "Assetto Fiorano Track Package • Zero-Meter Import • Unregistered",
    price: "₹ 5.60 CR",
    stats: [
      { label: "0-100 KM/H", value: "2.7 SEC" },
      { label: "POWERTRAIN", value: "819 HP PLUG-IN V6" },
      { label: "ODOMETER", value: "0 KM ZERO-METER" },
      { label: "WARRANTY", value: "7-YR FERRARI CARE" },
    ],
    image:
      "https://images.pexels.com/photos/17866515/pexels-photo-17866515.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800",
    badge: "ZERO METER IMPORT",
  },
  {
    id: 3,
    tag: "BESPOKE SHOWROOM COLLECTION",
    category: "Bespoke Showroom",
    title: "2024 LAMBORGHINI HURACÁN EVO SPYDER",
    subtitle: "Verde Mantis Pearl • LDVI AWD Steering • Capristo Titanium Exhaust",
    price: "₹ 4.45 CR",
    stats: [
      { label: "0-100 KM/H", value: "3.1 SEC" },
      { label: "TOP SPEED", value: "325 KM/H" },
      { label: "ENGINE", value: "5.2L NATURALLY ASPIRATED V10" },
      { label: "TITLE", value: "SINGLE OWNER MH-02" },
    ],
    image:
      "https://images.pexels.com/photos/30877637/pexels-photo-30877637.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800",
    badge: "FLAGSHIP SALON SPECIAL",
  },
];

const BRANDS = [
  "All",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Mercedes-AMG",
  "Rolls-Royce",
  "BMW M",
  "Range Rover",
  "Bentley",
  "McLaren",
];

const BODY_TYPES = [
  "All",
  "Supercar",
  "Coupe",
  "Convertible",
  "Luxury SUV",
  "Grand Tourer",
];

export function HeroAndSearchConsole({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalFilteredCount,
  onOpenSellModal,
}: HeroAndSearchConsoleProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0A0A0C]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slide imagery */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-105"
            />
            {/* Dark gradient overlay for extreme editorial legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/55 to-[#0A0A0C]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/90 via-transparent to-[#0A0A0C]/40" />
          </div>
        ))}
      </div>

      {/* Hero Carousel Navigation & Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 flex-1 flex flex-col justify-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {slide.tag}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-zinc-200 text-xs font-mono uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            {slide.badge}
          </span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl">
          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-2xl">
            {slide.title}
          </h1>
          <p className="mt-3 text-base sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed">
            {slide.subtitle}
          </p>
        </div>

        {/* Specs & Pricing Banner */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          {slide.stats.map((s, index) => (
            <div
              key={index}
              className="bg-black/55 backdrop-blur-md border border-[#D4AF37]/25 rounded-2xl px-4 py-3 shadow-lg"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                {s.label}
              </div>
              <div className="text-sm sm:text-base font-bold text-white font-mono-spec mt-0.5">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Hero CTA Buttons + Carousel Arrows */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onUpdateFilters({ category: slide.category });
                const el = document.getElementById("vehicle-discovery");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E2C35D] to-[#BF953F] text-black font-bold text-xs sm:text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-transform"
            >
              Explore {slide.category} ({slide.price})
            </button>
            <button
              onClick={onOpenSellModal}
              className="px-6 py-3.5 rounded-full bg-[#121317]/85 border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all"
            >
              Sell Your Car in 29 Minutes
            </button>
          </div>

          {/* Left/Right Carousel Controls (❮ ❯) as seen on wishwheels.com */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? HERO_SLIDES.length - 1 : prev - 1
                )
              }
              className="w-11 h-11 rounded-full bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-white flex items-center justify-center transition-all"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide
                      ? "w-8 bg-[#D4AF37]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
              }
              className="w-11 h-11 rounded-full bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-white flex items-center justify-center transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Docked "Find Your Perfect Match" Multi-Filter Vehicle Search Console */}
      <div id="vehicle-discovery" className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-[#121317]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          {/* Header of Search Console */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-800">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                OUR DEALER CENTER • MUMBAI
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Find Your Perfect Match
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Category tabs inside console */}
              <div className="hidden md:flex items-center bg-[#0A0A0C] border border-zinc-800 rounded-full p-1">
                {["All", "Pre-Loved Luxury", "Un-Registered Exotics", "Bespoke Showroom"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => onUpdateFilters({ category: cat })}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        filters.category === cat
                          ? "bg-[#D4AF37] text-black shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat === "All" ? "All Cars" : cat}
                    </button>
                  )
                )}
              </div>

              {/* Match Counter Badge */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#1C1E24] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] font-bold">
                Showing {totalFilteredCount} Handpicked Vehicles
              </div>
            </div>
          </div>

          {/* Search Console Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Keyword search */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Vehicle Details or Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search GT3 RS, Ferrari, Weissach, V12..."
                  value={filters.search}
                  onChange={(e) => onUpdateFilters({ search: e.target.value })}
                  className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 2. Brand */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => onUpdateFilters({ brand: e.target.value })}
                className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-[#121317] text-white">
                    {b === "All" ? "All Brands" : b}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Model Range / Body Type */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Model Range
              </label>
              <select
                value={filters.bodyType}
                onChange={(e) => onUpdateFilters({ bodyType: e.target.value })}
                className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#121317] text-white">
                    {t === "All" ? "All Body Types" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Owner History */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Owner History
              </label>
              <select
                value={filters.ownerHistory}
                onChange={(e) =>
                  onUpdateFilters({ ownerHistory: e.target.value })
                }
                className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                <option value="All" className="bg-[#121317]">
                  All Ownerships
                </option>
                <option value="Unregistered (0 KM)" className="bg-[#121317]">
                  Unregistered (0 KM)
                </option>
                <option value="1st Owner" className="bg-[#121317]">
                  1st Owner
                </option>
              </select>
            </div>

            {/* 5. Sort By */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onUpdateFilters({ sortBy: e.target.value })}
                className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                <option value="featured" className="bg-[#121317]">
                  Featured First
                </option>
                <option value="price_asc" className="bg-[#121317]">
                  Price: Low to High
                </option>
                <option value="price_desc" className="bg-[#121317]">
                  Price: High to Low
                </option>
                <option value="year_desc" className="bg-[#121317]">
                  Year: Newest First
                </option>
                <option value="kms_asc" className="bg-[#121317]">
                  KMs Driven: Lowest
                </option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills Row + Reset */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 mr-1">
                QUICK FILTERS:
              </span>
              {[
                { label: "Porsche GT3 RS", brand: "Porsche" },
                { label: "Ferrari 296", brand: "Ferrari" },
                { label: "Lamborghini", brand: "Lamborghini" },
                { label: "Rolls-Royce", brand: "Rolls-Royce" },
                { label: "Zero-Meter 0 KM", ownerHistory: "Unregistered (0 KM)" },
              ].map((qf, i) => (
                <button
                  key={i}
                  onClick={() => onUpdateFilters(qf)}
                  className="px-3 py-1 rounded-full bg-[#0A0A0C] border border-zinc-800 hover:border-[#D4AF37] text-xs text-zinc-300 hover:text-[#D4AF37] transition-all"
                >
                  {qf.label}
                </button>
              ))}
            </div>

            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
