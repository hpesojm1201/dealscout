import BlogLayout from "../../../components/BlogLayout";

export const metadata = { title: "Is This Business Worth Buying? 7 Questions Before You Offer \u2014 DealScout", description: "Seven questions to answer before writing an LOI." };

export default function Article() {
  return (
    <BlogLayout title="Is This Business Worth Buying? 7 Questions to Ask Before You Make an Offer" date="Mar 16, 2026" readTime="5" keyword="is this business worth buying">
      <p>You've found a business that looks promising on paper. Before you write an LOI, ask these seven questions.</p>
      <h2>1. Can the revenue be verified independently?</h2>
      <p>Tax returns and bank statements are the gold standard. Revenue that can't be verified doesn't exist.</p>
      <h2>2. What happens to revenue when the owner leaves?</h2>
      <p>If revenue depends on the owner's personal involvement, you're buying a job, not an asset.</p>
      <h2>3. Can you service the debt and still eat?</h2>
      <p>Calculate your monthly take-home after SBA loan payments. Don't count on "growth" to make the numbers work.</p>
      <h2>4. What's the worst-case scenario?</h2>
      <p>If revenue drops 20% and expenses stay flat, can you still make loan payments?</p>
      <h2>5. Why is the seller selling?</h2>
      <p>Retirement and health issues are legitimate. "Pursuing other opportunities" often means the business is declining.</p>
      <h2>6. Is the lease secure?</h2>
      <p>Minimum 5 years remaining, with an assignment clause, at reasonable market rent.</p>
      <h2>7. Would you pay cash for this business?</h2>
      <p>Remove the SBA loan from the equation. If the answer is no, the loan is just making a bad deal look affordable.</p>
    </BlogLayout>
  );
}
