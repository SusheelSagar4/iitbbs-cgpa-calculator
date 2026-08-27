import type { Metadata } from "next";
import localFont from "next/font/local";
import { Oswald, DotGothic16 } from "next/font/google";
import VisitTracker from "@/components/VisitTracker";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});
const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "IIT Bhubaneswar CGPA Calculator & Academic Tracker",
  description: "Interactive 8-semester CGPA/SGPA predictor and curriculum tracker for IIT Bhubaneswar B.Tech students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dotGothic.variable} ${oswald.variable} antialiased`}
      >
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}


