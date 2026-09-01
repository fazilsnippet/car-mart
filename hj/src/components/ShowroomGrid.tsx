"use client";

import React, { useState } from "react";
import { Vehicle, VehicleDetailModal } from "./VehicleDetailModal";
import {
  ShieldCheck,
  Calendar,
  Gauge,
  Zap,
  Scale,
  MessageCircle,
  Eye,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

interface ShowroomGridProps {
  vehicles: Vehicle[];
  loading: boolean;
  currency: "INR" | "USD" | "EUR";
  compareIds: number[];
  onToggleCompare: (vehicle: Vehicle) => void;
  onBookViewing: (vehicle: Vehicle) => void;
  onResetFilters: () => void;
}

export function ShowroomGrid({
  vehicles,
  loading,
  currency,
  compareIds,
  onToggleCompare,
  onBookViewing,
  onResetFilters,
}: ShowroomGridProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modelRangeTab, setModelRangeTab] = useState<string>("All");

  const formatPrice = (rawLakhs: number, inrStr: string) => {
    if (currency === "USD") {
      const usd = Math.round(rawLakhs * 1175);
      return `$ ${usd.toLocaleString("en-US")}`;
    }
    if (currency === "EUR") {
      const eur = Math.round(rawLakhs * 1085);
      return `€ ${eur.toLocaleString("en-US")}`;
    }
    return inrStr;
  };

  const filteredVehicles =
    modelRangeTab === "All"
      ? vehicles
      : modelRangeTab === "German Performance"
      ? vehicles.filter((v) =>
          ["Porsche", "Mercedes-AMG", "BMW M", "Audi RS"].includes(v.brand)
        )
      : modelRangeTab === "Italian Exotics"
      ? vehicles.filter((v) => ["Ferrari", "Lamborghini"].includes(v.brand))
      : vehicles.filter((v) =>
          ["Rolls-Royce", "Bentley", "Range Rover", "McLaren"].includes(v.brand)
        );

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Model Range Showcase Header matching wishwheels.com */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            MODEL RANGE • SPANNING GERMAN DISCIPLINE & ITALIAN DRAMA
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Our Curated Showroom Collection
          </h2>
          <p className="mt-2 text-zinc-400 max-w-2xl text-sm sm:text-base">
            Every vehicle is handpicked, 150-point certified, and presented inside our flagship Mumbai exotic salon with guaranteed transparent regulatory & RTO transfer.
          </p>
        </div>

        {/* Model Range Heritage Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#121317] border border-zinc-800 p-1.5 rounded-2xl">
          {[
            "All",
            "German Performance",
            "Italian Exotics",
            "British Royalty",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setModelRangeTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                modelRangeTab === tab
                  ? "bg-[#D4AF37] text-black font-bold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Vehicles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="bg-[#121317] border border-zinc-800 rounded-3xl h-96 animate-pulse p-6"
            />
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-[#121317] border border-zinc-800 rounded-3xl p-12 text-center max-w-xl mx-auto">
          <SlidersHorizontal className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="font-serif-luxury text-2xl font-bold text-white">
            No matching supercars found
          </h3>
          <p className="mt-2 text-zinc-400 text-sm">
            Try adjusting your search query, brand filter, or owner history to inspect more vehicles in our Mumbai vault.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-6 px-6 py-3 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest"
          >
            Reset Filters & View All 9 Machines
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredVehicles.map((car) => {
            const isCompared = compareIds.includes(car.id);
            return (
              <div
                key={car.id}
                className="group relative bg-[#121317] border border-zinc-800/90 hover:border-[#D4AF37]/65 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.65)] flex flex-col justify-between"
              >
                {/* Vehicle Image Frame */}
                <div>
                  <div
                    onClick={() => setSelectedVehicle(car)}
                    className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer"
                  >
                    <img
                      src={car.imageUrl}
                      alt={car.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/45 text-[11px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        {car.ownerHistory === "Unregistered (0 KM)"
                          ? "ZERO-METER IMPORT"
                          : "150-PT CERTIFIED"}
                      </span>

                      {/* Compare Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(car);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold flex items-center gap-1 transition-all ${
                          isCompared
                            ? "bg-[#D4AF37] text-black font-bold"
                            : "bg-black/75 text-zinc-300 hover:text-white border border-zinc-700"
                        }`}
                        title="Add to side-by-side comparison"
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isCompared ? "Compared" : "Compare"}</span>
                      </button>
                    </div>

                    {/* 0-100 Badge bottom right image */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-zinc-700 px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-200">
                      0-100: <span className="text-[#D4AF37] font-bold">{car.acceleration0to100}</span>
                    </div>
                  </div>

                  {/* Vehicle Body Copy */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span className="text-[#D4AF37] uppercase tracking-widest font-semibold">
                        {car.brand}
                      </span>
                      <span>{car.registrationCity}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedVehicle(car)}
                      className="font-serif-luxury text-xl sm:text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
                    >
                      {car.title}
                    </h3>

                    {/* Price Display */}
                    <div className="mt-3 flex items-baseline justify-between border-b border-zinc-800 pb-4">
                      <span className="font-mono-spec text-2xl font-bold text-gold-gradient">
                        {formatPrice(car.priceRaw, car.priceInr)}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {car.bodyType} • {car.seatingCapacity}S
                      </span>
                    </div>

                    {/* Key Spec Grid */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-xl p-2.5">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">
                          YEAR
                        </div>
                        <div className="text-xs font-bold text-white font-mono mt-0.5">
                          {car.year}
                        </div>
                      </div>
                      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-xl p-2.5">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">
                          ODOMETER
                        </div>
                        <div className="text-xs font-bold text-white font-mono mt-0.5">
                          {car.kmsDriven === 0
                            ? "0 KM"
                            : `${car.kmsDriven.toLocaleString()} KM`}
                        </div>
                      </div>
                      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-xl p-2.5">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">
                          FUEL
                        </div>
                        <div className="text-xs font-bold text-white font-mono mt-0.5">
                          {car.fuelType}
                        </div>
                      </div>
                    </div>

                    {/* First 2 Highlights */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {car.highlights.slice(0, 2).map((hl, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-[#1C1E24] text-[11px] text-zinc-300 font-mono border border-zinc-800 line-clamp-1"
                        >
                          • {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVehicle(car)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Spec Sheet</span>
                  </button>

                  <button
                    onClick={() => onBookViewing(car)}
                    className="px-3.5 py-3 rounded-xl bg-[#18191E] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs transition-all"
                    title="Book Private Showroom Viewing"
                  >
                    Book VIP
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Vehicle Spec Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        currency={currency}
        onBookViewing={onBookViewing}
      />
    </section>
  );
}
