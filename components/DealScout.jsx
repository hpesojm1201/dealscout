"use client";
import { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } from "react";
import { saveDealToPipeline } from "./DealPipeline";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

// ── Brand tokens (matching landing page) ──
const C = {
  navy: "#0a1628", navyMid: "#111f38", navyLight: "#1a2d4d",
  blue: "#1a56db", blueLight: "#3b82f6", blueBg: "#eff6ff",
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

const fmt = (n) => {
  if (n == null || isNaN(n)) return "\u2014";
  return (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
};
const fmtPct = (n) => (n == null || isNaN(n)) ? "\u2014" : (n * 100).toFixed(1) + "%";
const fmtX = (n) => (n == null || isNaN(n)) ? "\u2014" : n.toFixed(2) + "x";

// ── Tooltip system ──
const TipCtx = createContext({ show: () => {}, hide: () => {} });

function TipProvider({ children }) {
  const [tip, setTip] = useState(null);
  const show = useCallback((text, rect) => setTip({ text, rect }), []);
  const hide = useCallback(() => setTip(null), []);
  return (
    <TipCtx.Provider value={{ show, hide }}>
      {children}
      {tip && tip.rect && <TipBubble text={tip.text} anchor={tip.rect} />}
    </TipCtx.Provider>
  );
}

function TipBubble({ text, anchor }) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 600;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const w = Math.min(290, vw - 16);
  let left = anchor.left + anchor.width / 2 - w / 2;
  if (left < 8) left = 8;
  if (left + w > vw - 8) left = vw - w - 8;
  const below = anchor.bottom + 8;
  const fitsBelow = below + 100 < vh;
  return (
    <div style={{ position: "fixed", left, top: fitsBelow ? below : undefined, bottom: fitsBelow ? undefined : (vh - anchor.top + 8), zIndex: 2147483647, width: w, background: C.navy, color: C.offWhite, padding: "10px 14px", borderRadius: 8, fontSize: 12, lineHeight: 1.55, fontFamily: body, fontWeight: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", pointerEvents: "none" }}>
      {text}
      <div style={{ position: "absolute", ...(fitsBelow ? { top: -5 } : { bottom: -5 }), left: Math.max(12, Math.min(w - 20, anchor.left + anchor.width / 2 - left - 5)), width: 10, height: 10, background: C.navy, transform: fitsBelow ? "rotate(45deg)" : "rotate(225deg)", borderRadius: 1 }} />
    </div>
  );
}

const TIPS = {
  businessName: "The name of the business you\u2019re evaluating. Just for your reference.",
  askingPrice: "The seller\u2019s listed price. Found in the broker listing or CIM. Starting point for negotiation.",
  annualRevenue: "Total sales for the most recent 12 months. Found on the P&L or tax return.",
  netIncome: "Bottom-line profit after ALL expenses on the P&L. Often understated in small businesses.",
  ownerSalary: "Total owner compensation \u2014 salary, draws, distributions, bonuses. Added back because you\u2019d set your own salary.",
  sde: "Seller\u2019s Discretionary Earnings = Net Income + Owner Salary + Add-Backs. The #1 valuation metric for small businesses.",
  addBacks: "Personal or one-time expenses the owner runs through the business. Adding these back reveals true earning power.",
  sbaRate: "Annual interest rate on SBA 7(a) loan. Currently ~10\u201311.5%. Usually Prime + 2.75%.",
  sbaTerm: "Repayment period. SBA acquisitions typically 10 years.",
  sbaDown: "Cash you pay upfront. SBA minimum 10%. Formula: Asking Price \u00d7 Down %.",
  sellerNote: "A loan from the seller, typically 10\u201315% of the price at 5\u20138% interest with payments deferred 12\u201324 months.",
  targetCF: "Your minimum monthly income requirement after SBA loan payments. The tool uses this to calculate the maximum price you can pay and still hit your cash flow goal.",
  snAmount: "Dollar amount the seller finances. Reduces the SBA loan by the same amount.",
  snRate: "Interest rate on the seller note. Usually 5\u20138%, well below SBA rates.",
  snTerm: "Repayment period for the seller note. Often 3\u20135 years.",
  snStandstill: "Months before seller note payments begin. SBA lenders often require 12\u201324 months.",
  industry: "Select the business type to see typical SDE multiples for that industry.",
  priceToRev: "Formula: Asking Price \u00f7 Revenue. Rule: Never pay more than 60% of revenue.",
  ownerEarn: "Formula: SDE \u00f7 Revenue. Rule: Owner should earn \u2265 15% of revenue.",
  noiMult: "Formula: Asking Price \u00f7 SDE. Rule: Don\u2019t pay more than 3.5x SDE.",
  dscr: "Formula: SDE \u00f7 Total Annual Debt Service. Rule: DSCR \u2265 1.5x.",
  dp: "Cash at closing. Formula: Asking Price \u00d7 Down % \u2212 Seller Note.",
  loan: "SBA loan amount. Formula: Asking Price \u2212 Down Payment \u2212 Seller Note.",
  mo: "Fixed monthly SBA payment (principal + interest).",
  annDS: "Total annual payments (SBA + seller note after standstill).",
  totInt: "Total interest over loan life.",
  dscrCalc: "DSCR at asking price. Lenders need 1.25x min; target 1.5x+.",
  opening: "Opening position \u2014 2.0x DSCR. 100% cash cushion. Start here.",
  target: "Balanced offer \u2014 1.5x DSCR. 50% cushion. Where most good deals close.",
  walkaway: "Absolute ceiling \u2014 1.25x DSCR. Only 25% cushion. Very stable businesses only.",
  moCash: "Monthly take-home after all debt payments.",
  verdict: "4/4 = Strong Buy, 3/4 = Conditional Go, 2/4 = Caution, 0\u20131/4 = Pass.",
  stressTest: "Shows DSCR and cash flow if revenue drops 10/20/30%. Assumes expenses stay constant (worst case).",
};

function Tip({ id, children, style }) {
  const { show, hide } = useContext(TipCtx);
  const ref = useRef(null);
  const doShow = () => { if (ref.current && TIPS[id]) show(TIPS[id], ref.current.getBoundingClientRect()); };
  return (
    <span style={{ cursor: "default", ...style }}>
      {children}
      <span ref={ref} onMouseEnter={doShow} onMouseLeave={hide} onTouchStart={(e) => { e.stopPropagation(); doShow(); setTimeout(hide, 4000); }} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, borderRadius: "50%", background: C.g100, color: C.g500, fontSize: 10, fontWeight: 700, marginLeft: 4, verticalAlign: "middle", fontFamily: body, lineHeight: 1, cursor: "help" }}>?</span>
    </span>
  );
}

// ── Industry benchmarks ──
const INDUSTRIES = {
  "": { label: "Select industry (optional)", range: null },
  landscaping: { label: "Landscaping / Lawn Care", range: [2.0, 3.0], note: "Seasonal revenue, equipment-heavy" },
  hvac: { label: "HVAC / Plumbing / Electrical", range: [2.5, 3.5], note: "Recurring service contracts add value" },
  fedex: { label: "FedEx Ground ISP Routes", range: [3.0, 4.5], note: "Premium for contracted revenue, but driver risk" },
  laundromat: { label: "Laundromat / Coin Laundry", range: [2.5, 4.0], note: "Semi-absentee, equipment condition matters" },
  carwash: { label: "Car Wash", range: [3.0, 5.0], note: "Location-dependent, real estate value" },
  waste: { label: "Waste / Recycling Routes", range: [3.0, 4.0], note: "Recurring contracts, high barriers" },
  restaurant: { label: "Restaurant / Food Service", range: [1.5, 2.5], note: "High failure rate, active management" },
  ecommerce: { label: "E-Commerce / Online Retail", range: [2.5, 4.0], note: "Check platform dependency and ad spend" },
  homeSvc: { label: "Home Services (cleaning, pest, etc.)", range: [2.0, 3.5], note: "Recurring revenue commands premium" },
  medical: { label: "Medical / Dental Practice", range: [3.0, 5.0], note: "Provider transition risk, insurance mix" },
  auto: { label: "Auto Repair / Body Shop", range: [2.0, 3.0], note: "Equipment and technician retention" },
  construction: { label: "Construction / Remodeling", range: [1.5, 2.5], note: "Project-based, backlog matters" },
  other: { label: "Other / General Service Business", range: [2.0, 3.5], note: "Varies widely" },
};

// ── Math ──
function analyzeRules({ askingPrice: ap, annualRevenue: rev, sde, debtService: ds }) {
  const r = {};
  const pr = ap / rev;
  r.priceToRev = { pass: pr <= 0.6, display: fmtPct(pr), label: "Price \u2264 60% of revenue", tid: "priceToRev", detail: `Asking ${fmtPct(pr)} of revenue (max 60%)` };
  const op = sde / rev;
  r.ownerEarn = { pass: op >= 0.15, display: fmtPct(op), label: "Owner earns \u2265 15% of revenue", tid: "ownerEarn", detail: `Owner earns ${fmtPct(op)} of revenue` };
  const nm = ap / sde;
  r.noiMult = { pass: nm <= 3.5, display: fmtX(nm), label: "Price \u2264 3.5x SDE", tid: "noiMult", detail: `Asking price is ${fmtX(nm)} SDE` };
  const dv = ds > 0 ? sde / ds : 0;
  r.dscr = { pass: dv >= 1.5, display: fmtX(dv), label: "DSCR \u2265 1.5x", tid: "dscr", detail: `Cash flow covers debt ${fmtX(dv)}` };
  const pc = Object.values(r).filter((x) => x.pass).length;
  let v, c;
  if (pc === 4) { v = "STRONG BUY"; c = C.green; }
  else if (pc === 3) { v = "CONDITIONAL GO"; c = C.blue; }
  else if (pc === 2) { v = "PROCEED WITH CAUTION"; c = C.amber; }
  else { v = "PASS"; c = C.red; }
  return { rules: r, passCount: pc, verdict: v, color: c };
}

function calcLoan(price, rate, years, downPct, sellerNoteAmt = 0) {
  const dp = price * downPct;
  const sbaLoan = price - dp - sellerNoteAmt;
  const mr = rate / 12; const n = years * 12;
  const mp = sbaLoan > 0 ? sbaLoan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : 0;
  return { dp, sbaLoan, mp, sbaAnnDS: mp * 12, totInt: mp * n - sbaLoan };
}

function calcSellerNote(amount, rate, years) {
  if (amount <= 0) return { mp: 0, annDS: 0 };
  const mr = rate / 12; const n = years * 12;
  const mp = amount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  return { mp, annDS: mp * 12 };
}

function backwardOffer(sde, dscrTarget, rate, years, downPct, snPct, snRate, snYears) {
  const targetDS = sde / dscrTarget;
  let lo = 0, hi = sde * dscrTarget * 10;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const snAmt = mid * snPct;
    const sbaInfo = calcLoan(mid, rate, years, downPct, snAmt);
    const snInfo = calcSellerNote(snAmt, snRate, snYears);
    const totalDS = sbaInfo.sbaAnnDS + snInfo.annDS;
    if (totalDS < targetDS) lo = mid; else hi = mid;
  }
  const price = Math.round((lo + hi) / 2);
  const snAmt = price * snPct;
  const sbaInfo = calcLoan(price, rate, years, downPct, snAmt);
  const snInfo = calcSellerNote(snAmt, snRate, snYears);
  return { price, annDS: sbaInfo.sbaAnnDS + snInfo.annDS };
}

