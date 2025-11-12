import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./component/SessionWrapper";
import ConditionalNavbar from "./component/ConditionalNavbar";
import ConditionalNavbarHeader from "./component/ConditionalNavbarHeader";
import FormResponseToggle from "./component/FormResponseToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Datavine",
  description: "Generate your sharable form",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <div className="relative min-h-screen w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            <ConditionalNavbar />
            <ConditionalNavbarHeader />
            <FormResponseToggle />
            {children}
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
