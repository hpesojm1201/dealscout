"use client";
import { useState, useCallback } from "react";
import DealScout from "./DealScout";
import CIMAnalyzer from "./CIMAnalyzer";
import DealPipeline from "./DealPipeline";

const C = {
  navy: "#0a1628", blue: "#1a56db", green: "#10b981", greenDark: "#0f9b6e",
  white: "#ffffff", offWhite: "#f8fafc",
  g50: "#f1f5f9", g100: "#e2e8f0", g200: "#cbd5e1", g400: "#94a3b8", g500: "#64748b", g700: "#334155", g900: "#0f172a",
};
const heading = "'Bricolage Grotesque', sans-serif";
const body = "'Outfit', sans-serif";

const TABS = [
  { id: "analyze", label: "Analyze", icon: "\uD83D\uDCCA" },
  { id: "cim", label: "CIM Entry", icon: "\uD83D\uDCC4" },
  { id: "pipeline", label: "Pipeline", icon: "\uD83D\uDCCB" },
];

export default function AnalyzeHub() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [prefill, setPrefill] = useState(null);

  // When CIM extraction completes, switch to analyzer with pre-filled data
  const handleCIMExtracted = useCallback((data) => {
    setPrefill(data);
    setActiveTab("analyze");
  }, []);

  // When user clicks "Re-Analyze" from pipeline
  const handleLoadDeal = useCallback((deal) => {
    if (deal) {
      setPrefill({
        name: deal.name || "",
        askingPrice: deal.askingPrice?.toString() || "",
        annualRevenue: deal.annualRevenue?.toString() || "",
        netIncome: deal.netIncome?.toString() || "",
        ownerSalary: deal.ownerSalary?.toString() || "",
        addBacks: deal.addBacks || [],
        industry: deal.industry || "",
      });
    }
    setActiveTab("analyze");
  }, []);

  // Clear prefill after it's been consumed
  const handlePrefillConsumed = useCallback(() => {
    setPrefill(null);
  }, []);

  return (
    <div style={{ fontFamily: body, color: C.g900, minHeight: "100vh", background: C.offWhite }}>
      {/* Header */}
      <div style={{ background: C.navy, padding: "12px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: C.green, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: heading, fontSize: 12, fontWeight: 800, color: C.navy }}>DS</span>
            </div>
            <span style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>DealScout</span>
          </a>
          <span style={{ fontSize: 12, color: C.g400 }}>v1.0 — Pro</span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.g100}`, padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 20px", border: "none", background: "transparent",
                borderBottom: activeTab === tab.id ? `2.5px solid ${C.navy}` : "2.5px solid transparent",
                color: activeTab === tab.id ? C.navy : C.g400,
                fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
                fontFamily: heading, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 60px" }}>
        {activeTab === "analyze" && (
          <DealScout
            prefill={prefill}
            onPrefillConsumed={handlePrefillConsumed}
            onSwitchTab={setActiveTab}
            embedded={true}
          />
        )}
        {activeTab === "cim" && (
          <CIMAnalyzer onExtracted={handleCIMExtracted} />
        )}
        {activeTab === "pipeline" && (
          <DealPipeline onLoadDeal={handleLoadDeal} />
        )}
      </div>
    </div>
  );
}
