import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stardance — Discover what's happening near you",
  description:
    "Discover, host and follow local sports events and tournaments with Stardance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
    >
      <body>
        <div className="stardance-page">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}