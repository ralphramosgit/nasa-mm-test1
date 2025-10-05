import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asteroid Impact Simulator",
  description: "Interactive 3D asteroid impact simulator with ML-powered predictions using NASA NEO and USGS data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
