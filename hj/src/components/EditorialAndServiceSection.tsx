"use client";

import React, { useState } from "react";
import {
  Award,
  Zap,
  ShieldCheck,
  Crown,
  Sparkles,
  Wrench,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export function EditorialAndServiceSection() {
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceBooked, setServiceBooked] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [carModel, setCarModel] = useState("Porsche 911 / AMG G63");
  const [servicePackage, setServicePackage] = useState(
    "Stage 2 ECU Remap + Valved Capristo Exhaust"
  );

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Performance & PPF Service",
        customerName: name,
        phone,
        vehicleTitle: carModel,
        notes: `Selected Service Package: ${servicePackage}`,
      }),
    });
    setServiceBooked(true);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 1. Welcome to Wish Wheels — Founder Raaghib Khan Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5" />
              WELCOME TO WISH WHEELS • MUMBAI FLAGSHIP
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              We’re much beyond a car dealership,{" "}
              <span className="text-gold-gradient block">
                we’re an experience of taste, luxury and royalty!
              </span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              Wish Wheels is a premier luxury car dealership based in Mumbai, offering a handpicked selection of supercars and high-end exotics for discerning collectors who value quality, trust, and a seamless VIP experience from start to finish.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <div className="font-mono-spec text-3xl sm:text-4xl font-bold text-gold-gradient">
                  7,600+
                </div>
                <div className="text-xs text-zinc-400 uppercase font-mono mt-1">
                  Exotics Delivered
                </div>
              </div>
              <div>
                <div className="font-mono-spec text-3xl sm:text-4xl font-bold text-gold-gradient">
                  150-PT
                </div>
                <div className="text-xs text-zinc-400 uppercase font-mono mt-1">
                  Certified Check
                </div>
              </div>
              <div>
                <div className="font-mono-spec text-3xl sm:text-4xl font-bold text-gold-gradient">
                  29 MIN
                </div>
                <div className="text-xs text-zinc-400 uppercase font-mono mt-1">
                  Outright Liquidation
                </div>
              </div>
            </div>

            {/* Raaghib Khan Signature Quote Badge */}
            <div className="p-5 rounded-2xl bg-[#121317] border border-[#D4AF37]/40 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#BF953F] flex items-center justify-center text-black font-serif-luxury text-xl font-bold shrink-0">
                RK
              </div>
              <div>
                <div className="font-serif-luxury text-xl font-bold text-white">
                  Raaghib Khan
                </div>
                <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                  Founder & CEO • Wish Wheels India
                </div>
                <p className="text-xs text-zinc-400 mt-1 italic">
                  &ldquo;Every supercar inside Wish Wheels represents our personal word of authenticity, pedigree, and excellence.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Showroom Studio Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
              <img
                src="https://images.pexels.com/photos/17632052/pexels-photo-17632052.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
                alt="Wish Wheels Flagship Mumbai Showroom"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl p-5">
                <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest">
                  YOUR PREMIUM AUTOMOTIVE PARTNER
                </div>
                <div className="text-white font-serif-luxury text-xl font-bold mt-1">
                  Spanning German Discipline & Italian Drama
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ELEVATE YOUR CAR WITH OUR SERVICE — GET MORE POWER TO YOUR CAR */}
        <div className="bg-gradient-to-br from-[#121317] via-[#18191E] to-[#121317] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                ELEVATE YOUR CAR WITH OUR SERVICE
              </div>
              <h3 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight">
                GET MORE POWER TO YOUR CAR
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Wish Wheels Performance Studio offers ECU Stage 1/2 Tuning, Capristo & Akrapovič Titanium Exhaust Systems, Self-Healing XPEL Paint Protection Film (PPF), and white-glove doorstep detailing for Mumbai’s hypercar fleet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#0A0A0C]/80 border border-zinc-800 rounded-xl p-4">
                  <div className="text-[#D4AF37] font-mono text-xs font-bold uppercase">
                    STAGE 1 & 2 REMAPS
                  </div>
                  <div className="text-white font-bold text-sm mt-1">
                    +60 to +140 HP Gains
                  </div>
                </div>
                <div className="bg-[#0A0A0C]/80 border border-zinc-800 rounded-xl p-4">
                  <div className="text-[#D4AF37] font-mono text-xs font-bold uppercase">
                    XPEL STEALTH PPF
                  </div>
                  <div className="text-white font-bold text-sm mt-1">
                    10-Year Self-Healing Shield
                  </div>
                </div>
                <div className="bg-[#0A0A0C]/80 border border-zinc-800 rounded-xl p-4">
                  <div className="text-[#D4AF37] font-mono text-xs font-bold uppercase">
                    TITANIUM EXHAUSTS
                  </div>
                  <div className="text-white font-bold text-sm mt-1">
                    Capristo • Novitec • Fi
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110"
                >
                  Book Performance Upgrade / PPF
                </button>
                <a
                  href="https://wa.me/919820144512?text=Hello%20Wish%20Wheels%20Performance%20Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-zinc-900 border border-[#D4AF37]/50 text-white font-semibold text-xs uppercase tracking-widest hover:border-[#D4AF37]"
                >
                  WhatsApp Tuning Specialist
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/45 aspect-[16/11]">
                <img
                  src="https://images.pexels.com/photos/5495045/pexels-photo-5495045.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000"
                  alt="Elevate Your Car Headlight & Detail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  <span>BEST IN THE MARKET</span>
                  <span className="text-[#D4AF37] font-bold">MUMBAI STUDIO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121317] border border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
              Book Performance / PPF Studio
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Our master technicians will inspect and schedule your bespoke upgrade in Mumbai.
            </p>

            {serviceBooked ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                <div className="text-white font-bold">
                  Studio Concierge Confirmed!
                </div>
                <button
                  onClick={() => {
                    setServiceBooked(false);
                    setServiceModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookService} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Raaghib Khan"
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 XXXXX"
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Service Package
                  </label>
                  <select
                    value={servicePackage}
                    onChange={(e) => setServicePackage(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option>Stage 2 ECU Remap + Valved Capristo Exhaust</option>
                    <option>Full-Body XPEL Self-Healing PPF + Ceramic</option>
                    <option>White-Glove Annual Maintenance Check</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black text-xs font-bold uppercase"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
