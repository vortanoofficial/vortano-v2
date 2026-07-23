import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo, Share_Tech_Mono } from "next/font/google";
import { Web3Provider } from "@/components/Web3Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-robotic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Vortano · The on-chain intelligence economy — decentralized GPU + NPU compute on Robinhood Chain",
  description:
    "A Robinhood Chain-native compute layer that turns idle GPU & NPU capacity into a permissionless supercomputer for the AI age. Run inference, train models, deploy autonomous agents — settled trustlessly in USDG on Robinhood Chain.",
  keywords: [
    "Vortano",
    "Robinhood Chain",
    "decentralized compute",
    "GPU marketplace",
    "NPU",
    "on-chain AI",
    "VRTN",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Vortano · The engine of the on-chain intelligence economy",
    description:
      "Decentralized GPU + NPU compute, autonomous agents, settled trustlessly on Robinhood Chain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${shareTechMono.variable} antialiased`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
