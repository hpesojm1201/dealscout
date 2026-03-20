"use client";
import { useState, useEffect } from "react";

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
const fmt = (n) => (n == null || isNaN(n)) ? "\u2014" : "$" + Math.round(n).toLocaleString("en-US");
const fmtX = (n) => (n == null || isNaN(n)) ? "\u2014" : n.toFixed(2) + "x";
const fmtPct = (n) => (n == null || isNaN(n)) ? "\u2014" : (n * 100).toFixed(1) + "%";

const STAGES = [
  { id: "screening", label: "Screening", color: C.g400, bg: C.g50 },
  { id: "analysis", label: "Analysis", color: C.blue, bg: C.blueBg },
  { id: "loi", label: "LOI Sent", color: C.amber, bg: C.amberBg },
  { id: "duediligence", label: "Due Diligence", color: "#7c3aed", bg: "#ede9fe" },
  { id: "closing", label: "Closing", color: C.greenDark, bg: C.greenBg },
  { id: "passed", label: "Passed", color: C.red, bg: C.redBg },
];

function getScoreColor(score) {
  if (score >= 3) return C.green;
  if (score >= 2) return C.amber;
  return C.red;
}

function getScoreBg(score) {
  if (score >= 3) return C.greenBg;
  if (score >= 2) return C.amberBg;
  return C.redBg;
}

function getScoreLabel(score) {
  if (score === 4) return "Strong Buy";
  if (score === 3) return "Worth Pursuing";
  if (score === 2) return "Proceed with Caution";
  if (score === 1) return "Weak";
  return "Fail";
}

// ── Storage helpers ──
function loadDeals() {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("dealscout_pipeline") : null;
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDeals(deals) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dealscout_pipeline", JSON.stringify(deals));
    }
  } catch (e) { console.error("Failed to save:", e); }
}

