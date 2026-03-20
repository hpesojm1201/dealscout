import BlogLayout from "../../../components/BlogLayout";

export const metadata = { title: "How to Analyze a Business for Sale: Complete Framework \u2014 DealScout", description: "The step-by-step framework used by experienced acquisition entrepreneurs to evaluate any small business for sale." };

export default function Article() {
  const h2 = { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 40, marginBottom: 16, color: "#0f172a" };
  const h3 = { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, marginTop: 28, marginBottom: 12, color: "#0f172a" };
  const p = { marginBottom: 16 };
  const li = { marginBottom: 8 };

  return (
    <BlogLayout title="How to Analyze a Business for Sale: The Complete Framework for First-Time Buyers" date="Mar 16, 2026" readTime="8" keyword="how to analyze a business for sale">
      <p style={p}>You found a listing on BizBuySell. The revenue looks good, the asking price seems reasonable, and the broker says there&rsquo;s &ldquo;strong interest.&rdquo; But how do you actually know if this is a good deal?</p>
      <p style={p}>Most first-time business buyers make the same mistake: they start with the asking price and try to justify it. Smart buyers do the opposite. They start with the financials and work backward to determine what the business is actually worth.</p>

      <h2 style={h2}>Step 1: Get the Right Documents</h2>
      <p style={p}>Before you analyze anything, you need source documents &mdash; not broker summaries. Request three years of federal tax returns (the only financials that matter because the IRS imposes penalties for lying), twelve months of bank statements (to cross-check deposited revenue against reported revenue), a trailing 12-month P&amp;L statement, and the CIM or Offering Memorandum.</p>
      <p style={p}>If the seller won&rsquo;t provide tax returns or bank statements, walk away. There&rsquo;s nothing else to discuss.</p>

      <h2 style={h2}>Step 2: Recast the Financials (Calculate SDE)</h2>
      <p style={p}>The number on the P&amp;L labeled &ldquo;net income&rdquo; is almost never the true earning power of a small business. Owners routinely run personal expenses through the business &mdash; their car, health insurance, family vacations, meals, and sometimes even family members on the payroll who don&rsquo;t actually work.</p>
      <p style={p}>To find the real number, you calculate <strong>Seller&rsquo;s Discretionary Earnings (SDE)</strong>: Net Income + Owner&rsquo;s Salary + Add-Backs.</p>
      <p style={p}>Common add-backs include owner&rsquo;s above-market salary, personal vehicle expenses, owner health insurance, personal travel, one-time legal or professional fees, depreciation and amortization, and interest expense.</p>

      <h2 style={h2}>Step 3: Apply the Four Valuation Rules</h2>
      <p style={p}>Once you have a clean SDE number, run it through four time-tested rules:</p>
      <h3 style={h3}>Rule 1: Price-to-Revenue Ratio (max 60%)</h3>
      <p style={p}>Divide the asking price by annual revenue. If the result is above 60%, the seller is asking for too large a percentage of the revenue you&rsquo;ll generate.</p>
      <h3 style={h3}>Rule 2: Owner Earnings Percentage (min 15%)</h3>
      <p style={p}>Divide SDE by annual revenue. If the owner is earning less than 15% of revenue, the margins are too thin.</p>
      <h3 style={h3}>Rule 3: SDE Multiple (max 3.5x)</h3>
      <p style={p}>Divide the asking price by SDE. This tells you how many years of earnings you&rsquo;re paying for. Most small businesses trade between 2.0x and 3.5x SDE.</p>
      <h3 style={h3}>Rule 4: Debt Service Coverage Ratio (min 1.5x)</h3>
      <p style={p}>If you&rsquo;re financing with an SBA 7(a) loan, divide SDE by your annual loan payments. You need at least 1.5x coverage &mdash; meaning the business generates 50% more cash than your debt payments require.</p>

      <h2 style={h2}>Step 4: Model the Loan</h2>
      <p style={p}>Most searchers finance acquisitions with SBA 7(a) loans at 10-11% interest over 10 years with 10% down. Model the exact monthly payment and calculate your monthly take-home cash:</p>
      <p style={p}><strong>Monthly Cash Flow = (SDE - Annual Debt Service) / 12</strong></p>
      <p style={p}>If this number doesn&rsquo;t meet your minimum income requirement, no amount of &ldquo;growth potential&rdquo; makes up for it.</p>

      <h2 style={h2}>Step 5: Build Your Offer (Work Backward)</h2>
      <p style={p}>Don&rsquo;t start from the asking price. Start from your target cash flow and work backward: decide your minimum acceptable DSCR (1.5x recommended), calculate the maximum annual debt service, convert to the maximum loan amount, and add your down payment back to get the maximum purchase price.</p>

      <h2 style={h2}>Step 6: Stress Test the Deal</h2>
      <p style={p}>Ask yourself: what happens if revenue drops 20%? Run three scenarios &mdash; revenue down 10%, 20%, and 30%. If the business can survive a 20% decline and still make payments, you have a resilient acquisition.</p>

      <h2 style={h2}>Common Red Flags</h2>
      <p style={p}>Watch for revenue that can&rsquo;t be verified through bank statements, customer concentration above 20% in any single account, declining revenue over the trailing 12 months, add-backs that exceed 40% of net income, and a lease that expires within 2 years or isn&rsquo;t assignable.</p>
    </BlogLayout>
  );
}
