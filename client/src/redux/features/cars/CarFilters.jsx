import { useState, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineX } from "react-icons/hi";

const Section = ({ id, title, children, open, onToggle }) => (
  <div className="py-3 border-b border-slate-100 bg-background text-foreground">
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="flex items-center justify-between w-full text-left"
    >
      <span className="text-sm font-semibold text-slate-900">{title}</span>
      <HiOutlineChevronDown
        className={`w-5 h-5 text-slate-500 transition-transform ${
          open[id] ? "rotate-180" : ""
        }`}
      />
    </button>
    {open[id] && <div className="mt-3">{children}</div>}
  </div>
);

const CheckRow = ({ label, count, checked, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-slate-50"
  >
    <span className="flex items-center gap-2">
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center ${
          checked
            ? "bg-indigo-600 border-indigo-600"
            : "bg-white border-slate-300"
        }`}
      >
        {checked && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </span>
    {typeof count === "number" && (
      <span className="text-xs text-slate-500">({count})</span>
    )}
  </button>
);

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

  /* -------------------------
     Local Draft State
  -------------------------- */

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
    onChange(draft); // 🔥 Only now server is queried
    onClose?.(); // Close the filter panel after applying
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
      className={`bg-white ${
        compact ? "" : "rounded-2xl border border-slate-100 shadow-sm bg-background text-foreground"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          <p className="text-xs text-slate-500">Refine your search</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 pb-4">

        {/* Brand */}
        {/* <Section id="brand" title="Brand" open={open} onToggle={toggle}>
          {facets.brands?.map((b) => {
            const brandObj = brands.find(br => br._id === b._id);
            if (!brandObj) return null;

            return (
              <CheckRow
                key={b._id}
                label={brandObj.name}
                count={b.count}
                checked={(draft.brand ?? []).includes(b._id)}
                onClick={() => toggleInArray("brand", b._id)}
              />
            );
          })}
        </Section> */}
        <Section id="brand" title="Brand" open={open} onToggle={toggle}>
        {facets.brands?.map((b) => {
  const brandObj = brands.find(
    (br) => String(br._id) === String(b._id)
  );


  return (
    <CheckRow
      key={b._id}
      label={brandObj?.name || `Missing (${b._id})`}
      count={b.count}
      checked={(draft.brand ?? []).includes(b._id)}
      onClick={() => toggleInArray("brand", b._id)}
    />
  );
})}
 </Section>

        {/* Price */}
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

        {/* Fuel */}
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

        {/* Transmission */}
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

        {/* Apply / Reset Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={resetFilters}
            className="flex-1 py-2 text-sm font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            onClick={applyFilters}
            className="flex-1 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
}