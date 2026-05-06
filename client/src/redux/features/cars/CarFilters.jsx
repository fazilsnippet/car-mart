import { useState, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineX } from "react-icons/hi";

/* ---------------- SECTION ---------------- */

const Section = ({ id, title, children, open, onToggle }) => (
  <div className="py-3 border-b border-color">
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="flex items-center justify-between w-full"
    >
      <span className="text-sm font-semibold text-foreground">
        {title}
      </span>

      <HiOutlineChevronDown
        className={`w-5 h-5 text-foreground transition-transform ${
          open[id] ? "rotate-180" : ""
        }`}
      />
    </button>

    {open[id] && <div className="mt-3 space-y-1">{children}</div>}
  </div>
);

/* ---------------- CHECK ROW ---------------- */

const CheckRow = ({ label, count, checked, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-between w-full px-2 py-2 transition rounded-lg hover:bg-gray-50"
  >
    <span className="flex items-center gap-3">
      <span
        className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
          checked
            ? "bg-indigo-600 border-indigo-600"
            : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <span className="w-2 h-2 rounded-sm bg-background" />
        )}
      </span>

      <span className="text-sm text-foreground">{label}</span>
    </span>

    {typeof count === "number" && (
      <span className="text-xs text-foreground/70">({count})</span>
    )}
  </button>
);

/* ---------------- MAIN ---------------- */

export default function CarFilters({
  value,
  onChange,
  onClose,
  compact = false,
  brands = [],
  facets = {}
}) {
  const [open, setOpen] = useState({
    brand: true,
    price: true,
    fuel: true,
    transmission: true
  });

  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const toggle = (id) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const setField = (patch) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const toggleInArray = (key, item) => {
    const setValues = new Set(draft[key] ?? []);
    setValues.has(item) ? setValues.delete(item) : setValues.add(item);

    setField({ [key]: Array.from(setValues), page: 1 });
  };

  const applyFilters = () => {
    onChange(draft);
    onClose?.();
  };

  const resetFilters = () => {
    const cleared = {
      brand: [],
      fuelType: [],
      transmission: [],
      priceBucket: "",
      page: 1
    };
    setDraft(cleared);
    onChange(cleared);
  };

  const priceOptions = [
    { key: "0-5", label: "₹0 – ₹5L" },
    { key: "5-10", label: "₹5L – ₹10L" },
    { key: "10-15", label: "₹10L – ₹15L" },
    { key: "15-20", label: "₹15L – ₹20L" },
    { key: "20+", label: "₹20L+" }
  ];

  return (
    <div
      className={`${
        compact
          ? ""
          : "bg-background rounded-2xl shadow-sm border border-gray-100"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-background text-foreground">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Filters
          </h2>
          <p className="text-xs text-foreground/70">
            Refine your results
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 transition rounded-lg hover:bg-gray-100"
          >
            <HiOutlineX className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="px-4 pb-4">
        {/* BRAND */}
        <Section id="brand" title="Brand" open={open} onToggle={toggle}>
          {facets.brands?.map((b) => {
            const brandObj = brands.find(
              (br) => String(br._id) === String(b._id)
            );

            return (
              <CheckRow
                key={b._id}
                label={brandObj?.name || `Brand ${b._id}`}
                count={b.count}
                checked={(draft.brand ?? []).includes(b._id)}
                onClick={() => toggleInArray("brand", b._id)}
              />
            );
          })}
        </Section>

        {/* PRICE */}
        <Section id="price" title="Budget" open={open} onToggle={toggle}>
          {priceOptions.map((p) => (
            <CheckRow
              key={p.key}
              label={p.label}
              checked={draft.priceBucket === p.key}
              onClick={() =>
                setField({
                  priceBucket:
                    draft.priceBucket === p.key ? "" : p.key,
                  page: 1
                })
              }
            />
          ))}
        </Section>

        {/* FUEL */}
        <Section id="fuel" title="Fuel Type" open={open} onToggle={toggle}>
          {facets.fuelTypes?.map((f) => (
            <CheckRow
              key={f._id}
              label={f._id}
              count={f.count}
              checked={(draft.fuelType ?? []).includes(f._id)}
              onClick={() => toggleInArray("fuelType", f._id)}
            />
          ))}
        </Section>

        {/* TRANSMISSION */}
        <Section
          id="transmission"
          title="Transmission"
          open={open}
          onToggle={toggle}
        >
          {facets.transmissions?.map((t) => (
            <CheckRow
              key={t._id}
              label={t._id}
              count={t.count}
              checked={(draft.transmission ?? []).includes(t._id)}
              onClick={() => toggleInArray("transmission", t._id)}
            />
          ))}
        </Section>

        {/* ACTIONS */}
        <div className="sticky bottom-0 flex gap-3 pt-4 mt-6 bg-background">
          <button
            onClick={resetFilters}
            className="flex-1 py-2.5 text-sm font-medium border border-color rounded-xl hover:bg-slate-700 transition"
          >
            Reset
          </button>

          <button
            onClick={applyFilters}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}