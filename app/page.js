import Link from "next/link";
import PricingSection from "../components/PricingSection";

export default function Home() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "#0f172a", background: "#ffffff" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(10,22,40,0.85)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, background: "#10b981", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 800, color: "#0a1628" }}>DS</div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>DealScout</span>
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <a href="#features" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textDecoration: "none" }}>Features</a>
            <a href="#how" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textDecoration: "none" }}>How It Works</a>
            <a href="#pricing" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textDecoration: "none" }}>Pricing</a>
            <a href="#faq" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textDecoration: "none" }}>FAQ</a>
            <Link href="/analyze" style={{ background: "#10b981", color: "#0a1628", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif", textDecoration: "none" }}>Try Free &rarr;</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "140px 0 100px", background: "linear-gradient(170deg, #0a1628 0%, #111f38 50%, #0d1e36 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -300, right: -200, width: 800, height: 800, background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "6px 14px", borderRadius: 4, border: "1px solid rgba(16,185,129,0.15)", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%" }} /> Built for business buyers
            </div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(40px, 5.5vw, 64px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 20 }}>
              Analyze any deal<br />in <span style={{ color: "#10b981" }}>60 seconds.</span>
            </h1>
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.65, maxWidth: 540, marginBottom: 36, fontWeight: 300 }}>
              Upload a CIM or enter financials. Get instant SDE recast, SBA loan modeling, valuation scoring, stress testing, and a three-tier offer strategy. No spreadsheets. No guesswork.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
              <Link href="/analyze" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#0a1628", padding: "14px 28px", borderRadius: 6, fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", textDecoration: "none", letterSpacing: "-0.01em" }}>Analyze Your First Deal Free &rarr;</Link>
              <a href="#how" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#94a3b8", padding: "14px 28px", borderRadius: 6, fontSize: 15, fontWeight: 500, border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none" }}>See How It Works</a>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { num: <>4<span style={{ color: "#10b981" }}>+4</span></>, lbl: "Valuation rules + stress tests" },
                { num: <>60<span style={{ color: "#10b981" }}>s</span></>, lbl: "From listing to verdict" },
                { num: <>SBA<span style={{ color: "#10b981" }}> 7(a)</span></>, lbl: "Optimized with seller financing" },
                { num: "13", lbl: "Industry benchmarks" },
              ].map((s) => (
                <div key={s.lbl}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <div style={{ background: "#f1f5f9", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "20px 0", textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "#64748b" }}>Built with methodology from <strong style={{ color: "#334155" }}>20+ real deal evaluations</strong> across FedEx routes, landscaping, HVAC, laundromats, and home services</span>
      </div>

      {/* Features */}
      <section id="features" style={{ padding: "100px 0", maxWidth: 1080, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a56db", marginBottom: 12 }}>Features</div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>Everything a searcher needs.<br />Nothing they don't.</h2>
        <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, marginBottom: 48, lineHeight: 1.6 }}>Eight purpose-built tools that replace your spreadsheet, your calculator, and half the conversations with your broker.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {[
            { icon: "\ud83d\udcca", bg: "#eff6ff", color: "#1a56db", title: "SDE recast engine", desc: "Add back owner salary, personal expenses, one-time costs with 10 preset categories. Calculates true Seller's Discretionary Earnings automatically." },
            { icon: "\u2713", bg: "#d1fae5", color: "#0f9b6e", title: "4-rule valuation scoring", desc: "Every deal scored against battle-tested rules: price-to-revenue ratio, owner earnings %, NOI multiple, and debt service coverage ratio." },
            { icon: "\ud83c\udfe6", bg: "#fef3c7", color: "#b45309", title: "SBA 7(a) loan calculator", desc: "Model your exact loan terms \u2014 rate, down payment, term length. See monthly payments, total interest, and DSCR instantly." },
            { icon: "\ud83c\udfaf", bg: "#f3e8ff", color: "#7c3aed", title: "3-tier offer strategy", desc: "Backward-calculate three offers \u2014 opening, target, and walk-away max \u2014 each with DSCR rationale and monthly cash flow." },
            { icon: "\ud83d\udcb0", bg: "#eff6ff", color: "#1a56db", title: "Seller financing modeling", desc: "Toggle on a seller note with custom amount, rate, term, and standstill period. Entire analysis recalculates with blended debt service.", isNew: true },
            { icon: "\ud83d\udcc8", bg: "#d1fae5", color: "#0f9b6e", title: "Industry benchmarks", desc: "Select from 13 business types. See how your deal's SDE multiple compares to the industry range.", isNew: true },
            { icon: "\u26a0\ufe0f", bg: "#fee2e2", color: "#dc2626", title: "Sensitivity stress test", desc: "What if revenue drops 10%, 20%, 30%? See exactly how DSCR and monthly cash flow change under stress.", isNew: true },
            { icon: "\ud83d\udce5", bg: "#f1f5f9", color: "#475569", title: "PDF report export", desc: "Download a clean, print-ready report with verdict, metrics, loan structure, offer strategy, and DD checklist.", isNew: true },
          ].map((f) => (
            <div key={f.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 20, background: f.bg }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.02em" }}>
                {f.title}
                {f.isNew && <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, background: "#d1fae5", color: "#0f9b6e", padding: "2px 8px", borderRadius: 3, marginLeft: 6, verticalAlign: "middle", letterSpacing: "0.04em" }}>NEW</span>}
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "100px 0", background: "#0a1628", color: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#10b981", marginBottom: 12 }}>How it works</div>
          <h2 style={{ textAlign: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>From listing to verdict in three steps.</h2>
          <p style={{ textAlign: "center", fontSize: 16, color: "#94a3b8", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.6 }}>No training, no onboarding, no learning curve. If you can read a broker listing, you can use DealScout.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { num: "1", title: "Enter the numbers", desc: "Plug in asking price, revenue, net income, and owner salary from any listing or CIM. Pick the industry. Takes 30 seconds." },
              { num: "2", title: "Recast the SDE", desc: "Add back owner perks and one-time expenses from 10 presets, or add custom items. Toggle on seller financing if applicable." },
              { num: "3", title: "Get your verdict", desc: "Instant scoring, SBA breakdown, three-tier offer strategy, stress test, industry benchmarks, and a downloadable report." },
            ].map((s) => (
              <div key={s.num} style={{ textAlign: "center", padding: "24px 16px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1a2d4d", border: "2px solid #10b981", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20, color: "#10b981", marginBottom: 20 }}>{s.num}</div>
                <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "100px 0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a56db", marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>One bad deal costs $100,000+.<br />This costs less than dinner.</h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.6 }}>Free trial on every plan. No credit card required to start.</p>
          <PricingSection />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 0", maxWidth: 1080, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ textAlign: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a56db", marginBottom: 12 }}>FAQ</div>
        <h2 style={{ textAlign: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 48 }}>Questions searchers ask</h2>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {[
            { q: 'What are the "4 valuation rules"?', a: "We score every deal against four criteria: (1) never pay more than 60% of annual revenue, (2) owner should earn at least 15% of revenue, (3) price should be no more than 3.5x SDE, and (4) DSCR should be at least 1.5x." },
            { q: "How does the 3-tier offer strategy work?", a: "Instead of starting from the asking price, we start from your SDE and work backward. We calculate an opening offer (2.0x DSCR), a target price (1.5x DSCR), and a walk-away max (1.25x DSCR). Each comes with reasoning and monthly cash flow projections." },
            { q: "What does the stress test show me?", a: "It shows what happens to your DSCR and monthly cash flow if revenue drops 10%, 20%, or 30% while expenses stay the same. If your deal survives a 20% decline and still covers payments, you have a resilient acquisition." },
            { q: "Does this replace a broker or advisor?", a: "No. DealScout is a screening and analysis tool. It saves you hours of spreadsheet work on deals you'd pass on, and gives you a stronger analytical foundation when you engage professionals." },
            { q: "What types of businesses can I analyze?", a: "Any small business with financial statements. We have benchmarks for 13 sectors including landscaping, HVAC, FedEx routes, laundromats, car washes, waste routes, restaurants, e-commerce, home services, medical/dental, auto repair, and construction." },
            { q: "How does seller financing change the analysis?", a: "When you toggle on seller financing, DealScout models blended debt service \u2014 your SBA payment plus the seller note payment. This changes your DSCR, monthly cash flow, and all three offer prices." },
            { q: "Is my data secure?", a: "Yes. All deal data is encrypted in transit and at rest. We never share your analysis with sellers, brokers, or third parties." },
          ].map((item) => (
            <div key={item.q} style={{ borderBottom: "1px solid #e2e8f0", padding: "24px 0" }}>
              <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{item.q}</h4>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "100px 0", background: "#0a1628", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 12, position: "relative" }}>Stop guessing.<br />Start analyzing.</h2>
        <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32, position: "relative" }}>Your first deal analysis is free. No credit card required.</p>
        <Link href="/analyze" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#0a1628", padding: "16px 36px", borderRadius: 6, fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", textDecoration: "none", position: "relative" }}>Analyze Your First Deal &rarr;</Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: 28, textAlign: "center", fontSize: 12, color: "#94a3b8", background: "#0f172a" }}>
        <p>&copy; 2026 DealScout. Not financial advice. Always consult qualified professionals.</p>
        <p style={{ marginTop: 8 }}><a href="#faq" style={{ color: "#94a3b8", textDecoration: "underline" }}>FAQ</a> &middot; <a href="/terms" style={{ color: "#94a3b8", textDecoration: "underline" }}>Terms</a> &middot; <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "underline" }}>Privacy</a></p>
      </footer>
    </div>
  );
}