// ── Main Pipeline Component ──
export default function DealPipeline({ onLoadDeal }) {
  const [deals, setDeals] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDeals(loadDeals());
    setLoaded(true);
  }, []);

  const updateDeals = (newDeals) => {
    setDeals(newDeals);
    saveDeals(newDeals);
  };

  const deleteDeal = (id) => {
    if (confirm("Delete this deal from your pipeline?")) {
      updateDeals(deals.filter((d) => d.id !== id));
      setCompareIds(compareIds.filter((cid) => cid !== id));
    }
  };

  const updateStage = (id, stage) => {
    updateDeals(deals.map((d) => (d.id === id ? { ...d, stage, updatedAt: Date.now() } : d)));
  };

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((cid) => cid !== id));
    } else if (compareIds.length < 4) {
      setCompareIds([...compareIds, id]);
    }
  };

  // Filter and sort
  const filtered = deals.filter((d) => filter === "all" || d.stage === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date") return b.savedAt - a.savedAt;
    if (sortBy === "price") return (a.askingPrice || 0) - (b.askingPrice || 0);
    if (sortBy === "score") return (b.rulesPass || 0) - (a.rulesPass || 0);
    if (sortBy === "cashflow") return (b.monthlyCashFlow || 0) - (a.monthlyCashFlow || 0);
    return 0;
  });

  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s.id] = deals.filter((d) => d.stage === s.id).length;
    return acc;
  }, {});

  const card = { background: C.white, borderRadius: 10, padding: 24, border: `1px solid ${C.g100}` };

  if (!loaded) return null;

  // ── Compare View ──
  if (showCompare && compareIds.length >= 2) {
    const compareDealsList = compareIds.map((id) => deals.find((d) => d.id === id)).filter(Boolean);
    return (
      <div>
        <button onClick={() => setShowCompare(false)} style={{ background: "none", border: "none", color: C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: body, marginBottom: 16, padding: 0 }}>
          {"\u2190"} Back to Pipeline
        </button>

        <h3 style={{ fontFamily: heading, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>
          Side-by-Side Comparison
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.g200}` }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontFamily: heading, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: C.g400 }}>Metric</th>
                {compareDealsList.map((d) => (
                  <th key={d.id} style={{ textAlign: "right", padding: "10px 12px", fontFamily: heading, fontSize: 12, fontWeight: 700, color: C.navy }}>{d.name || "Unnamed"}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Asking Price", key: "askingPrice", format: fmt },
                { label: "Annual Revenue", key: "annualRevenue", format: fmt },
                { label: "SDE", key: "sde", format: fmt },
                { label: "Price/Revenue", key: "priceToRevenue", format: fmtPct },
                { label: "SDE Multiple", key: "sdeMultiple", format: fmtX },
                { label: "SDE Margin", key: "sdeMargin", format: fmtPct },
                { label: "DSCR", key: "dscr", format: fmtX },
                { label: "Monthly Cash Flow", key: "monthlyCashFlow", format: fmt },
                { label: "Rules Passed", key: "rulesPass", format: (n) => n != null ? `${n}/4` : "\u2014" },
              ].map((row) => {
                const values = compareDealsList.map((d) => d[row.key]);
                const best = row.key === "priceToRevenue" || row.key === "sdeMultiple" || row.key === "askingPrice"
                  ? Math.min(...values.filter((v) => v != null && !isNaN(v)))
                  : Math.max(...values.filter((v) => v != null && !isNaN(v)));

                return (
                  <tr key={row.label} style={{ borderBottom: `1px solid ${C.g100}` }}>
                    <td style={{ padding: "10px 12px", color: C.g500, fontWeight: 600 }}>{row.label}</td>
                    {compareDealsList.map((d) => {
                      const val = d[row.key];
                      const isBest = val != null && !isNaN(val) && val === best && values.filter((v) => v === best).length === 1;
                      return (
                        <td key={d.id} style={{
                          textAlign: "right", padding: "10px 12px", fontFamily: mono, fontWeight: 600,
                          color: isBest ? C.green : C.g700,
                          background: isBest ? C.greenBg : "transparent",
                        }}>
                          {row.format(val)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr style={{ borderBottom: `1px solid ${C.g100}` }}>
                <td style={{ padding: "10px 12px", color: C.g500, fontWeight: 600 }}>Stage</td>
                {compareDealsList.map((d) => {
                  const stage = STAGES.find((s) => s.id === d.stage) || STAGES[0];
                  return (
                    <td key={d.id} style={{ textAlign: "right", padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: stage.bg, color: stage.color }}>{stage.label}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (deals.length === 0) {
    return (
      <div style={{ ...card, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83D\uDCCA"}</div>
        <h3 style={{ fontFamily: heading, fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Your deal pipeline is empty
        </h3>
        <p style={{ fontSize: 14, color: C.g400, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 20px" }}>
          Analyze a deal first, then save it to your pipeline. Saved deals appear here so you can track, compare, and manage your entire acquisition search.
        </p>
        <button
          onClick={() => onLoadDeal(null)}
          style={{
            background: C.navy, color: C.white, border: "none", padding: "12px 24px",
            borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: heading, cursor: "pointer",
          }}
        >
          Analyze a Deal {"\u2192"}
        </button>
      </div>
    );
  }

  // ── Pipeline View ──
  return (
    <div>
      {/* Stage summary pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600,
            fontFamily: heading, cursor: "pointer",
            background: filter === "all" ? C.navy : C.g50, color: filter === "all" ? C.white : C.g500,
          }}
        >
          All ({deals.length})
        </button>
        {STAGES.map((s) => stageCounts[s.id] > 0 && (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600,
              fontFamily: heading, cursor: "pointer",
              background: filter === s.id ? s.bg : C.g50,
              color: filter === s.id ? s.color : C.g500,
            }}
          >
            {s.label} ({stageCounts[s.id]})
          </button>
        ))}
      </div>

      {/* Sort + compare controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.g400, fontWeight: 600 }}>Sort:</span>
          {[
            { id: "date", label: "Recent" },
            { id: "score", label: "Score" },
            { id: "cashflow", label: "Cash Flow" },
            { id: "price", label: "Price" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              style={{
                padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600,
                cursor: "pointer", background: sortBy === s.id ? C.blueBg : "transparent",
                color: sortBy === s.id ? C.blue : C.g400,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        {compareIds.length >= 2 && (
          <button
            onClick={() => setShowCompare(true)}
            style={{
              padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 700,
              fontFamily: heading, cursor: "pointer", background: C.blue, color: C.white,
            }}
          >
            Compare {compareIds.length} Deals {"\u2192"}
          </button>
        )}
      </div>

      {/* Deal cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((deal) => {
          const stage = STAGES.find((s) => s.id === deal.stage) || STAGES[0];
          const isSelected = compareIds.includes(deal.id);
          return (
            <div
              key={deal.id}
              style={{
                background: C.white, borderRadius: 10, padding: "16px 20px",
                border: isSelected ? `2px solid ${C.blue}` : `1px solid ${C.g100}`,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, color: C.navy, letterSpacing: "-0.02em" }}>
                      {deal.name || "Unnamed Deal"}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: stage.bg, color: stage.color }}>
                      {stage.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: C.g400 }}>
                    {deal.industry && <span style={{ textTransform: "capitalize" }}>{deal.industry} &middot; </span>}
                    Saved {new Date(deal.savedAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  {/* Key metrics */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: heading, fontSize: 18, fontWeight: 800, color: C.navy }}>{fmt(deal.askingPrice)}</div>
                    <div style={{ fontSize: 11, color: C.g400 }}>Asking</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: heading, fontSize: 18, fontWeight: 800, color: deal.monthlyCashFlow > 0 ? C.green : C.red }}>{fmt(deal.monthlyCashFlow)}</div>
                    <div style={{ fontSize: 11, color: C.g400 }}>Mo. Cash</div>
                  </div>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: getScoreBg(deal.rulesPass),
                    border: `2px solid ${getScoreColor(deal.rulesPass)}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: heading, fontSize: 16, fontWeight: 800,
                    color: getScoreColor(deal.rulesPass),
                  }}>
                    {deal.rulesPass}/4
                  </div>
                </div>
              </div>

              {/* Quick stats row */}
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: C.g500, flexWrap: "wrap" }}>
                <span>Rev: {fmt(deal.annualRevenue)}</span>
                <span>SDE: {fmt(deal.sde)}</span>
                <span>Multiple: {fmtX(deal.sdeMultiple)}</span>
                <span>DSCR: {fmtX(deal.dscr)}</span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <select
                  value={deal.stage}
                  onChange={(e) => updateStage(deal.id, e.target.value)}
                  style={{
                    padding: "5px 28px 5px 10px", borderRadius: 6, border: `1px solid ${C.g200}`,
                    fontSize: 11, fontFamily: heading, fontWeight: 600, color: C.g600,
                    background: C.white, cursor: "pointer",
                    appearance: "none", WebkitAppearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
                  }}
                >
                  {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button
                  onClick={() => onLoadDeal(deal)}
                  style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.white, color: C.blue, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: heading }}
                >
                  Re-Analyze
                </button>
                <button
                  onClick={() => toggleCompare(deal.id)}
                  style={{
                    padding: "5px 12px", borderRadius: 6, border: `1px solid ${isSelected ? C.blue : C.g200}`,
                    background: isSelected ? C.blueBg : C.white,
                    color: isSelected ? C.blue : C.g500,
                    fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: heading,
                  }}
                >
                  {isSelected ? "\u2713 Comparing" : "Compare"}
                </button>
                <button
                  onClick={() => deleteDeal(deal.id)}
                  style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.white, color: C.red, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: heading, marginLeft: "auto" }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: C.g400, marginTop: 24 }}>
        Deals saved locally in your browser. {deals.length} deal{deals.length !== 1 ? "s" : ""} in pipeline.
      </p>
    </div>
  );
}

// Export the save function for use in the analyzer
export function saveDealToPipeline(dealData) {
  const deals = loadDeals();
  const newDeal = {
    ...dealData,
    id: Math.random().toString(36).slice(2, 10),
    savedAt: Date.now(),
    updatedAt: Date.now(),
    stage: "screening",
  };
  deals.unshift(newDeal);
  saveDeals(deals);
  return newDeal;
}
