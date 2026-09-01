"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import {
  HeroAndSearchConsole,
  FilterState,
} from "@/components/HeroAndSearchConsole";
import { ShowroomGrid } from "@/components/ShowroomGrid";
import { SellYourCarSection } from "@/components/SellYourCarSection";
import { EditorialAndServiceSection } from "@/components/EditorialAndServiceSection";
import {
  TestimonialsSection,
  Testimonial,
} from "@/components/TestimonialsSection";
import { PrivateViewingFormSection } from "@/components/PrivateViewingFormSection";
import { CompareVehiclesDrawer } from "@/components/CompareVehiclesDrawer";
import {
  ShowroomConciergeModal,
  Inquiry,
} from "@/components/ShowroomConciergeModal";
import { Vehicle } from "@/components/VehicleDetailModal";
import { FooterSection } from "@/components/FooterSection";
import { MessageCircle } from "lucide-react";

export default function WishWheelsHomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");

  // Comparison drawer state
  const [comparedVehicles, setComparedVehicles] = useState<Vehicle[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  // Showroom Concierge Admin modal state
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Private viewing target vehicle
  const [targetViewingVehicle, setTargetViewingVehicle] =
    useState<Vehicle | null>(null);

  // Multi-Filter state matching wishwheels.com
  const [filters, setFilters] = useState<FilterState>({
    brand: "All",
    category: "All",
    bodyType: "All",
    fuelType: "All",
    ownerHistory: "All",
    seatingCapacity: "All",
    minYear: 2019,
    maxYear: 2026,
    search: "",
    sortBy: "featured",
  });

  const fetchVehicles = useCallback(async () => {
    setLoadingVehicles(true);
    try {
      const params = new URLSearchParams();
      if (filters.brand !== "All") params.set("brand", filters.brand);
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.bodyType !== "All") params.set("bodyType", filters.bodyType);
      if (filters.ownerHistory !== "All")
        params.set("ownerHistory", filters.ownerHistory);
      if (filters.search) params.set("search", filters.search);
      params.set("sortBy", filters.sortBy);

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      const data = await res.json();
      if (data.vehicles) {
        setVehicles(data.vehicles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVehicles(false);
    }
  }, [filters]);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.testimonials) setTestimonials(data.testimonials);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchTestimonials();
    fetchInquiries();
  }, [fetchTestimonials, fetchInquiries]);

  const handleUpdateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      brand: "All",
      category: "All",
      bodyType: "All",
      fuelType: "All",
      ownerHistory: "All",
      seatingCapacity: "All",
      minYear: 2019,
      maxYear: 2026,
      search: "",
      sortBy: "featured",
    });
  };

  const handleToggleCompare = (car: Vehicle) => {
    setComparedVehicles((prev) => {
      const exists = prev.some((v) => v.id === car.id);
      if (exists) {
        return prev.filter((v) => v.id !== car.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), car];
      }
      return [...prev, car];
    });
  };

  const handleBookViewingFromCard = (car: Vehicle) => {
    setTargetViewingVehicle(car);
    const el = document.getElementById("private-viewing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F5F5F7]">
      {/* Glassmorphic Sticky Header */}
      <NavigationHeader
        activeCategory={filters.category}
        onSelectCategory={(cat) => handleUpdateFilters({ category: cat })}
        onOpenSellModal={() => {
          const el = document.getElementById("private-viewing");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenCompareModal={() => setCompareDrawerOpen(true)}
        compareCount={comparedVehicles.length}
        currency={currency}
        onChangeCurrency={setCurrency}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        inquiryCount={inquiries.filter((i) => i.status === "New Inquiry").length}
      />

      {/* Hero Carousel & Docked Multi-Filter Search Console */}
      <HeroAndSearchConsole
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        totalFilteredCount={vehicles.length}
        onOpenSellModal={() => {
          const el = document.getElementById("private-viewing");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Curated Model Range & Showroom Grid */}
      <ShowroomGrid
        vehicles={vehicles}
        loading={loadingVehicles}
        currency={currency}
        compareIds={comparedVehicles.map((c) => c.id)}
        onToggleCompare={handleToggleCompare}
        onBookViewing={handleBookViewingFromCard}
        onResetFilters={handleResetFilters}
      />

      {/* "Sell Your Car in Minutes, Not Weeks" (01-06 Numbers & Instant 29-Min Valuation) */}
      <SellYourCarSection onValuationSubmitted={fetchInquiries} />

      {/* Founder Editorial Quote (Raaghib Khan) & Performance Tuning Studio */}
      <EditorialAndServiceSection />

      {/* Google-Verified Client Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
        onTestimonialAdded={fetchTestimonials}
      />

      {/* "Drive the Dream — One Stop for Luxury Supercars" Private Salon Booking */}
      <PrivateViewingFormSection
        vehicles={vehicles}
        selectedInitialVehicle={targetViewingVehicle}
        onAppointmentBooked={fetchInquiries}
      />

      {/* Compare Vehicles Drawer */}
      <CompareVehiclesDrawer
        isOpen={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        vehicles={comparedVehicles}
        onRemoveVehicle={(id) =>
          setComparedVehicles((prev) => prev.filter((v) => v.id !== id))
        }
        onClearAll={() => {
          setComparedVehicles([]);
          setCompareDrawerOpen(false);
        }}
        onBookViewing={handleBookViewingFromCard}
      />

      {/* Showroom Concierge Admin Suite Modal */}
      <ShowroomConciergeModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        inquiries={inquiries}
        onRefreshData={() => {
          fetchInquiries();
          fetchVehicles();
        }}
      />

      {/* Floating Compare Pill Bottom Left if items selected */}
      {comparedVehicles.length > 0 && !compareDrawerOpen && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={() => setCompareDrawerOpen(true)}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black font-bold text-xs uppercase tracking-wider shadow-[0_10px_30px_rgba(212,175,55,0.45)] flex items-center gap-2"
          >
            <span>Compare ({comparedVehicles.length}/3 Supercars)</span>
          </button>
        </div>
      )}

      {/* Floating WhatsApp VIP Concierge Action Button */}
      <a
        href="https://wa.me/919820144512?text=Hello%20Wish%20Wheels%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20supercar."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp VIP Concierge"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.5)] transition-all hover:scale-105 group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">WhatsApp VIP Concierge</span>
      </a>

      {/* Luxury Footer */}
      <FooterSection />
    </div>
  );
}
