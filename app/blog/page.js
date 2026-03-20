import Link from "next/link";

export const metadata = {
  title: "Blog \u2014 DealScout",
  description: "Expert guides on small business acquisition analysis, SDE calculation, SBA loan modeling, valuation multiples, and due diligence.",
};

const articles = [
  { slug: "how-to-analyze-a-business-for-sale", title: "How to Analyze a Business for Sale: The Complete Framework", desc: "The step-by-step framework experienced acquisition entrepreneurs use to evaluate any small business.", read: 8, date: "Mar 16, 2026" },
  { slug: "seller-discretionary-earnings-calculator", title: "What Is Seller\u2019s Discretionary Earnings (SDE)? Complete Guide", desc: "SDE is the #1 valuation metric for small businesses. Learn how to calculate it correctly and avoid costly mistakes.", read: 7, date: "Mar 16, 2026" },
  { slug: "dscr-calculator-sba-7a-loan", title: "DSCR Calculator for SBA 7(a) Loans: The Complete Guide", desc: "Your SBA lender won\u2019t approve your deal without strong DSCR. Here\u2019s how to calculate and improve it.", read: 7, date: "Mar 16, 2026" },
  { slug: "what-is-a-good-sde-multiple", title: "What Is a Good SDE Multiple to Pay for a Small Business?", desc: "SDE multiples vary dramatically by industry. Here\u2019s the benchmark data for 13 sectors.", read: 6, date: "Mar 16, 2026" },
  { slug: "business-acquisition-due-diligence-checklist", title: "Business Acquisition Due Diligence Checklist: 25 Items", desc: "The comprehensive checklist experienced acquirers use between LOI and close.", read: 8, date: "Mar 16, 2026" },
  { slug: "how-to-evaluate-a-small-business-to-buy", title: "How to Evaluate a Small Business to Buy: A Decision Framework", desc: "A three-phase framework to go from initial listing to final go/no-go efficiently.", read: 7, date: "Mar 16, 2026" },
  { slug: "sba-loan-calculator-business-acquisition", title: "SBA Loan Calculator for Business Acquisitions", desc: "Model your exact SBA 7(a) deal terms \u2014 monthly payment, total interest, and DSCR.", read: 6, date: "Mar 16, 2026" },
  { slug: "is-this-business-worth-buying", title: "Is This Business Worth Buying? 7 Questions Before You Offer", desc: "Seven questions to answer confidently before writing an LOI.", read: 5, date: "Mar 16, 2026" },
  { slug: "fedex-route-valuation", title: "FedEx Route Valuation: How to Analyze ISP Routes", desc: "FedEx ISP routes are popular but misunderstood. Here\u2019s how to value them correctly.", read: 6, date: "Mar 16, 2026" },
  { slug: "laundromat-valuation-multiple", title: "Laundromat Valuation: SDE Multiples and Deal Structure", desc: "The classic semi-absentee acquisition \u2014 how to verify revenue and avoid the equipment trap.", read: 6, date: "Mar 16, 2026" },
];

const heading = "'Bricolage Grotesque', sans-serif";
const body = "'Outfit', sans-serif";

export default function BlogIndex() {
  return (
    <div style={{ fontFamily: body, color: "#0f172a", background: "#fff", minHeight: "100vh" }}>
      <nav style={{ background: "#0a1628", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", height: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, background: "#10b981", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: heading, fontSize: 12, fontWeight: 800, color: "#0a1628" }}>DS</div>
            <span style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>DealScout</span>
          </Link>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/blog" style={{ fontSize: 13, color: "#fff", fontWeight: 500, textDecoration: "none" }}>Blog</Link>
            <Link href="/analyze" style={{ background: "#10b981", color: "#0a1628", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: heading, textDecoration: "none" }}>Try Free</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ fontFamily: heading, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a56db", marginBottom: 12 }}>DealScout Blog</div>
        <h1 style={{ fontFamily: heading, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>Learn to analyze deals<br />like a pro.</h1>
        <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, marginBottom: 48, lineHeight: 1.6 }}>Expert guides on SDE calculation, SBA loan modeling, valuation multiples, due diligence, and negotiation strategy.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {articles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "24px 28px", transition: "all 0.15s", cursor: "pointer" }}>
                <h2 style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6, color: "#0f172a" }}>{a.title}</h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, marginBottom: 8 }}>{a.desc}</p>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#94a3b8" }}>
                  <span>{a.date}</span>
                  <span>&middot;</span>
                  <span>{a.read} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer style={{ padding: 28, textAlign: "center", fontSize: 12, color: "#94a3b8", background: "#0f172a" }}>
        <p>&copy; 2026 DealScout. Not financial advice.</p>
      </footer>
    </div>
  );
}
