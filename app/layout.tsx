import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from "@/components/BottomNav";
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
  title: "Mearns CC Agent",
  description:
    "Mearns Cricket Club match summary publisher — post to Facebook, Instagram & Twitter in seconds.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/club-logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/club-logo.jpg", type: "image/jpeg" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mearns CC",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    title: "Mearns CC Agent",
    description: "Cricket match social media publisher for Mearns Cricket Club",
  },
};

export const viewport: Viewport = {
  themeColor: "#080f2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full bg-[#080f2e] text-white flex flex-col pb-16">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
