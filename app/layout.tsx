import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Movie Insight Builder",
  description: "Discover AI-powered insights for any movie. Enter an IMDb ID to get movie details, cast information, reviews, and AI-generated sentiment analysis.",
  keywords: ["movie", "imdb", "ai", "sentiment analysis", "movie insights", "reviews"],
  authors: [{ name: "Movie Insight Builder" }],
  openGraph: {
    title: "AI Movie Insight Builder",
    description: "Discover AI-powered insights for any movie",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