// ── PDF Export ──
function generatePDF(data) {
  const { name, askP, rev, sde, analysis, loan, snInfo, totalAnnDS, offers, moCash, industry, stressRows } = data;
  const ind = INDUSTRIES[industry];
  const line = (l, v) => `<tr><td style="padding:5px 8px;color:#64748b;font-size:11px;border-bottom:1px solid #e2e8f0">${l}</td><td style="padding:5px 8px;text-align:right;font-weight:600;font-size:11px;border-bottom:1px solid #e2e8f0">${v}</td></tr>`;
  const ruleR = (r) => `<tr><td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #e2e8f0"><span style="color:${r.pass ? C.green : C.red};font-weight:700">${r.pass ? '\u2713' : '\u2717'}</span> ${r.label}</td><td style="padding:5px 8px;text-align:right;font-weight:600;font-size:11px;color:${r.pass ? C.green : C.red};border-bottom:1px solid #e2e8f0">${r.display}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>DealScout - ${name||'Analysis'}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#0f172a;padding:32px;max-width:800px;margin:0 auto;font-size:12px}h2{font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;margin:20px 0 8px;border-bottom:2px solid #e2e8f0;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin-bottom:12px}.verdict{display:inline-block;padding:6px 16px;border-radius:6px;color:#fff;font-weight:700;font-size:14px;margin:8px 0}.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}.metric{background:#f1f5f9;border-radius:6px;padding:10px;text-align:center}.metric .label{font-size:9px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b}.metric .val{font-size:18px;font-weight:700;margin-top:2px}.offer-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:8px 0}.offer{border:1px solid #e2e8f0;border-radius:6px;padding:10px}.offer .title{font-size:9px;text-transform:uppercase;color:#64748b;letter-spacing:0.06em}.offer .price{font-size:16px;font-weight:700;margin:4px 0}.stress-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:11px;padding:4px 0;border-bottom:1px solid #e2e8f0}.footer{margin-top:24px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center}@media print{body{padding:16px}}</style></head><body><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div><h1 style="font-size:20px">DealScout Report</h1><p style="color:#64748b;font-size:11px">${name||'Business Analysis'} &mdash; ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p></div><div style="background:${C.green};color:${C.navy};padding:4px 10px;border-radius:4px;font-size:10px;font-weight:700">DS</div></div><div class="verdict" style="background:${analysis.color}">${analysis.verdict} &mdash; ${analysis.passCount}/4</div><div class="grid3"><div class="metric"><div class="label">Asking</div><div class="val">${fmt(askP)}</div></div><div class="metric"><div class="label">SDE</div><div class="val">${fmt(sde)}</div></div><div class="metric"><div class="label">Mo. Cash</div><div class="val" style="color:${moCash>=20000?C.green:'#0f172a'}">${fmt(Math.round(moCash))}</div></div></div>${ind&&ind.range?`<p style="font-size:11px;color:${C.blue};margin-bottom:12px">Industry: ${ind.label} | Typical: ${ind.range[0]}x\u2013${ind.range[1]}x (this: ${fmtX(askP/sde)})</p>`:''}<h2>Rules</h2><table>${Object.values(analysis.rules).map(ruleR).join('')}</table><h2>Loan</h2><table>${line('Down',fmt(Math.round(loan.dp)))}${line('SBA Loan',fmt(Math.round(loan.sbaLoan)))}${data.snAmt>0?line('Seller Note',fmt(Math.round(data.snAmt))):''}${line('Mo. SBA',fmt(Math.round(loan.mp)))}${data.snAmt>0?line('Mo. Seller Note',fmt(Math.round(snInfo.mp))):''}${line('Annual DS',fmt(Math.round(totalAnnDS)))}${line('DSCR',fmtX(sde/totalAnnDS))}</table><h2>Valuation Methods</h2><table>${offers.methods.map(m=>`<tr><td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #e2e8f0"><span style="color:${m===offers.recommended?C.green:C.g500};font-weight:700">${m===offers.recommended?'\u2713':m.id}</span> ${m.label} (${m.sublabel})</td><td style="padding:5px 8px;text-align:right;font-weight:600;font-size:11px;border-bottom:1px solid #e2e8f0">${fmt(Math.round(m.price))}</td></tr>`).join('')}</table>${offers.verification?`<div style="background:#f1f5f9;border-radius:6px;padding:12px;margin:8px 0"><div style="font-size:9px;text-transform:uppercase;color:#64748b;letter-spacing:0.06em">Recommended Offer</div><div style="font-size:20px;font-weight:700;margin:4px 0">${fmt(Math.round(offers.verification.price))}</div><div style="font-size:10px;color:#64748b">DSCR: ${fmtX(offers.verification.dscr)} | Monthly CF: ${fmt(Math.round(offers.verification.moCF))} | Multiple: ${fmtX(offers.verification.mult)}</div></div>`:''}<h2>Stress Test</h2><div class="stress-row" style="font-weight:600;color:#64748b;border-bottom:2px solid #cbd5e1"><div>Scenario</div><div>SDE</div><div>DSCR</div><div>Mo. Cash</div></div>${stressRows.map(s=>`<div class="stress-row"><div>${s.label}</div><div>${fmt(s.adjSDE)}</div><div style="color:${s.dscr>=1.5?C.green:s.dscr>=1.0?C.amber:C.red};font-weight:600">${fmtX(s.dscr)}</div><div style="color:${s.moCash>=0?C.green:C.red}">${fmt(Math.round(s.moCash))}</div></div>`).join('')}<h2>Due Diligence</h2><div style="columns:2;font-size:11px;line-height:1.8">${['3yr tax returns','12mo bank statements','Add-back docs','Customer concentration','Lease terms','Employee roster','Licenses/permits','AR & AP reports'].map(x=>`<div>\u25a1 ${x}</div>`).join('')}</div><div class="footer">DealScout &mdash; Not financial advice.</div></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `DealScout_${(name||"Analysis").replace(/[^a-zA-Z0-9]/g,"_")}_${new Date().toISOString().slice(0,10)}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── UI Components ──
function InputField({ label, prefix, value, onChange, help, numeric = true, tid }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.g500, marginBottom: 4, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {tid ? <Tip id={tid}>{label}</Tip> : label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: C.g50, border: `1px solid ${C.g100}`, borderRadius: 6, overflow: "hidden", transition: "border-color 0.15s" }}>
        {prefix && <span style={{ padding: "8px 0 8px 12px", color: C.g400, fontFamily: mono, fontSize: 14 }}>{prefix}</span>}
        <input type="text" value={value} onChange={(e) => onChange(numeric ? e.target.value.replace(/[^0-9.]/g, "") : e.target.value)} placeholder={numeric ? "0" : ""} style={{ flex: 1, border: "none", background: "transparent", padding: "10px 12px 10px 4px", fontSize: 16, fontFamily: body, fontWeight: 500, color: C.g900, outline: "none" }} />
      </div>
      {help && <p style={{ fontSize: 11, color: C.g400, margin: "4px 0 0" }}>{help}</p>}
    </div>
  );
}

