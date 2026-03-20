"use client";
import { useState } from "react";

const C = {
  navy: "#0a1628", blue: "#1a56db", blueLight: "#3b82f6", blueBg: "#eff6ff",
  green: "#10b981", greenDark: "#0f9b6e", greenBg: "#d1fae5",
  red: "#dc2626", redBg: "#fee2e2",
  amber: "#d97706", amberBg: "#fef3c7",
  white: "#ffffff", offWhite: "#f8fafc",
  g50: "#f1f5f9", g100: "#e2e8f0", g200: "#cbd5e1", g400: "#94a3b8",
  g500: "#64748b", g600: "#475569", g700: "#334155", g900: "#0f172a",
};
const heading = "'Bricolage Grotesque', sans-serif";
const body = "'Outfit', sans-serif";
const mono = "'JetBrains Mono', monospace";

const COMMON_ADDBACKS = [
  "Owner salary above market",
  "Owner vehicle / auto",
  "Owner health insurance",
  "Owner meals / entertainment",
  "Owner travel (personal)",
  "One-time legal / professional fees",
  "Depreciation / amortization",
  "Interest expense",
  "Rent above market (owner-related)",
  "Family member salary (non-working)",
  "Personal cell phone",
  "Charitable donations",
  "Non-recurring repairs / expenses",
];

const INDUSTRIES = [
  { value: "", label: "Select industry (optional)" },
  { value: "restaurant", label: "Restaurant / Food Service" },
  { value: "landscaping", label: "Landscaping" },
  { value: "hvac", label: "HVAC / Plumbing / Electrical" },
  { value: "laundromat", label: "Laundromat" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "fedex", label: "FedEx / Delivery Routes" },
  { value: "carwash", label: "Car Wash" },
  { value: "plumbing", label: "Plumbing" },
  { value: "construction", label: "Construction" },
  { value: "medical", label: "Medical / Dental Practice" },
  { value: "homeservices", label: "Home Services (General)" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
];

function InputField({ label, prefix, value, onChange, help, placeholder }) {
  return (
    <div style={{ marginBottom: 2 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: C.g500, marginBottom: 6, fontFamily: heading }}>{label}</label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: C.g400, fontFamily: mono }}>{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ""}
          style={{ width: "100%", padding: prefix ? "10px 12px 10px 28px" : "10px 12px", borderRadius: 8, border: `1.5px solid ${C.g100}`, fontSize: 14, fontFamily: mono, color: C.g700, background: C.g50, outline: "none", boxSizing: "border-box", transition: "border 0.15s" }}
          onFocus={(e) => (e.target.style.borderColor = C.blue)}
          onBlur={(e) => (e.target.style.borderColor = C.g100)}
        />
      </div>
      {help && <div style={{ fontSize: 11, color: C.g400, marginTop: 3 }}>{help}</div>}
    </div>
  );
}

