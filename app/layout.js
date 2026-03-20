import "./globals.css";

export const metadata = {
  title: "DealScout \u2014 AI Deal Analyzer for Small Business Buyers",
  description:
    "Analyze any small business acquisition in 60 seconds. SDE recast, SBA loan modeling, 4-rule valuation scoring, stress testing, and offer strategy.",
  metadataBase: new URL("https://dealscout.so"),
  openGraph: {
    title: "DealScout \u2014 AI Deal Analyzer for Small Business Buyers",
    description:
      "Analyze any small business acquisition in 60 seconds. SDE recast, SBA loan modeling, valuation scoring, and offer strategy.",
    url: "https://dealscout.so",
    siteName: "DealScout",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DealScout \u2014 AI Deal Analyzer",
    description:
      "Analyze any small business acquisition in 60 seconds.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
