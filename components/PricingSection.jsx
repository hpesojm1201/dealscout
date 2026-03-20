"use client";

import { useState } from "react";
import Link from "next/link";

const heading = "'Bricolage Grotesque', sans-serif";
const body = "'Outfit', sans-serif";

// These will be replaced with your actual Stripe Price IDs
const PRICES = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "",
  lifetime: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || "",
};

function PricingButton({ priceId, mode, label, primary }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!priceId) {
      // If no price ID configured yet, go to analyze page as free trial
      window.location.href = "/analyze";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (primary) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          display: "block", width: "100%", textAlign: "center", padding: 12,
          borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: heading,
          cursor: loading ? "wait" : "pointer", border: "none",
          background: "#1a56db", color: "#fff",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Loading..." : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "block", width: "100%", textAlign: "center", padding: 12,
        borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: heading,
        cursor: loading ? "wait" : "pointer",
        background: "transparent", color: "#334155", border: "1.5px solid #cbd5e1",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}

export default function PricingSection() {
  const plans = [
    {
      plan: "Starter", price: "$49", per: "/mo",
      desc: "For searchers just starting to evaluate deals.",
      features: ["5 deal analyses per month", "SDE recast engine", "SBA 7(a) loan calculator", "4-rule valuation scoring", "PDF report export"],
      priceId: PRICES.starter, mode: "subscription", featured: false,
    },
    {
      plan: "Pro", price: "$149", per: "/mo",
      desc: "For active searchers evaluating multiple deals weekly.",
      features: ["Unlimited deal analyses", "Everything in Starter", "3-tier offer strategy", "Seller financing modeling", "Industry benchmarks (13 sectors)", "Sensitivity stress testing", "Priority support"],
      priceId: PRICES.pro, mode: "subscription", featured: true,
    },
    {
      plan: "Lifetime", price: "$499", per: " once",
      desc: "Pay once, use forever. Best for committed searchers.",
      features: ["Everything in Pro", "Lifetime access, no renewals", "All future features included", "Early access to new tools", "Founding member badge"],
      priceId: PRICES.lifetime, mode: "payment", featured: false,
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, maxWidth: 860, margin: "0 auto" }}>
      {plans.map((p) => (
        <div key={p.plan} style={{
          background: "#fff", border: p.featured ? "2px solid #1a56db" : "1px solid #e2e8f0",
          borderRadius: 12, padding: 32, position: "relative", textAlign: "left",
          boxShadow: p.featured ? "0 8px 30px rgba(26,86,219,0.1)" : "none",
        }}>
          {p.featured && (
            <div style={{
              position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
              background: "#1a56db", color: "#fff", fontFamily: heading,
              fontSize: 10, fontWeight: 700, padding: "4px 16px", borderRadius: 20,
              letterSpacing: "0.04em", whiteSpace: "nowrap",
            }}>MOST POPULAR</div>
          )}
          <div style={{ fontFamily: heading, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>{p.plan}</div>
          <div style={{ fontFamily: heading, fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em" }}>
            {p.price}<span style={{ fontSize: 16, fontWeight: 400, color: "#94a3b8" }}>{p.per}</span>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 24px", lineHeight: 1.5 }}>{p.desc}</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
            {p.features.map((f) => (
              <li key={f} style={{ fontSize: 13, padding: "6px 0", display: "flex", alignItems: "flex-start", gap: 8, color: "#334155" }}>
                <span style={{ color: "#0f9b6e", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{"\u2713"}</span>{f}
              </li>
            ))}
          </ul>
          <PricingButton
            priceId={p.priceId}
            mode={p.mode}
            label={p.featured ? "Start free trial \u2192" : p.plan === "Lifetime" ? "Get lifetime access" : "Start free trial"}
            primary={p.featured}
          />
        </div>
      ))}
    </div>
  );
}
