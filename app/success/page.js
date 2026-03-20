import Link from "next/link";

export const metadata = {
  title: "Welcome to DealScout!",
  description: "Your subscription is active. Start analyzing deals.",
};

const heading = "'Bricolage Grotesque', sans-serif";
const body = "'Outfit', sans-serif";

export default function SuccessPage() {
  return (
    <div style={{ fontFamily: body, color: "#0f172a", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>{"\u2713"}</div>
        <h1 style={{ fontFamily: heading, fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>You're in!</h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.6, marginBottom: 32 }}>
          Your DealScout subscription is active. You now have full access to the deal analyzer, SDE recast engine, SBA loan calculator, stress testing, industry benchmarks, and PDF reports.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/analyze" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#0a1628", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 700, fontFamily: heading, textDecoration: "none" }}>
            Start Analyzing Deals {"\u2192"}
          </Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#334155", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 500, fontFamily: body, textDecoration: "none", border: "1.5px solid #e2e8f0" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
