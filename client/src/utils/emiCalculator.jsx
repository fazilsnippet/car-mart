import { useState, useMemo, useEffect } from "react";

const EmiCalculator = ({
  price = 0,
  defaultRate = 9,
  defaultTenure = 5,
}) => {
  const [manualPrice, setManualPrice] = useState("");
  const [rate, setRate] = useState(defaultRate);
  const [tenure, setTenure] = useState(defaultTenure);

  // ✅ Decide which price to use
  const effectivePrice = price || Number(manualPrice) || 0;

  const [downPayment, setDownPayment] = useState(effectivePrice * 0.1);

  // 🔥 Update downpayment when price source changes
  useEffect(() => {
    if (effectivePrice) {
      setDownPayment(effectivePrice * 0.1);
    }
  }, [effectivePrice]);

  // 🔥 Loan calculation
  const loan = useMemo(
    () => effectivePrice - downPayment,
    [effectivePrice, downPayment]
  );

  const emiData = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;

    if (!loan || months === 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0 };
    }

    if (monthlyRate === 0) {
      const emi = loan / months;
      return {
        emi,
        totalPayment: loan,
        totalInterest: 0,
      };
    }

    const emi =
      (loan *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - loan;

    return { emi, totalPayment, totalInterest };
  }, [loan, rate, tenure]);

  return (
    <div className="p-5   bg-gradient-to-r
                      from-[#D4AF37]
                      via-[#fce7a2]
                      to-[#BF953F] rounded-2xl shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-black">
        EMI Calculator
      </h3>

      {/* 🔥 Show input ONLY if no API price */}
      {!price && (
        <div>
          <label className="text-sm text-gray-600">
            Enter Amount
          </label>
          <input
            type="number"
            placeholder="Enter car price"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-200 outline-none rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* SHOW PRICE */}
      {effectivePrice > 0 && (
        <p className="text-sm font-semibold text-black">
          Car Price: ₹ {effectivePrice.toLocaleString("en-IN")}
        </p>
      )}

      {/* DOWN PAYMENT */}
      <div>
        <label className="text-sm font-bold text-black">
          Down Payment
        </label>
        <input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="mt-1 text-black input"
        />
      </div>

      {/* RATE */}
      <div>
        <label className="text-sm font-bold text-black">
          Interest Rate (%)
        </label>
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="mt-1 text-black input"
        />
      </div>

      {/* TENURE */}
      <div>
        <label className="text-sm font-bold text-black">
          Tenure (years)
        </label>
        <input
          type="number"
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          className="mt-1 text-black input"
        />
      </div>

      {/* RESULT */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-lg font-semibold text-gray-800">
          EMI: ₹ {emiData.emi.toFixed(0)}
        </p>
        <p className="text-sm font-bold text-black">
          Total Interest: ₹{" "}
          {emiData.totalInterest.toFixed(0)}
        </p>
      </div>
    </div>
  );
};

export default EmiCalculator;