function RuleCard({ rule, i, benchRange, askSdeMult }) {
  const isMult = rule.tid === "noiMult";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0", borderBottom: i < 3 ? `1px solid ${C.g100}` : "none" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, background: rule.pass ? C.greenBg : C.redBg, color: rule.pass ? C.greenDark : C.red, fontSize: 14, fontWeight: 700 }}>
        {rule.pass ? "\u2713" : "\u2717"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tip id={rule.tid} style={{ fontSize: 14, fontWeight: 600, color: C.g900, fontFamily: heading }}>{rule.label}</Tip>
          <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 500, color: rule.pass ? C.greenDark : C.red }}>{rule.display}</span>
        </div>
        <p style={{ fontSize: 12, color: C.g500, margin: "2px 0 0" }}>{rule.detail}</p>
        {isMult && benchRange && (
          <p style={{ fontSize: 11, color: C.blue, margin: "4px 0 0", fontStyle: "italic" }}>
            Industry benchmark: {benchRange[0]}x&ndash;{benchRange[1]}x SDE. This deal is {askSdeMult < benchRange[0] ? "below" : askSdeMult > benchRange[1] ? "above" : "within"} the typical range.
          </p>
        )}
      </div>
    </div>
  );
}

const PRESETS = ["Owner salary above market","Owner vehicle / auto","Owner health insurance","Owner meals / entertainment","Owner travel (personal)","One-time legal / professional fees","Depreciation / amortization","Interest expense","Rent above market (owner-related)","Family member salary (non-working)"];

