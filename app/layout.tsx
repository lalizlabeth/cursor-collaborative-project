import type { Metadata } from "next";
import { Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community garden",
  description: "A nostalgic desktop experience",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={splineMono.variable} style={{ fontFamily: 'var(--font-spline-mono), monospace' }}>
        {children}
      </body>
    </html>
  );
}
