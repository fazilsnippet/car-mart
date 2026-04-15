import { useState, useMemo, useEffect } from "react";

const EmiCalculator = ({
  price = 0,
  defaultRate = 9,
  defaultTenure = 5,
}) => {
  const [downPayment, setDownPayment] = useState(price * 0.1);
  const [rate, setRate] = useState(defaultRate);
  const [tenure, setTenure] = useState(defaultTenure);

  // 🔥 Loan derived from price
  const loan = useMemo(() => price - downPayment, [price, downPayment]);

  const emiData = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;

    if (!loan || months === 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };

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

  // 🔥 Reset downpayment when price changes
  useEffect(() => {
    setDownPayment(price * 0.1);
  }, [price]);

  return (
    <div className="p-4 border bg-background text-forground rounded-xl">
      <h3 className="mb-4 font-semibold">EMI Calculator</h3>

      <p className="mb-2 text-sm text-gray-500">
        Car Price: ₹ {price.toLocaleString()}
      </p>

      {/* DOWN PAYMENT */}
      <div className="mb-3">
        <label className="text-sm">Down Payment</label>
        <input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* RATE */}
      <div className="mb-3">
        <label className="text-sm">Interest Rate (%)</label>
        <input
          type="number"
            step="0.01"
          value={rate}
          onChange={(e) => setRate((e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
        
      {/* TENURE */}
      <div className="mb-3">
        <label className="text-sm">Tenure (years)</label>
        <input
          type="number"
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* RESULT */}
      <div className="p-3 mt-4 bg-gray-500 rounded">
        <p className="font-semibold">
          EMI: ₹ {emiData.emi.toFixed(0)}
        </p>
        <p>Total Interest: ₹ {emiData.totalInterest.toFixed(0)}</p>
      </div>
    </div>
  );
};

export default EmiCalculator;