export default function CIMAnalyzer({ onExtracted }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [revenue, setRevenue] = useState("");
  const [netIncome, setNetIncome] = useState("");
  const [ownerSalary, setOwnerSalary] = useState("");
  const [industry, setIndustry] = useState("");
  const [addBacks, setAddBacks] = useState([]);
  const [customAB, setCustomAB] = useState({ label: "", amount: "" });
  const [notes, setNotes] = useState("");

  const toggleAddBack = (label) => {
    const existing = addBacks.find((ab) => ab.label === label);
    if (existing) {
      setAddBacks(addBacks.filter((ab) => ab.label !== label));
    } else {
      setAddBacks([...addBacks, { label, amount: "" }]);
    }
  };

  const updateAddBackAmount = (label, amount) => {
    setAddBacks(addBacks.map((ab) => (ab.label === label ? { ...ab, amount } : ab)));
  };

  const addCustomAB = () => {
    if (customAB.label.trim()) {
      setAddBacks([...addBacks, { label: customAB.label.trim(), amount: customAB.amount }]);
      setCustomAB({ label: "", amount: "" });
    }
  };

  const totalAB = addBacks.reduce((sum, ab) => sum + (parseFloat(ab.amount) || 0), 0);
  const calcSDE = (parseFloat(netIncome) || 0) + (parseFloat(ownerSalary) || 0) + totalAB;

  const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");

  const handleApply = () => {
    onExtracted({
      name,
      askingPrice,
      annualRevenue: revenue,
      netIncome,
      ownerSalary,
      addBacks: addBacks.filter((ab) => parseFloat(ab.amount) > 0),
      industry,
    });
  };

  const card = { background: C.white, borderRadius: 10, padding: 24, border: `1px solid ${C.g100}`, marginBottom: 16 };
  const sectionH = { fontSize: 12, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em", color: C.g400, marginTop: 0, marginBottom: 16, fontWeight: 700 };
  const stepIndicator = { display: "flex", gap: 8, marginBottom: 20 };

  const steps = [
    { label: "Business Info", icon: "\uD83C\uDFE2" },
    { label: "Financials", icon: "\uD83D\uDCB0" },
    { label: "Add-Backs", icon: "\u2795" },
    { label: "Review", icon: "\u2705" },
  ];

  return (
    <div>
      {/* Progress */}
      <div style={stepIndicator}>
        {steps.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setStep(i)}
            style={{
              flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
              background: i === step ? C.navy : i < step ? C.greenBg : C.g50,
              color: i === step ? C.white : i < step ? C.greenDark : C.g400,
              fontSize: 11, fontWeight: 700, fontFamily: heading, cursor: "pointer",
              transition: "all 0.15s", textAlign: "center",
            }}
          >
            <span style={{ fontSize: 14, display: "block", marginBottom: 2 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Guidance banner */}
      <div style={{ padding: "12px 16px", background: C.blueBg, borderRadius: 8, marginBottom: 16, borderLeft: `3px solid ${C.blue}` }}>
        <div style={{ fontSize: 13, color: C.g700, lineHeight: 1.5 }}>
          {step === 0 && "Open your CIM or Offering Memorandum. Look for the business name, asking price, and industry on the first few pages or the executive summary."}
          {step === 1 && "Find the financial summary section. Look for Annual Revenue, Net Income (or Net Profit), and Owner\u2019s Salary/Compensation. Use the most recent full year\u2019s numbers."}
          {step === 2 && "Look for the \u201CRecast\u201D or \u201CAdjusted Earnings\u201D section. This lists expenses the owner runs through the business that a new buyer wouldn\u2019t have. Select each one and enter the dollar amount."}
          {step === 3 && "Review everything before sending to the analyzer. You can go back to any step to make changes."}
        </div>
      </div>

      {/* Step 0: Business Info */}
      {step === 0 && (
        <div style={card}>
          <h3 style={sectionH}>Business Information</h3>
          <InputField label="Business name" value={name} onChange={setName} placeholder="From the CIM cover page" />
          <div style={{ marginTop: 12 }}>
            <InputField label="Asking price" prefix="$" value={askingPrice} onChange={setAskingPrice} placeholder="0" help="Usually on page 1 or the executive summary" />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: C.g500, marginBottom: 6, fontFamily: heading }}>Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.g100}`, fontSize: 14, fontFamily: body, color: industry ? C.g700 : C.g400, background: C.g50, outline: "none", boxSizing: "border-box", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              {INDUSTRIES.map((ind) => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
            </select>
          </div>
          <button
            onClick={() => setStep(1)}
            style={{ width: "100%", marginTop: 20, padding: 14, border: "none", borderRadius: 8, background: C.navy, color: C.white, fontSize: 15, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}
          >
            Next: Financials {"\u2192"}
          </button>
        </div>
      )}

      {/* Step 1: Financials */}
      {step === 1 && (
        <div style={card}>
          <h3 style={sectionH}>Financial Summary</h3>
          <p style={{ fontSize: 12, color: C.g400, marginBottom: 16 }}>Use the most recent full year. Look for the P&amp;L or Income Statement section of the CIM.</p>
          <InputField label="Annual revenue" prefix="$" value={revenue} onChange={setRevenue} placeholder="0" help="Total revenue / gross sales for the most recent year" />
          <div style={{ marginTop: 12 }}>
            <InputField label="Net income (from P&L)" prefix="$" value={netIncome} onChange={setNetIncome} placeholder="0" help="Bottom line profit before owner add-backs" />
          </div>
          <div style={{ marginTop: 12 }}>
            <InputField label="Owner salary / draws" prefix="$" value={ownerSalary} onChange={setOwnerSalary} placeholder="0" help="Total owner compensation including salary, draws, and bonuses" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(0)} style={{ flex: 1, padding: 14, background: "transparent", color: C.g700, border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: body, cursor: "pointer" }}>{"\u2190"} Back</button>
            <button onClick={() => setStep(2)} style={{ flex: 2, padding: 14, border: "none", borderRadius: 8, background: C.navy, color: C.white, fontSize: 15, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}>Next: Add-Backs {"\u2192"}</button>
          </div>
        </div>
      )}

      {/* Step 2: Add-Backs */}
      {step === 2 && (
        <div style={card}>
          <h3 style={sectionH}>Owner Add-Backs</h3>
          <p style={{ fontSize: 12, color: C.g400, marginBottom: 16 }}>Select each add-back listed in the CIM and enter the dollar amount. These are expenses the current owner runs through the business that a new owner wouldn't have.</p>

          {/* Common add-backs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {COMMON_ADDBACKS.map((ab) => {
              const selected = addBacks.some((a) => a.label === ab);
              return (
                <button
                  key={ab}
                  onClick={() => toggleAddBack(ab)}
                  style={{
                    padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: selected ? `1.5px solid ${C.blue}` : `1px solid ${C.g200}`,
                    background: selected ? C.blueBg : C.white,
                    color: selected ? C.blue : C.g500,
                    cursor: "pointer", fontFamily: body, transition: "all 0.15s",
                  }}
                >
                  {selected ? "\u2713 " : ""}{ab}
                </button>
              );
            })}
          </div>

          {/* Selected add-backs with amounts */}
          {addBacks.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.04em", color: C.g400, marginBottom: 8 }}>
                Enter amounts ({addBacks.length} selected)
              </div>
              {addBacks.map((ab) => (
                <div key={ab.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, color: C.g600 }}>{ab.label}</span>
                  <div style={{ position: "relative", width: 140 }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: C.g400, fontFamily: mono }}>$</span>
                    <input
                      type="text"
                      value={ab.amount}
                      onChange={(e) => updateAddBackAmount(ab.label, e.target.value)}
                      placeholder="0"
                      style={{ width: "100%", padding: "8px 10px 8px 24px", borderRadius: 6, border: `1.5px solid ${C.g100}`, fontSize: 13, fontFamily: mono, color: C.g700, background: C.g50, outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => (e.target.style.borderColor = C.blue)}
                      onBlur={(e) => (e.target.style.borderColor = C.g100)}
                    />
                  </div>
                  <button onClick={() => toggleAddBack(ab.label)} style={{ background: "none", border: "none", color: C.g400, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>{"\u00d7"}</button>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `2px solid ${C.g200}`, marginTop: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: heading, color: C.g700 }}>Total Add-Backs</span>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: heading, color: C.green }}>{fmt(totalAB)}</span>
              </div>
            </div>
          )}

          {/* Custom add-back */}
          <div style={{ padding: "12px 16px", background: C.g50, borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.04em", color: C.g400, marginBottom: 8 }}>Add custom</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={customAB.label}
                onChange={(e) => setCustomAB({ ...customAB, label: e.target.value })}
                placeholder="Description"
                style={{ flex: 2, padding: "8px 10px", borderRadius: 6, border: `1.5px solid ${C.g100}`, fontSize: 13, fontFamily: body, color: C.g700, background: C.white, outline: "none", boxSizing: "border-box" }}
              />
              <input
                type="text"
                value={customAB.amount}
                onChange={(e) => setCustomAB({ ...customAB, amount: e.target.value })}
                placeholder="$0"
                style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1.5px solid ${C.g100}`, fontSize: 13, fontFamily: mono, color: C.g700, background: C.white, outline: "none", boxSizing: "border-box" }}
              />
              <button onClick={addCustomAB} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: C.navy, color: C.white, fontSize: 12, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}>Add</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, background: "transparent", color: C.g700, border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: body, cursor: "pointer" }}>{"\u2190"} Back</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: 14, border: "none", borderRadius: 8, background: C.navy, color: C.white, fontSize: 15, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}>Review {"\u2192"}</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <div style={card}>
            <h3 style={sectionH}>Review Extraction</h3>
            <div style={{ fontFamily: heading, fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 4, letterSpacing: "-0.02em" }}>
              {name || "Unnamed Business"}
            </div>
            {industry && <div style={{ fontSize: 13, color: C.g400, marginBottom: 16, textTransform: "capitalize" }}>{industry}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { l: "Asking Price", v: parseFloat(askingPrice) || null, c: C.navy },
                { l: "Annual Revenue", v: parseFloat(revenue) || null, c: C.blue },
                { l: "Net Income", v: parseFloat(netIncome) || null, c: C.g700 },
                { l: "Owner Salary", v: parseFloat(ownerSalary) || null, c: C.g700 },
              ].map((m) => (
                <div key={m.l} style={{ background: C.g50, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.g400, fontWeight: 600, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.03em" }}>{m.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: heading, color: m.v ? m.c : C.g200, letterSpacing: "-0.02em" }}>
                    {m.v ? fmt(m.v) : "Not entered"}
                  </div>
                </div>
              ))}
            </div>

            {addBacks.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.04em", color: C.g400, marginBottom: 8 }}>
                  Add-Backs ({addBacks.length})
                </div>
                {addBacks.filter((ab) => parseFloat(ab.amount) > 0).map((ab, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.g100}`, fontSize: 13 }}>
                    <span style={{ color: C.g600 }}>{ab.label}</span>
                    <span style={{ fontFamily: mono, fontWeight: 600, color: C.green }}>{fmt(parseFloat(ab.amount))}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Calculated SDE */}
            <div style={{ padding: "16px", background: C.greenBg, borderRadius: 8, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.04em", color: C.greenDark, marginBottom: 4 }}>Calculated SDE</div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: heading, color: C.greenDark, letterSpacing: "-0.03em" }}>{fmt(calcSDE)}</div>
              <div style={{ fontSize: 12, color: C.greenDark, marginTop: 4 }}>
                Net Income ({fmt(parseFloat(netIncome) || 0)}) + Owner Salary ({fmt(parseFloat(ownerSalary) || 0)}) + Add-Backs ({fmt(totalAB)})
              </div>
            </div>

            {/* Quick sanity checks */}
            {parseFloat(askingPrice) > 0 && calcSDE > 0 && (
              <div style={{ padding: "12px 16px", background: C.blueBg, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: heading, color: C.blue, marginBottom: 8 }}>Quick Sanity Check</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                  <div style={{ fontSize: 13, color: C.g700 }}>
                    <strong>SDE Multiple:</strong> {(parseFloat(askingPrice) / calcSDE).toFixed(2)}x
                    <span style={{ color: (parseFloat(askingPrice) / calcSDE) <= 3.5 ? C.green : C.red, fontWeight: 600 }}>
                      {(parseFloat(askingPrice) / calcSDE) <= 3.5 ? " \u2713" : " \u2717"}
                    </span>
                  </div>
                  {parseFloat(revenue) > 0 && (
                    <div style={{ fontSize: 13, color: C.g700 }}>
                      <strong>Price/Revenue:</strong> {((parseFloat(askingPrice) / parseFloat(revenue)) * 100).toFixed(1)}%
                      <span style={{ color: (parseFloat(askingPrice) / parseFloat(revenue)) <= 0.6 ? C.green : C.red, fontWeight: 600 }}>
                        {(parseFloat(askingPrice) / parseFloat(revenue)) <= 0.6 ? " \u2713" : " \u2717"}
                      </span>
                    </div>
                  )}
                  {parseFloat(revenue) > 0 && (
                    <div style={{ fontSize: 13, color: C.g700 }}>
                      <strong>SDE Margin:</strong> {((calcSDE / parseFloat(revenue)) * 100).toFixed(1)}%
                      <span style={{ color: (calcSDE / parseFloat(revenue)) >= 0.15 ? C.green : C.red, fontWeight: 600 }}>
                        {(calcSDE / parseFloat(revenue)) >= 0.15 ? " \u2713" : " \u2717"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 14, background: "transparent", color: C.g700, border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: body, cursor: "pointer" }}>{"\u2190"} Back</button>
            <button
              onClick={handleApply}
              style={{ flex: 2, padding: 14, border: "none", borderRadius: 8, background: C.green, color: C.navy, fontSize: 15, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}
            >
              Run Full Analysis {"\u2192"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
