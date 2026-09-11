import type { Metadata } from "next";
import { Public_Sans, Special_Elite } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-stamp",
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
      <body className={`${publicSans.variable} ${specialElite.variable}`}>
        {children}
      </body>
    </html>
  );
}
