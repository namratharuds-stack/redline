import type { Metadata } from "next";
import { Source_Serif_4, Work_Sans } from "next/font/google";
import "./globals.css";

// The whole app's two type families: Work Sans for UI chrome and reading
// copy, Source Serif 4 wherever an actual document's text is rendered.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-manuscript",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Redline — know what you're signing",
  description:
    "Upload a contract, lease, or freelance agreement. Redline flags the risky clauses, quotes the exact sentence each one came from, and drafts a counter-offer for each.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sourceSerif.variable} ${workSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