function RecastSection({ items, setItems }) {
  const upd = (i, f, v) => { const c = [...items]; c[i] = { ...c[i], [f]: v }; setItems(c); };
  const used = new Set(items.map((x) => x.label));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Tip id="addBacks" style={{ margin: 0, fontSize: 12, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em", color: C.g500, fontWeight: 600 }}>SDE add-backs</Tip>
        <button onClick={() => setItems([...items, { label: "", amount: "" }])} style={{ background: C.navy, color: C.offWhite, border: "none", borderRadius: 4, padding: "5px 12px", fontSize: 12, fontFamily: heading, fontWeight: 600, cursor: "pointer" }}>+ custom</button>
      </div>
      <div style={{ padding: 12, background: C.g50, borderRadius: 6, marginBottom: 10, border: `1px solid ${C.g100}` }}>
        <p style={{ fontSize: 12, color: C.g500, margin: "0 0 8px" }}>Common add-backs (click to add):</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {PRESETS.map((p) => {
            const on = used.has(p);
            return <button key={p} onClick={() => !on && setItems([...items, { label: p, amount: "" }])} disabled={on} style={{ background: on ? C.g200 : C.blueBg, color: on ? C.g400 : C.blue, border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 11, cursor: on ? "default" : "pointer", fontFamily: body, fontWeight: 500, opacity: on ? 0.6 : 1, textDecoration: on ? "line-through" : "none" }}>{on ? "\u2713 " : ""}{p}</button>;
          })}
        </div>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <input value={item.label} onChange={(e) => upd(i, "label", e.target.value)} placeholder="Description" style={{ flex: 2, padding: "7px 10px", border: `1px solid ${C.g100}`, borderRadius: 4, fontSize: 13, fontFamily: body, background: C.g50, color: C.g900, outline: "none" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: C.g50, border: `1px solid ${C.g100}`, borderRadius: 4 }}>
            <span style={{ padding: "0 0 0 8px", color: C.g400, fontSize: 13 }}>$</span>
            <input value={item.amount} onChange={(e) => upd(i, "amount", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" style={{ flex: 1, padding: "7px 8px 7px 4px", border: "none", background: "transparent", fontSize: 13, fontFamily: mono, color: C.g900, outline: "none" }} />
          </div>
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: C.g400, cursor: "pointer", fontSize: 16, padding: "4px", lineHeight: 1 }}>{"\u00d7"}</button>
        </div>
      ))}
    </div>
  );
}

