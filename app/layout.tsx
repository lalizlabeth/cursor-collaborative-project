import type { Metadata } from "next";
import { Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prototyping with Cursor: Community garden",
  description: "A collection of apps created in 10 mins",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Prototyping with Cursor: Community garden",
    description: "A collection of apps created in 10 mins",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prototyping with Cursor: Community garden",
    description: "A collection of apps created in 10 mins",
    images: ["/og-image.jpg"],
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
