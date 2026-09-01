"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Banknote,
  Send,
  Car,
  Calculator,
} from "lucide-react";

interface SellYourCarSectionProps {
  onValuationSubmitted: () => void;
}

export function SellYourCarSection({
  onValuationSubmitted,
}: SellYourCarSectionProps) {
  const [brand, setBrand] = useState("Porsche");
  const [model, setModel] = useState("911 Carrera S / GT3");
  const [year, setYear] = useState("2023");
  const [kms, setKms] = useState("8500");
  const [city, setCity] = useState("MH-01 Mumbai");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedValuation, setSubmittedValuation] = useState<string | null>(
    null
  );

  // Dynamic estimate calculation based on brand/year
  const calculateEstimate = () => {
    const baseCr =
      brand === "Ferrari" || brand === "Lamborghini" || brand === "Rolls-Royce"
        ? 3.95
        : brand === "Porsche" || brand === "McLaren" || brand === "Bentley"
        ? 2.65
        : 1.45;
    const yearFactor = Math.max(0.68, 1 - (2026 - Number(year)) * 0.08);
    const low = (baseCr * yearFactor).toFixed(2);
    const high = (baseCr * yearFactor * 1.12).toFixed(2);
    return `₹ ${low} Cr – ₹ ${high} Cr`;
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;
    setSubmitting(true);
    const est = calculateEstimate();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "29-Minute Car Valuation",
          customerName,
          phone,
          city,
          carToSellBrand: brand,
          carToSellModel: model,
          carToSellYear: Number(year),
          estimatedValuation: est,
          notes: `Vehicle Driven: ${kms} KMs. Requesting 29-minute outright offer.`,
        }),
      });
      setSubmittedValuation(est);
      onValuationSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const SELL_STEPS = [
    {
      num: "01",
      title: "100% Transparent Valuation",
      desc: "Live market algorithms & inspection pricing without middlemen markups.",
    },
    {
      num: "02",
      title: "Instant Liquidity",
      desc: "Direct RTGS/NEFT bank settlement before keys leave your driveway.",
    },
    {
      num: "03",
      title: "Trusted by 7,600+ Satisfied Customers",
      desc: "Mumbai’s most recommended exotic automotive house.",
    },
    {
      num: "04",
      title: "Easy Online Sell Form",
      desc: "Fill your car specs below in 60 seconds from your phone or office.",
    },
    {
      num: "05",
      title: "Get The Best Offer in as Little as 29 Minutes",
      desc: "Our senior acquisition team confirms outright purchase within half an hour.",
    },
    {
      num: "06",
      title: "Outright Purchase",
      desc: "Zero consignment delays — we buy directly into Wish Wheels inventory.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-[#121317] border-y border-[#D4AF37]/25 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5" />
            INSTANT OUTRIGHT ACQUISITION • MUMBAI
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-white tracking-tight">
            Sell your car{" "}
            <span className="text-gold-gradient block sm:inline">
              in minutes, not weeks.
            </span>
          </h2>
          <p className="mt-4 text-zinc-300 text-base sm:text-lg">
            Experience discrete, white-glove liquidation of your luxury or exotic supercar with guaranteed outright bank transfer in as little as 29 minutes.
          </p>
        </div>

        {/* 01 to 06 Grid + Interactive Valuation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 01 to 06 Numbered Wish Wheels Benefits */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {SELL_STEPS.map((step) => (
              <div
                key={step.num}
                className="group bg-[#0A0A0C] border border-zinc-800/90 hover:border-[#D4AF37]/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-spec text-3xl font-bold text-gold-gradient">
                    {step.num}.
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Instant 29-Minute Outright Valuation Form */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1C1E24] via-[#121317] to-[#0A0A0C] border border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                  INSTANT ESTIMATOR
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                  29-Minute Valuation
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>

            {submittedValuation ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold text-white">
                  Valuation Dispatched!
                </h4>
                <div className="bg-[#0A0A0C] border border-[#D4AF37]/40 rounded-2xl p-4">
                  <div className="text-xs font-mono text-zinc-400 uppercase">
                    ESTIMATED MARKET LIQUIDATION RANGE
                  </div>
                  <div className="font-mono-spec text-3xl font-bold text-gold-gradient mt-1">
                    {submittedValuation}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300">
                  Raaghib Khan’s senior appraisal concierge is reviewing your{" "}
                  <span className="text-white font-semibold">
                    {year} {brand} {model}
                  </span>{" "}
                  and will call <span className="text-[#D4AF37]">{phone}</span>{" "}
                  within 29 minutes.
                </p>
                <button
                  onClick={() => setSubmittedValuation(null)}
                  className="px-6 py-2.5 rounded-full bg-zinc-800 text-white text-xs font-mono uppercase hover:bg-zinc-700"
                >
                  Appraise Another Supercar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSellSubmit} className="space-y-4">
                {/* Live Estimated Range Preview Banner */}
                <div className="bg-[#0A0A0C] border border-[#D4AF37]/35 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">
                      LIVE ESTIMATED RANGE
                    </div>
                    <div className="font-mono-spec text-xl font-bold text-gold-gradient">
                      {calculateEstimate()}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-bold">
                    OUTRIGHT BUY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Brand
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      {[
                        "Porsche",
                        "Ferrari",
                        "Lamborghini",
                        "Mercedes-AMG",
                        "Rolls-Royce",
                        "BMW M",
                        "Range Rover",
                        "Bentley",
                        "McLaren",
                      ].map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Model / Variant
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. 911 GT3 RS"
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-2.5 py-2.5 text-xs text-white"
                    >
                      {["2025", "2024", "2023", "2022", "2021", "2020"].map(
                        (y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      KMs Driven
                    </label>
                    <input
                      type="number"
                      value={kms}
                      onChange={(e) => setKms(e.target.value)}
                      placeholder="4500"
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-2.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      RTO City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="MH-01"
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-2.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Raaghib / Rohan"
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 XXXXX"
                      className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C35D] to-[#BF953F] text-black font-bold text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(212,175,55,0.35)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting
                    ? "Calculating 29-Min Valuation..."
                    : "Get 29-Minute Outright Offer"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