function OfferCard({ title, price, askP, sde, annDS, color, borderColor, tid, reasoning, badge }) {
  const net = (sde - annDS) / 12;
  const disc = 1 - price / askP;
  return (
    <div style={{ flex: 1, minWidth: 175, background: C.white, border: `2px solid ${borderColor}`, borderRadius: 10, padding: "18px 16px", position: "relative" }}>
      {badge && <span style={{ position: "absolute", top: -10, left: 16, background: borderColor, color: C.white, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, fontFamily: heading }}>{badge}</span>}
      <Tip id={tid} style={{ fontSize: 11, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em", color: C.g500, fontWeight: 600 }}>{title}</Tip>
      <p style={{ fontSize: 24, fontWeight: 800, fontFamily: heading, color, margin: "6px 0 4px", letterSpacing: "-0.03em" }}>{fmt(price)}</p>
      {disc > 0 ? <p style={{ fontSize: 11, color: C.g500, margin: "0 0 2px" }}>{fmtPct(disc)} below asking</p> : <p style={{ fontSize: 11, color: C.green, margin: "0 0 2px", fontWeight: 500 }}>At asking price</p>}
      <p style={{ fontSize: 11, color: C.greenDark, margin: "0 0 10px", fontWeight: 500 }}>{fmt(Math.round(net))}/mo cash flow</p>
      <div style={{ borderTop: `1px solid ${C.g100}`, paddingTop: 10 }}>
        <p style={{ fontSize: 12, color: C.g600, lineHeight: 1.5, margin: 0 }}>{reasoning}</p>
      </div>
    </div>
  );
}

function StressTest({ sde, totalAnnDS, rev }) {
  const costBase = rev - sde;
  const rows = [0, 0.1, 0.2, 0.3].map((drop) => {
    const adjRev = rev * (1 - drop); const adjSDE = adjRev - costBase;
    return { label: drop === 0 ? "Base case" : `Revenue \u2212${Math.round(drop * 100)}%`, adjSDE, dscr: adjSDE / totalAnnDS, moCash: (adjSDE - totalAnnDS) / 12 };
  });
  return (
    <div style={{ background: C.white, borderRadius: 10, padding: 24, marginBottom: 16, border: `1px solid ${C.g100}` }}>
      <h3 style={{ fontSize: 12, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em", color: C.g500, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        <Tip id="stressTest">Sensitivity stress test</Tip>
      </h3>
      <p style={{ fontSize: 12, color: C.g500, margin: "0 0 14px" }}>What if revenue drops? Assumes expenses stay constant.</p>
      <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr", gap: 4, fontSize: 12, minWidth: 400 }}>
        {["Scenario", "Adj. SDE", "DSCR", "Mo. Cash"].map((h, i) => (
          <div key={h} style={{ fontWeight: 700, fontFamily: heading, color: C.g500, padding: "6px 0", borderBottom: `2px solid ${C.g200}`, textAlign: i > 0 ? "right" : "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
        ))}
        {rows.map((r, i) => {
          const dc = r.dscr >= 1.5 ? C.greenDark : r.dscr >= 1.0 ? C.amber : C.red;
          const cc = r.moCash >= 0 ? (r.moCash >= 10000 ? C.greenDark : C.amber) : C.red;
          return [
            <div key={`l${i}`} style={{ padding: "8px 0", borderBottom: `1px solid ${C.g100}`, fontWeight: i === 0 ? 600 : 400, fontFamily: body }}>{r.label}</div>,
            <div key={`s${i}`} style={{ padding: "8px 0", borderBottom: `1px solid ${C.g100}`, textAlign: "right", fontFamily: mono, fontSize: 12 }}>{fmt(Math.round(r.adjSDE))}</div>,
            <div key={`d${i}`} style={{ padding: "8px 0", borderBottom: `1px solid ${C.g100}`, textAlign: "right", fontFamily: mono, fontWeight: 600, color: dc }}>{fmtX(r.dscr)}</div>,
            <div key={`c${i}`} style={{ padding: "8px 0", borderBottom: `1px solid ${C.g100}`, textAlign: "right", fontFamily: mono, fontWeight: 500, color: cc }}>{fmt(Math.round(r.moCash))}</div>,
          ];
        })}
      </div>
      </div>
      {rows[3].dscr < 1.0 && <div style={{ marginTop: 12, padding: "10px 14px", background: C.redBg, borderRadius: 6, fontSize: 12, color: C.red }}><strong>Warning:</strong> 30% revenue decline pushes DSCR below 1.0x. Consider a lower offer or seller financing.</div>}
      {rows[3].dscr >= 1.0 && rows[3].dscr < 1.5 && <div style={{ marginTop: 12, padding: "10px 14px", background: C.amberBg, borderRadius: 6, fontSize: 12, color: C.amber }}><strong>Caution:</strong> 30% revenue decline drops DSCR below 1.5x. Ensure you have cash reserves.</div>}
      {rows[3].dscr >= 1.5 && <div style={{ marginTop: 12, padding: "10px 14px", background: C.greenBg, borderRadius: 6, fontSize: 12, color: C.greenDark }}><strong>Strong:</strong> Even with 30% revenue decline, DSCR stays above 1.5x. Excellent downside protection.</div>}
    </div>
  );
}

// ── Main ──
function DealScoutApp({ prefill, onPrefillConsumed, onSwitchTab, embedded }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(""); const [ask, setAsk] = useState(""); const [rev, setRev] = useState("");
  const [net, setNet] = useState(""); const [own, setOwn] = useState(""); const [abs, setAbs] = useState([]);
  const [rate, setRate] = useState("10.5"); const [term, setTerm] = useState("10"); const [down, setDown] = useState("10");
  const [industry, setIndustry] = useState("");
  const [snOn, setSnOn] = useState(false); const [snAmt, setSnAmt] = useState(""); const [snRate, setSnRate] = useState("6");
  const [snTermY, setSnTermY] = useState("5"); const [snStandstill, setSnStandstill] = useState("12");
  const [targetCF, setTargetCF] = useState("20000");
  const [disclaimed, setDisclaimed] = useState(false);
  const [saved, setSaved] = useState(false);

  // Handle prefill from CIM Analyzer or Pipeline
  useEffect(() => {
    if (prefill) {
      if (prefill.name) setName(prefill.name);
      if (prefill.askingPrice) setAsk(prefill.askingPrice);
      if (prefill.annualRevenue) setRev(prefill.annualRevenue);
      if (prefill.netIncome) setNet(prefill.netIncome);
      if (prefill.ownerSalary) setOwn(prefill.ownerSalary);
      if (prefill.addBacks && prefill.addBacks.length > 0) {
        setAbs(prefill.addBacks.map((ab) => ({ label: ab.label, amount: ab.amount || "0" })));
      }
      if (prefill.industry) setIndustry(prefill.industry);
      setStep(0);
      setDisclaimed(true);
      setSaved(false);
      if (onPrefillConsumed) onPrefillConsumed();
    }
  }, [prefill]);

  const pAsk = parseFloat(ask) || 0; const pRev = parseFloat(rev) || 0;
  const sde = (parseFloat(net) || 0) + (parseFloat(own) || 0) + abs.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
  const r = parseFloat(rate) / 100; const t = parseInt(term) || 10; const d = parseFloat(down) / 100;
  const pSnAmt = snOn ? (parseFloat(snAmt) || 0) : 0;
  const snR = parseFloat(snRate) / 100; const snT = parseInt(snTermY) || 5; const snS = parseInt(snStandstill) || 0;

  const loan = useMemo(() => pAsk > 0 ? calcLoan(pAsk, r, t, d, pSnAmt) : null, [pAsk, r, t, d, pSnAmt]);
  const snInfo = useMemo(() => pSnAmt > 0 ? calcSellerNote(pSnAmt, snR, snT) : { mp: 0, annDS: 0 }, [pSnAmt, snR, snT]);
  const totalAnnDS = loan ? loan.sbaAnnDS + snInfo.annDS : 0;
  const analysis = useMemo(() => (pAsk > 0 && pRev > 0 && sde > 0) ? analyzeRules({ askingPrice: pAsk, annualRevenue: pRev, sde, debtService: totalAnnDS }) : null, [pAsk, pRev, sde, totalAnnDS]);
  const offers = useMemo(() => {
    if (sde <= 0 || pAsk <= 0 || pRev <= 0) return null;
    const targetMult = 3.5;
    const targetMoCF = parseFloat(targetCF) || 20000;
    const revCap = 0.6;
    const minMargin = 0.15;

    // Method A: Revenue Cap (max 60% of revenue)
    const methodA = pRev * revCap;

    // Method B: Fair multiple × SDE
    const methodB = sde * targetMult;

    // Method C: Max price for target monthly cash flow
    // Work backward: targetAnnualCF = targetMoCF * 12, maxAnnDS = sde - targetAnnualCF
    // Then convert maxAnnDS to max loan, then max price
    const targetAnnCF = targetMoCF * 12;
    let methodC = null;
    if (sde > targetAnnCF) {
      const maxAnnDS = sde - targetAnnCF;
      // Convert max annual DS to max loan amount
      const mr = r / 12; const nm = t * 12;
      const maxLoan = mr > 0 ? maxAnnDS / 12 * (1 - Math.pow(1 + mr, -nm)) / mr : maxAnnDS * t;
      methodC = maxLoan / (1 - d);
    }

    // Method D: Owner earnings = 15% of revenue (with SBA financing)
    // At this price, owner must earn at least 15% of revenue after debt service
    // sde - annDS >= minMargin * pRev => annDS <= sde - minMargin * pRev
    const maxAnnDS_D = sde - (minMargin * pRev);
    let methodD = null;
    if (maxAnnDS_D > 0) {
      const mr = r / 12; const nm = t * 12;
      const maxLoan = mr > 0 ? maxAnnDS_D / 12 * (1 - Math.pow(1 + mr, -nm)) / mr : maxAnnDS_D * t;
      methodD = maxLoan / (1 - d);
    }

    // Collect valid methods
    const methods = [
      { id: "A", label: "Revenue Cap", sublabel: "Max 60% of revenue", price: methodA, reasoning: `Never pay more than 60% of the revenue you'll generate. At ${fmt(pRev)} revenue, ceiling is ${fmt(methodA)}.` },
      { id: "B", label: "Fair Multiple", sublabel: `${targetMult}x SDE`, price: methodB, reasoning: `At ${fmtX(targetMult)} multiple on ${fmt(sde)} SDE. Most service businesses trade at 2.0\u20133.5x.` },
      { id: "C", label: "Cash Flow Target", sublabel: `${fmt(targetMoCF)}/mo goal`, price: methodC, reasoning: methodC ? `Max price to net ${fmt(targetMoCF)}/mo after SBA debt service.` : "SDE too low for this cash flow target." },
      { id: "D", label: "Owner Margin", sublabel: "Min 15% of revenue", price: methodD, reasoning: methodD ? `Max price where owner still earns 15%+ of revenue after debt.` : "SDE too low relative to revenue for this margin." },
    ].filter(m => m.price != null && m.price > 0);

    // Sort by price ascending
    methods.sort((a, b) => a.price - b.price);

    // Recommended = lowest (most conservative)
    const recommended = methods[0];

    // Calculate verification metrics at recommended price
    let verification = null;
    if (recommended) {
      const recPrice = recommended.price;
      const recDP = recPrice * d;
      const recLoan = recPrice * (1 - d);
      const mr = r / 12; const nm = t * 12;
      const recMP = mr > 0 ? recLoan * mr / (1 - Math.pow(1 + mr, -nm)) : recLoan / nm;
      const recAnnDS = recMP * 12;
      const recMoCF = (sde - recAnnDS) / 12;
      const recDSCR = recAnnDS > 0 ? sde / recAnnDS : 0;
      const recMult = recPrice / sde;
      const recPriceRev = recPrice / pRev;
      verification = { price: recPrice, dp: recDP, loan: recLoan, mp: recMP, annDS: recAnnDS, moCF: recMoCF, dscr: recDSCR, mult: recMult, priceRev: recPriceRev };
    }

    // Discount from asking
    const discFromAsking = recommended ? 1 - recommended.price / pAsk : 0;

    return { methods, recommended, verification, discFromAsking, askingTooHigh: recommended && recommended.price < pAsk };
  }, [sde, pAsk, pRev, r, t, d, targetCF]);

  const moCash = totalAnnDS > 0 && sde > 0 ? (sde - totalAnnDS) / 12 : null;
  const canGo = pAsk > 0 && pRev > 0 && sde > 0;
  const ind = INDUSTRIES[industry]; const askSdeMult = pAsk > 0 && sde > 0 ? pAsk / sde : 0;

  const stressRows = useMemo(() => {
    if (sde <= 0 || pRev <= 0 || totalAnnDS <= 0) return [];
    const costBase = pRev - sde;
    return [0, 0.1, 0.2, 0.3].map((drop) => {
      const adj = pRev * (1 - drop) - costBase;
      return { label: drop === 0 ? "Base case" : `Revenue \u2212${Math.round(drop * 100)}%`, adjSDE: adj, dscr: adj / totalAnnDS, moCash: (adj - totalAnnDS) / 12 };
    });
  }, [sde, pRev, totalAnnDS]);

  const handleExport = () => {
    if (!analysis || !loan || !offers) return;
    generatePDF({ name, askP: pAsk, rev: pRev, sde, analysis, loan, snInfo, snAmt: pSnAmt, totalAnnDS, offers, moCash, industry, stressRows });
  };

  // Card and section styles
  const card = { background: C.white, borderRadius: 10, padding: 24, marginBottom: 16, border: `1px solid ${C.g100}` };
  const sectionH = { fontSize: 12, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em", color: C.g400, marginTop: 0, marginBottom: 16, fontWeight: 700 };

  return (
    <div style={{ fontFamily: body, color: C.g900, minHeight: embedded ? "auto" : "100vh", background: C.offWhite }}>
      <style>{`@import url('${FONTS_URL}'); input::placeholder { color: ${C.g400}; } select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }`}</style>

      {/* Header - only show in standalone mode */}
      {!embedded && (
      <div style={{ background: C.navy, padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.green, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.navy, fontFamily: heading, fontSize: 12, fontWeight: 800 }}>DS</span>
            </div>
            <span style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>DealScout</span>
            <span style={{ fontSize: 10, fontFamily: heading, background: "rgba(16,185,129,0.15)", color: C.green, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>v1.0</span>
          </div>
          <p style={{ fontSize: 12, color: C.g400 }}>
            Hover <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: "50%", padding: "1px 5px", fontSize: 10, fontWeight: 700 }}>?</span> for explanations
          </p>
        </div>
      </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: embedded ? "0" : "0 24px 48px" }}>
        {/* ── INPUT ── */}
        {step === 0 && (
          <div>
            <div style={card}>
              <h3 style={sectionH}>{"01 \u2014 Deal basics"}</h3>
              <InputField label="Business name" value={name} onChange={setName} numeric={false} tid="businessName" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <InputField label="Asking price" prefix="$" value={ask} onChange={setAsk} tid="askingPrice" />
                <InputField label="Annual revenue" prefix="$" value={rev} onChange={setRev} tid="annualRevenue" />
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.g500, marginBottom: 4, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <Tip id="industry">Business type</Tip>
                </label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ width: "100%", padding: "10px 32px 10px 12px", background: C.g50, border: `1px solid ${C.g100}`, borderRadius: 6, fontSize: 14, fontFamily: body, color: industry ? C.g900 : C.g400, outline: "none", cursor: "pointer" }}>
                  {Object.entries(INDUSTRIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                {ind && ind.range && <p style={{ fontSize: 11, color: C.blue, margin: "4px 0 0" }}>Typical SDE multiple: {ind.range[0]}x&ndash;{ind.range[1]}x. {ind.note}</p>}
              </div>
            </div>

            <div style={card}>
              <h3 style={sectionH}><Tip id="sde">{"02 \u2014 SDE recast"}</Tip></h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <InputField label="Net income (from P&L)" prefix="$" value={net} onChange={setNet} tid="netIncome" />
                <InputField label="Owner salary / draws" prefix="$" value={own} onChange={setOwn} tid="ownerSalary" />
              </div>
              <RecastSection items={abs} setItems={setAbs} />
              {sde > 0 && (
                <div style={{ marginTop: 16, padding: "12px 16px", background: C.navy, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Tip id="sde" style={{ fontSize: 12, fontFamily: heading, color: C.g400, fontWeight: 600 }}>CALCULATED SDE</Tip>
                  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: heading, color: C.green, letterSpacing: "-0.02em" }}>{fmt(sde)}</span>
                </div>
              )}
            </div>

            <div style={card}>
              <h3 style={sectionH}>{"03 \u2014 SBA 7(a) loan terms"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                <InputField label="Interest rate" prefix="%" value={rate} onChange={setRate} help="Current ~10-11%" tid="sbaRate" />
                <InputField label="Term (years)" value={term} onChange={setTerm} help="Max 10yr" tid="sbaTerm" />
                <InputField label="Down payment" prefix="%" value={down} onChange={setDown} help="Min 10%" tid="sbaDown" />
              </div>
              <div style={{ marginTop: 8, padding: "14px 16px", background: snOn ? C.blueBg : C.g50, borderRadius: 8, border: `1px solid ${snOn ? "#93bbf3" : C.g100}`, transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setSnOn(!snOn)}>
                  <Tip id="sellerNote" style={{ fontSize: 13, fontWeight: 600, fontFamily: heading }}>Include seller financing</Tip>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: snOn ? C.blue : C.g200, padding: 2, cursor: "pointer", transition: "background 0.2s" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", transform: snOn ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
                  </div>
                </div>
                {snOn && (
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <InputField label="Note amount" prefix="$" value={snAmt} onChange={setSnAmt} help={pAsk > 0 ? `${fmtPct(pSnAmt / pAsk)} of asking` : ""} tid="snAmount" />
                    <InputField label="Note rate" prefix="%" value={snRate} onChange={setSnRate} help="Typically 5-8%" tid="snRate" />
                    <InputField label="Term (years)" value={snTermY} onChange={setSnTermY} help="Usually 3-5 years" tid="snTerm" />
                    <InputField label="Standstill (months)" value={snStandstill} onChange={setSnStandstill} help="Deferred payments" tid="snStandstill" />
                  </div>
                )}
              </div>
            </div>

            {/* Your Goals */}
            <div style={card}>
              <h3 style={sectionH}>{"04 \u2014 Your goals"}</h3>
              <InputField label="Target monthly cash flow" prefix="$" value={targetCF} onChange={setTargetCF} help="How much you need to take home monthly after debt service" tid="targetCF" />
            </div>

            <button onClick={() => { if (canGo) { if (disclaimed) setStep(1); else setStep(0.5); } }} disabled={!canGo} style={{ width: "100%", padding: 14, background: canGo ? C.green : C.g200, color: canGo ? C.navy : C.g400, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, fontFamily: heading, cursor: canGo ? "pointer" : "not-allowed", letterSpacing: "-0.01em", transition: "all 0.15s" }}>
              {"Run Deal Analysis \u2192"}
            </button>
          </div>
        )}

        {/* ── DISCLAIMER ── */}
        {step === 0.5 && (
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.amberBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{"\u26A0"}</div>
              <h3 style={{ fontFamily: heading, fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Important Disclaimer</h3>
            </div>
            <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 14 }}><strong style={{ color: C.g900 }}>DealScout is an informational tool only.</strong> By proceeding, you acknowledge:</p>
              <div style={{ background: C.g50, borderRadius: 8, padding: "16px 18px", marginBottom: 16, border: `1px solid ${C.g100}` }}>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: C.g900 }}>1. Not Professional Advice.</strong> The analysis and output do not constitute financial, legal, tax, investment, or business advice.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: C.g900 }}>2. Estimates Only.</strong> All calculations use simplified models and may not reflect the full complexity of any transaction.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: C.g900 }}>3. Consult Professionals.</strong> Always consult a licensed CPA, attorney, lender, and broker before making financial decisions.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: C.g900 }}>4. No Liability.</strong> DealScout assumes no responsibility for losses resulting from decisions made using this tool.</p>
                <p style={{ margin: 0 }}><strong style={{ color: C.g900 }}>5. No Guarantee.</strong> We make no warranty that calculations or recommendations are error-free or suitable for your situation.</p>
              </div>
              <p style={{ fontSize: 12, color: C.g400 }}>Full Terms of Service and Privacy Policy available on our website.</p>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: 14, background: "transparent", color: C.g700, border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: body, cursor: "pointer" }}>{"\u2190 Go Back"}</button>
              <button onClick={() => { setDisclaimed(true); setStep(1); }} style={{ flex: 2, padding: 14, background: C.navy, color: C.offWhite, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}>{"I Understand \u2014 Show Results \u2192"}</button>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === 1 && analysis && (
          <div>
            {/* Verdict */}
            <div style={{ background: C.navy, borderRadius: 10, padding: "28px 24px", marginBottom: 16, borderLeft: `4px solid ${analysis.color}` }}>
              <p style={{ fontSize: 11, fontFamily: heading, color: C.g400, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{name || "Deal"} {"\u2014"} Verdict</p>
              <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: heading, color: analysis.color, margin: "0 0 8px", letterSpacing: "-0.03em" }}>{analysis.verdict}</h2>
              <p style={{ fontSize: 14, color: C.g400, margin: 0 }}>
                {analysis.passCount}/4 rules passed {"\u2014"} {analysis.passCount >= 3 ? "This deal has strong fundamentals" : analysis.passCount >= 2 ? "Some metrics need negotiation" : "This deal doesn\u2019t meet acquisition criteria"}
              </p>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { l: "Asking Price", v: fmt(pAsk), tid: "askingPrice" },
                { l: "Recast SDE", v: fmt(sde), tid: "sde" },
                { l: "Mo. Cash Flow", v: fmt(Math.round(moCash)), hl: moCash >= 20000, tid: "moCash" },
              ].map((m) => (
                <div key={m.l} style={{ background: C.white, borderRadius: 8, padding: 16, border: `1px solid ${C.g100}`, textAlign: "center" }}>
                  <Tip id={m.tid} style={{ fontSize: 10, fontFamily: heading, color: C.g400, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{m.l}</Tip>
                  <p style={{ fontSize: 22, fontWeight: 800, fontFamily: heading, margin: "4px 0 0", color: m.hl ? C.green : C.g900, letterSpacing: "-0.03em" }}>{m.v}</p>
                </div>
              ))}
            </div>

            {/* Rules */}
            <div style={card}>
              <h3 style={sectionH}><Tip id="verdict">Valuation rules analysis</Tip></h3>
              {Object.values(analysis.rules).map((rule, i) => <RuleCard key={i} rule={rule} i={i} benchRange={ind ? ind.range : null} askSdeMult={askSdeMult} />)}
            </div>

            {/* Loan */}
            {loan && (
              <div style={card}>
                <h3 style={sectionH}>{pSnAmt > 0 ? "SBA 7(a) + Seller Note" : "SBA 7(a) Loan Breakdown"}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  {[
                    { l: "Down Payment", v: fmt(Math.round(loan.dp)), tid: "dp" },
                    { l: "SBA Loan", v: fmt(Math.round(loan.sbaLoan)), tid: "loan" },
                    ...(pSnAmt > 0 ? [{ l: "Seller Note", v: fmt(Math.round(pSnAmt)), tid: "sellerNote" }] : []),
                    { l: "Monthly SBA", v: fmt(Math.round(loan.mp)), tid: "mo" },
                    ...(pSnAmt > 0 ? [{ l: `Seller Note/mo${snS > 0 ? ` (starts mo. ${snS})` : ""}`, v: fmt(Math.round(snInfo.mp)), tid: "snAmount" }] : []),
                    { l: "Total Annual DS", v: fmt(Math.round(totalAnnDS)), tid: "annDS" },
                    { l: "DSCR", v: fmtX(sde / totalAnnDS), tid: "dscrCalc" },
                    { l: "Total SBA Interest", v: fmt(Math.round(loan.totInt)), tid: "totInt" },
                  ].map((x) => (
                    <div key={x.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.g100}` }}>
                      <Tip id={x.tid} style={{ fontSize: 13, color: C.g500 }}>{x.l}</Tip>
                      <span style={{ fontSize: 13, fontFamily: mono, fontWeight: 500, color: C.g900 }}>{x.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Valuation & Offer Strategy */}
            {offers && offers.methods.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ background: C.navy, borderRadius: 10, padding: "20px 20px 16px" }}>
                  <h3 style={{ fontSize: 12, fontFamily: heading, textTransform: "uppercase", letterSpacing: "0.06em", color: C.green, marginTop: 0, marginBottom: 4, fontWeight: 700 }}>Recommended offer strategy</h3>

                  {/* Valuation methods table */}
                  <p style={{ fontSize: 12, color: C.g400, margin: "0 0 16px" }}>Four valuation methods applied. Recommended offer = most conservative price.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                    {offers.methods.map((m, i) => {
                      const isRec = i === 0;
                      const disc = 1 - m.price / pAsk;
                      return (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: isRec ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", borderRadius: 8, border: isRec ? `1.5px solid ${C.green}` : "1.5px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ minWidth: 28, textAlign: "center" }}>
                            {isRec ? (
                              <span style={{ fontSize: 11, fontWeight: 800, color: C.navy, background: C.green, padding: "2px 8px", borderRadius: 10, fontFamily: heading }}>{"\u2713"}</span>
                            ) : (
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.g400, fontFamily: heading }}>{m.id}</span>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: isRec ? C.green : C.g200, fontFamily: heading }}>{m.label} <span style={{ fontWeight: 400, fontSize: 11, color: C.g400 }}>({m.sublabel})</span></div>
                            <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>{m.reasoning}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: heading, color: isRec ? C.green : C.g200 }}>{fmt(Math.round(m.price))}</div>
                            <div style={{ fontSize: 10, color: disc > 0 ? C.green : C.red }}>{disc > 0 ? fmtPct(disc) + " below" : fmtPct(Math.abs(disc)) + " above"} asking</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommended offer summary */}
                  {offers.verification && (
                    <div style={{ background: "rgba(16,185,129,0.08)", borderRadius: 8, padding: "16px 18px", border: `1px solid rgba(16,185,129,0.2)` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.green, marginBottom: 2 }}>Recommended Offer</div>
                          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: heading, color: C.white, letterSpacing: "-0.03em" }}>{fmt(Math.round(offers.verification.price))}</div>
                          {offers.askingTooHigh && (
                            <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginTop: 2 }}>
                              {fmtPct(offers.discFromAsking)} below the asking price of {fmt(pAsk)}
                            </div>
                          )}
                        </div>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: heading, fontSize: 18, fontWeight: 800, color: C.green }}>
                          {fmtX(offers.verification.dscr).replace("x","")}x
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                        {[
                          { l: "Down Payment", v: fmt(Math.round(offers.verification.dp)) },
                          { l: "SBA Loan", v: fmt(Math.round(offers.verification.loan)) },
                          { l: "Monthly Payment", v: fmt(Math.round(offers.verification.mp)) },
                          { l: "Monthly Cash Flow", v: fmt(Math.round(offers.verification.moCF)), hl: true },
                          { l: "DSCR", v: fmtX(offers.verification.dscr) },
                          { l: "SDE Multiple", v: fmtX(offers.verification.mult) },
                          { l: "Price/Revenue", v: fmtPct(offers.verification.priceRev) },
                          { l: "CF as % of Revenue", v: fmtPct((offers.verification.moCF * 12) / pRev) },
                        ].map((m) => (
                          <div key={m.l} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 6 }}>
                            <div style={{ fontSize: 9, color: C.g400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{m.l}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: heading, color: m.hl ? C.green : C.g200 }}>{m.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stress Test */}
            {stressRows.length > 0 && <StressTest sde={sde} totalAnnDS={totalAnnDS} rev={pRev} />}

            {/* DD */}
            <div style={card}>
              <h3 style={sectionH}>{"Next steps \u2014 due diligence"}</h3>
              {["Request 3 years of tax returns to verify revenue","Request 12 months of bank statements to cross-check deposits","Confirm all add-backs with documentation","Verify customer concentration \u2014 any single customer >20%?","Confirm lease terms, assignment clause, and remaining duration","Request employee roster with roles, tenure, and compensation","Confirm all licenses, permits, and certifications are transferable","Request aged accounts receivable and accounts payable reports"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0" }}>
                  <div style={{ width: 16, height: 16, border: `1.5px solid ${C.g200}`, borderRadius: 3, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: C.g600, lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, minWidth: 120, padding: 14, background: "transparent", color: C.g700, border: `1.5px solid ${C.g200}`, borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: body, cursor: "pointer" }}>{"\u2190 Edit Inputs"}</button>
              <button onClick={handleExport} style={{ flex: 1, minWidth: 120, padding: 14, background: C.blue, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}>{"\u2193 Download Report"}</button>
              <button onClick={() => {
                saveDealToPipeline({
                  name, askingPrice: pAsk, annualRevenue: pRev, sde, netIncome: parseFloat(net) || 0, ownerSalary: parseFloat(own) || 0,
                  addBacks: abs, industry,
                  priceToRevenue: pAsk > 0 && pRev > 0 ? pAsk / pRev : null,
                  sdeMultiple: pAsk > 0 && sde > 0 ? pAsk / sde : null,
                  sdeMargin: sde > 0 && pRev > 0 ? sde / pRev : null,
                  dscr: sde > 0 && totalAnnDS > 0 ? sde / totalAnnDS : null,
                  monthlyCashFlow: moCash,
                  rulesPass: analysis ? analysis.passCount : 0,
                });
                setSaved(true);
              }} style={{ flex: 1, minWidth: 120, padding: 14, background: saved ? C.greenBg : C.green, color: saved ? C.greenDark : C.navy, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: heading, cursor: saved ? "default" : "pointer" }}>
                {saved ? "\u2713 Saved to Pipeline" : "\uD83D\uDCCB Save to Pipeline"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button onClick={() => { setStep(0); setName(""); setAsk(""); setRev(""); setNet(""); setOwn(""); setAbs([]); setIndustry(""); setSnOn(false); setSnAmt(""); setTargetCF("20000"); setSaved(false); }} style={{ flex: 1, padding: 14, background: C.navy, color: C.offWhite, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: heading, cursor: "pointer" }}>New Deal</button>
              {onSwitchTab && <button onClick={() => onSwitchTab("pipeline")} style={{ flex: 1, padding: 14, background: "transparent", color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: heading, cursor: "pointer" }}>View Pipeline {"\u2192"}</button>}
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: C.g400, marginTop: 32, fontFamily: heading, fontWeight: 400 }}>
          {"DealScout v1.0 \u2014 Built for searchers, by AI. Not financial advice."}
        </p>
      </div>
    </div>
  );
}

export default function DealScout({ prefill, onPrefillConsumed, onSwitchTab, embedded }) {
  return <TipProvider><DealScoutApp prefill={prefill} onPrefillConsumed={onPrefillConsumed} onSwitchTab={onSwitchTab} embedded={embedded} /></TipProvider>;
}
