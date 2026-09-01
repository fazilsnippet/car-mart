"use client";

import React from "react";
import { Vehicle } from "./VehicleDetailModal";
import { X, Scale, ShieldCheck, Zap, PhoneCall } from "lucide-react";

interface CompareVehiclesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onRemoveVehicle: (id: number) => void;
  onClearAll: () => void;
  onBookViewing: (v: Vehicle) => void;
}

export function CompareVehiclesDrawer({
  isOpen,
  onClose,
  vehicles,
  onRemoveVehicle,
  onClearAll,
  onBookViewing,
}: CompareVehiclesDrawerProps) {
  if (!isOpen || vehicles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-6xl bg-[#121317] border border-[#D4AF37]/50 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Supercar Head-to-Head Spec Comparison
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Comparing {vehicles.length} machine{vehicles.length > 1 ? "s" : ""} from Mumbai Showroom
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-mono text-zinc-400 hover:text-red-400"
            >
              Clear Comparison
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side by side comparison grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-${vehicles.length} gap-6`}>
          {vehicles.map((car) => (
            <div
              key={car.id}
              className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                  <img
                    src={car.imageUrl}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onRemoveVehicle(car.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 text-zinc-300 hover:text-red-400 flex items-center justify-center text-xs"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-mono text-[#D4AF37] uppercase">
                  {car.brand} • {car.year}
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-white mt-1">
                  {car.title}
                </h4>
                <div className="font-mono-spec text-2xl font-bold text-gold-gradient mt-2">
                  {car.priceInr}
                </div>

                {/* Rows of specs */}
                <div className="mt-4 space-y-2.5 text-xs border-t border-zinc-800 pt-3">
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-400 font-mono">0-100 KM/H</span>
                    <span className="text-[#D4AF37] font-bold font-mono">
                      {car.acceleration0to100}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-400 font-mono">TOP SPEED</span>
                    <span className="text-white font-bold font-mono">
                      {car.topSpeed}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-400 font-mono">ENGINE SPECS</span>
                    <span className="text-white font-bold text-right max-w-[170px]">
                      {car.engineSpecs}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-400 font-mono">ODOMETER</span>
                    <span className="text-white font-bold font-mono">
                      {car.kmsDriven === 0
                        ? "0 KM (Zero-Meter)"
                        : `${car.kmsDriven.toLocaleString()} KMs`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-400 font-mono">OWNER</span>
                    <span className="text-white font-bold">
                      {car.ownerHistory}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400 font-mono">WARRANTY</span>
                    <span className="text-[#10B981] font-semibold text-right max-w-[170px]">
                      {car.warrantyStatus}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onBookViewing(car);
                }}
                className="mt-6 w-full py-3 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Book Private Viewing
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
