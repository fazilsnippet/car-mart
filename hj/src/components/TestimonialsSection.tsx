"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  Quote,
  PlusCircle,
  X,
  Send,
  Award,
} from "lucide-react";

export interface Testimonial {
  id: number;
  name: string;
  vehiclePurchased: string;
  rating: number;
  comment: string;
  verifiedBy: string;
  date: string;
  avatarInitials: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onTestimonialAdded: () => void;
}

export function TestimonialsSection({
  testimonials,
  onTestimonialAdded,
}: TestimonialsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [vehiclePurchased, setVehiclePurchased] = useState(
    "2024 Porsche 911 GT3 RS"
  );
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    setSubmitting(true);
    try {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          vehiclePurchased,
          comment,
          rating: 5,
        }),
      });
      setName("");
      setComment("");
      setModalOpen(false);
      onTestimonialAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#121317] border-t border-[#D4AF37]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest mb-3">
              TESTIMONIALS • MUMBAI FLAGSHIP
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight">
              What Our Clients Say
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
              <div className="flex items-center text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-mono font-bold text-white">4.9 / 5.0</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">100% Google Verified Reviews</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18191E] border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs uppercase tracking-widest transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Share Your Wish Wheels Story
          </button>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#0A0A0C] border border-zinc-800/90 hover:border-[#D4AF37]/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#D4AF37]/30" />
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#BF953F] text-black font-serif-luxury font-bold text-sm flex items-center justify-center">
                    {t.avatarInitials || "WW"}
                  </div>
                  <div>
                    <div className="font-serif-luxury text-base font-bold text-white">
                      {t.name}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {t.vehiclePurchased}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-mono font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Google Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Client Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121317] border border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Share Client Experience
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abhishek Gupta"
                  className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                  Supercar Purchased
                </label>
                <input
                  type="text"
                  value={vehiclePurchased}
                  onChange={(e) => setVehiclePurchased(e.target.value)}
                  placeholder="2024 Porsche 911 GT3 RS"
                  className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Special mention of Raaghib whose professionalism and transparency is par excellence..."
                  className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Publishing Review..." : "Publish Verified Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
