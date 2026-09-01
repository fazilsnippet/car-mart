"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Users,
  Zap,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Calculator,
  Award,
  ChevronLeft,
  ChevronRight,
  Car,
} from "lucide-react";

export interface Vehicle {
  id: number;
  slug: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  priceInr: string;
  priceRaw: number;
  kmsDriven: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  seatingCapacity: number;
  ownerHistory: string;
  registrationCity: string;
  exteriorColor: string;
  interiorColor: string;
  engineSpecs: string;
  acceleration0to100: string;
  topSpeed: string;
  imageUrl: string;
  galleryImages: string[];
  inspectionPoints: number;
  certifiedStatus: boolean;
  warrantyStatus: string;
  highlights: string[];
  isFeatured: boolean;
}

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  currency: "INR" | "USD" | "EUR";
  onBookViewing: (vehicle: Vehicle) => void;
}

export function VehicleDetailModal({
  vehicle,
  onClose,
  currency,
  onBookViewing,
}: VehicleDetailModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [tenureYears, setTenureYears] = useState(5);

  if (!vehicle) return null;

  const images =
    vehicle.galleryImages && vehicle.galleryImages.length > 0
      ? vehicle.galleryImages
      : [vehicle.imageUrl];

  // Price conversion helper
  const formatPrice = (rawLakhs: number) => {
    if (currency === "USD") {
      const usd = Math.round(rawLakhs * 1175);
      return `$ ${usd.toLocaleString("en-US")}`;
    }
    if (currency === "EUR") {
      const eur = Math.round(rawLakhs * 1085);
      return `€ ${eur.toLocaleString("en-US")}`;
    }
    return vehicle.priceInr;
  };

  // EMI calculator (approx 9.25% p.a. for luxury auto loan)
  const totalLakhs = vehicle.priceRaw;
  const loanLakhs = totalLakhs * (1 - downPaymentPercent / 100);
  const monthlyRate = 0.0925 / 12;
  const months = tenureYears * 12;
  const emiLakhs =
    (loanLakhs * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const formattedEmi =
    currency === "INR"
      ? `₹ ${(emiLakhs * 100000).toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        })} / month`
      : currency === "USD"
      ? `$ ${Math.round(emiLakhs * 1175).toLocaleString("en-US")} / month`
      : `€ ${Math.round(emiLakhs * 1085).toLocaleString("en-US")} / month`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#121317] border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold uppercase">
              {vehicle.category}
            </span>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              REG: {vehicle.registrationCity}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-[#D4AF37] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Top Hero Photo & Title Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Studio Frame */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-zinc-800 group">
                <img
                  src={images[activePhotoIdx]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs font-mono text-[#D4AF37] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{vehicle.inspectionPoints}-POINT CERTIFIED</span>
                </div>

                {images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === activePhotoIdx
                            ? "w-8 bg-[#D4AF37]"
                            : "w-2 bg-white/40 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        idx === activePhotoIdx
                          ? "border-[#D4AF37] scale-105"
                          : "border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Primary Callouts */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                  {vehicle.brand} • {vehicle.model}
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
                  {vehicle.title}
                </h2>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-mono-spec text-3xl sm:text-4xl font-bold text-gold-gradient">
                    {formatPrice(vehicle.priceRaw)}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    (Ex-Showroom Mumbai)
                  </span>
                </div>

                {/* Key Spec Pills */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="bg-[#0A0A0C] border border-zinc-800 rounded-xl p-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">
                      MANUFACTURING YEAR
                    </div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {vehicle.year}
                    </div>
                  </div>
                  <div className="bg-[#0A0A0C] border border-zinc-800 rounded-xl p-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">
                      ODOMETER
                    </div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {vehicle.kmsDriven === 0
                        ? "0 KM (Zero-Meter)"
                        : `${vehicle.kmsDriven.toLocaleString()} KMs`}
                    </div>
                  </div>
                  <div className="bg-[#0A0A0C] border border-zinc-800 rounded-xl p-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">
                      OWNERSHIP
                    </div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {vehicle.ownerHistory}
                    </div>
                  </div>
                  <div className="bg-[#0A0A0C] border border-zinc-800 rounded-xl p-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">
                      0-100 KM/H ACCEL
                    </div>
                    <div className="text-sm font-bold text-[#D4AF37] font-mono mt-0.5">
                      {vehicle.acceleration0to100}
                    </div>
                  </div>
                </div>

                {/* Warranty Status */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-[#10B981] shrink-0" />
                  <div className="text-xs text-zinc-200">
                    <span className="font-semibold text-[#10B981]">
                      WARRANTY PROTECTION:{" "}
                    </span>
                    {vehicle.warrantyStatus}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    onClose();
                    onBookViewing(vehicle);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C35D] to-[#BF953F] text-black font-bold text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(212,175,55,0.35)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Book Private Showroom Viewing
                </button>
                <a
                  href={`https://wa.me/919820144512?text=${encodeURIComponent(
                    `Hello Wish Wheels Concierge, I am interested in the ${vehicle.title} (${vehicle.priceInr}). Please share inspection reports & private salon appointment.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-semibold text-xs uppercase tracking-widest hover:bg-[#10B981] hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Instant WhatsApp VIP Inquiry
                </a>
              </div>
            </div>
          </div>

          {/* Technical Dyno & Spec Sheet Table */}
          <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <h3 className="font-serif-luxury text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37]" />
              Engineering & Performance Technical Sheet
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#121317] border border-zinc-800">
                <span className="text-zinc-400 font-mono block mb-1">
                  POWERTRAIN & ENGINE
                </span>
                <span className="text-white font-bold block">
                  {vehicle.engineSpecs}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#121317] border border-zinc-800">
                <span className="text-zinc-400 font-mono block mb-1">
                  TRANSMISSION
                </span>
                <span className="text-white font-bold block">
                  {vehicle.transmission}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#121317] border border-zinc-800">
                <span className="text-zinc-400 font-mono block mb-1">
                  TOP SPEED
                </span>
                <span className="text-white font-bold block font-mono">
                  {vehicle.topSpeed}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#121317] border border-zinc-800">
                <span className="text-zinc-400 font-mono block mb-1">
                  EXTERIOR PAINTWORK
                </span>
                <span className="text-white font-bold block">
                  {vehicle.exteriorColor}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#121317] border border-zinc-800">
                <span className="text-zinc-400 font-mono block mb-1">
                  INTERIOR CABIN SPEC
                </span>
                <span className="text-white font-bold block">
                  {vehicle.interiorColor}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#121317] border border-zinc-800">
                <span className="text-zinc-400 font-mono block mb-1">
                  SEATING & BODY
                </span>
                <span className="text-white font-bold block">
                  {vehicle.seatingCapacity} Seater • {vehicle.bodyType}
                </span>
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-5 pt-4 border-t border-zinc-800">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider block mb-2.5">
                SHOWROOM BESPOKE HIGHLIGHTS & OPTIONS INSTALLED:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {vehicle.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Bespoke EMI & Custom Finance Estimator */}
          <div className="bg-gradient-to-br from-[#18191E] to-[#121317] border border-[#D4AF37]/35 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-serif-luxury text-lg font-bold text-white">
                  Wish Wheels Royal Finance & EMI Estimator
                </h4>
              </div>
              <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                ESTIMATED MONTHLY: {formattedEmi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 font-mono mb-2">
                  <span>DOWN PAYMENT</span>
                  <span className="text-[#D4AF37] font-bold">
                    {downPaymentPercent}% (
                    {currency === "INR"
                      ? `₹ ${(
                          (vehicle.priceRaw * downPaymentPercent) /
                          100
                        ).toFixed(2)} Cr`
                      : `${downPaymentPercent}%`}
                    )
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 font-mono mb-2">
                  <span>LOAN TENURE</span>
                  <span className="text-[#D4AF37] font-bold">
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
