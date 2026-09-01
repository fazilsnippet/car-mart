"use client";

import React, { useState } from "react";
import {
  X,
  PlusCircle,
  Users,
  CheckCircle2,
  Clock,
  PhoneCall,
  Car,
  ShieldCheck,
  Send,
} from "lucide-react";

export interface Inquiry {
  id: number;
  type: string;
  vehicleTitle?: string | null;
  customerName: string;
  phone: string;
  email?: string | null;
  preferredDate?: string | null;
  city?: string | null;
  carToSellBrand?: string | null;
  carToSellModel?: string | null;
  carToSellYear?: number | null;
  estimatedValuation?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
}

interface ShowroomConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: Inquiry[];
  onRefreshData: () => void;
}

export function ShowroomConciergeModal({
  isOpen,
  onClose,
  inquiries,
  onRefreshData,
}: ShowroomConciergeModalProps) {
  const [activeTab, setActiveTab] = useState<"inquiries" | "add_vehicle">(
    "inquiries"
  );

  // New vehicle form state
  const [brand, setBrand] = useState("Porsche");
  const [model, setModel] = useState("911 Turbo S Cabriolet");
  const [year, setYear] = useState("2024");
  const [priceInr, setPriceInr] = useState("₹ 4.10 Cr");
  const [priceRaw, setPriceRaw] = useState("410");
  const [kmsDriven, setKmsDriven] = useState("1200");
  const [category, setCategory] = useState("Pre-Loved Luxury");
  const [exteriorColor, setExteriorColor] = useState("Gentian Blue Metallic");
  const [engineSpecs, setEngineSpecs] = useState("3.8L Twin-Turbo Flat-6 (640 HP)");
  const [acceleration0to100, setAcceleration0to100] = useState("2.6 sec");
  const [topSpeed, setTopSpeed] = useState("330 km/h");
  const [imageUrl, setImageUrl] = useState(
    "https://images.pexels.com/photos/30687976/pexels-photo-30687976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=750&w=1400"
  );
  const [submittingVehicle, setSubmittingVehicle] = useState(false);

  if (!isOpen) return null;

  const handleUpdateStatus = async (id: number, status: string) => {
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    onRefreshData();
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVehicle(true);
    try {
      await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${year} ${brand} ${model}`,
          brand,
          model,
          year: Number(year),
          priceInr,
          priceRaw: Number(priceRaw),
          kmsDriven: Number(kmsDriven),
          category,
          exteriorColor,
          engineSpecs,
          acceleration0to100,
          topSpeed,
          imageUrl,
          isFeatured: true,
          ownerHistory: kmsDriven === "0" ? "Unregistered (0 KM)" : "1st Owner",
          highlights: [
            "150-Point Certified Inspection",
            "Official Factory Warranty Covered",
            "Zero Accident History Guaranteed",
          ],
        }),
      });
      setActiveTab("inquiries");
      onRefreshData();
    } finally {
      setSubmittingVehicle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-[#121317] border border-[#D4AF37]/60 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/45 text-[#D4AF37] text-xs font-mono font-bold uppercase">
              SHOWROOM CONCIERGE SUITE
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Wish Wheels Live Dealership Desk
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-zinc-800 px-6 bg-[#0A0A0C]/50">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`py-3.5 px-4 text-xs font-mono font-bold uppercase border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            VIP Inquiries & Valuations ({inquiries.length})
          </button>

          <button
            onClick={() => setActiveTab("add_vehicle")}
            className={`py-3.5 px-4 text-xs font-mono font-bold uppercase border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "add_vehicle"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            + Add New Supercar to Showroom
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {activeTab === "inquiries" ? (
            inquiries.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 font-mono text-sm">
                No inquiries recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold uppercase">
                          {item.type}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {item.city || "Mumbai Showroom"}
                        </span>
                      </div>

                      <div className="font-serif-luxury text-lg font-bold text-white">
                        {item.customerName} •{" "}
                        <span className="font-mono text-[#D4AF37] text-sm">
                          {item.phone}
                        </span>
                      </div>

                      {item.vehicleTitle && (
                        <div className="text-xs text-zinc-300">
                          Supercar:{" "}
                          <span className="text-white font-semibold">
                            {item.vehicleTitle}
                          </span>
                        </div>
                      )}

                      {item.estimatedValuation && (
                        <div className="text-xs text-[#10B981] font-mono font-bold">
                          Trade-In Valuation Estimate: {item.estimatedValuation}{" "}
                          ({item.carToSellYear} {item.carToSellBrand}{" "}
                          {item.carToSellModel})
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-xs text-zinc-400 italic">
                          &ldquo;{item.notes}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2 shrink-0">
                      {[
                        "New Inquiry",
                        "Concierge Assigned",
                        "Showroom Scheduled",
                        "Completed",
                      ].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(item.id, st)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase font-semibold transition-all ${
                            item.status === st
                              ? "bg-[#D4AF37] text-black font-bold"
                              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleCreateVehicle} className="space-y-4 max-w-3xl">
              <div className="text-xs font-mono text-[#D4AF37] uppercase">
                ADD VEHICLE TO MUMBAI EXOTIC INVENTORY
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
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
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="Pre-Loved Luxury">Pre-Loved Luxury</option>
                    <option value="Un-Registered Exotics">
                      Un-Registered Exotics
                    </option>
                    <option value="Bespoke Showroom">Bespoke Showroom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Price String (₹ Cr)
                  </label>
                  <input
                    type="text"
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Price Raw (in Lakhs)
                  </label>
                  <input
                    type="number"
                    value={priceRaw}
                    onChange={(e) => setPriceRaw(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    KMs Driven (0 for Zero-Meter)
                  </label>
                  <input
                    type="number"
                    value={kmsDriven}
                    onChange={(e) => setKmsDriven(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Exterior Paint
                  </label>
                  <input
                    type="text"
                    value={exteriorColor}
                    onChange={(e) => setExteriorColor(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    0-100 KM/H
                  </label>
                  <input
                    type="text"
                    value={acceleration0to100}
                    onChange={(e) => setAcceleration0to100(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Top Speed
                  </label>
                  <input
                    type="text"
                    value={topSpeed}
                    onChange={(e) => setTopSpeed(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Engine & Powertrain Specs
                </label>
                <input
                  type="text"
                  value={engineSpecs}
                  onChange={(e) => setEngineSpecs(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingVehicle}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black font-bold text-xs uppercase tracking-widest"
              >
                {submittingVehicle
                  ? "Publishing to Showroom..."
                  : "Publish Supercar to Live Showroom"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
