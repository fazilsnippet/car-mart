"use client";

import React, { useState } from "react";
import { Vehicle } from "./VehicleDetailModal";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Send,
  PhoneCall,
  Sparkles,
} from "lucide-react";

interface PrivateViewingFormSectionProps {
  vehicles: Vehicle[];
  selectedInitialVehicle?: Vehicle | null;
  onAppointmentBooked: () => void;
}

export function PrivateViewingFormSection({
  vehicles,
  selectedInitialVehicle,
  onAppointmentBooked,
}: PrivateViewingFormSectionProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("2026-04-05");
  const [vehicleTitle, setVehicleTitle] = useState(
    selectedInitialVehicle?.title || "2024 Porsche 911 GT3 RS Weissach Package"
  );
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;
    setSubmitting(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "VIP Showroom Viewing",
          customerName,
          phone,
          email,
          preferredDate,
          vehicleTitle,
          notes: notes || "Requested private salon viewing at Mumbai Flagship Showroom",
        }),
      });
      setBookedSuccess(true);
      onAppointmentBooked();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="private-viewing" className="py-20 sm:py-28 bg-[#0A0A0C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#121317] via-[#1C1E24] to-[#121317] border border-[#D4AF37]/50 rounded-3xl p-8 sm:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.85)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Story Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                DRIVE THE DREAM • ONE STOP FOR LUXURY SUPERCARS
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Schedule a Private Showroom Viewing
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Step into Mumbai’s most exclusive automotive salon. Enjoy a bespoke walk-around, cold engine start, inspection file walkthrough, and private road test accompanied by Raaghib Khan’s senior sales concierge.
              </p>

              <div className="space-y-4 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase">
                      FLAGSHIP LOUNGE ADDRESS
                    </div>
                    <div className="text-sm font-bold text-white">
                      Wish Wheels Salon, Worli & Bandra West, Mumbai
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase">
                      DIRECT VIP CONCIERGE LINE
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      +91 98201 44512 • +91 98200 94749
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Appointment Form */}
            <div className="lg:col-span-7">
              {bookedSuccess ? (
                <div className="bg-[#0A0A0C] border border-[#10B981] rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                    Private Viewing Confirmed
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto">
                    Your appointment for{" "}
                    <span className="text-[#D4AF37] font-semibold">
                      {vehicleTitle}
                    </span>{" "}
                    on <span className="font-mono text-white">{preferredDate}</span>{" "}
                    has been assigned to your private concierge.
                  </p>
                  <button
                    onClick={() => setBookedSuccess(false)}
                    className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase"
                  >
                    Schedule Another Viewing
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#0A0A0C] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Select Supercar to Experience
                      </label>
                      <select
                        value={vehicleTitle}
                        onChange={(e) => setVehicleTitle(e.target.value)}
                        className="w-full bg-[#121317] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-3 text-xs text-white"
                      >
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.title}>
                            {v.title} ({v.priceInr})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#121317] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Raaghib / Abhishek"
                        className="w-full bg-[#121317] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-3 text-xs text-white"
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
                        className="w-full bg-[#121317] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@luxurycollection.in"
                      className="w-full bg-[#121317] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C35D] to-[#BF953F] text-black font-bold text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submitting
                      ? "Booking Private Salon..."
                      : "Confirm VIP Showroom Appointment"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
