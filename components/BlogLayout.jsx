import Link from "next/link";

export default function BlogLayout({ title, date, readTime, keyword, children }) {
  const heading = "'Bricolage Grotesque', sans-serif";
  const body = "'Outfit', sans-serif";

  return (
    <div style={{ fontFamily: body, color: "#0f172a", background: "#fff", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ background: "#0a1628", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", height: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, background: "#10b981", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: heading, fontSize: 12, fontWeight: 800, color: "#0a1628" }}>DS</div>
            <span style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>DealScout</span>
          </Link>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/blog" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textDecoration: "none" }}>Blog</Link>
            <Link href="/analyze" style={{ background: "#10b981", color: "#0a1628", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: heading, textDecoration: "none" }}>Try Free</Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/blog" style={{ fontSize: 13, color: "#1a56db", textDecoration: "none", fontWeight: 500 }}>&larr; Back to Blog</Link>
        </div>
        <h1 style={{ fontFamily: heading, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16, color: "#0f172a" }}>{title}</h1>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b", marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
          <span>{date}</span>
          <span>&middot;</span>
          <span>{readTime} min read</span>
        </div>
        <div className="article-content" style={{ fontSize: 16, lineHeight: 1.75, color: "#334155" }}>
          {children}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, padding: "32px", background: "#0a1628", borderRadius: 12, textAlign: "center" }}>
          <h3 style={{ fontFamily: heading, fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>Stop using spreadsheets.</h3>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>DealScout automates this entire analysis in 60 seconds.</p>
          <Link href="/analyze" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#0a1628", padding: "12px 24px", borderRadius: 6, fontSize: 15, fontWeight: 700, fontFamily: heading, textDecoration: "none" }}>Try DealScout Free &rarr;</Link>
        </div>

        {/* Disclaimer */}
        <p style={{ marginTop: 32, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          DealScout is an informational tool, not financial advice. Always consult qualified professionals before making acquisition decisions.
        </p>
      </article>
    </div>
  );
}
