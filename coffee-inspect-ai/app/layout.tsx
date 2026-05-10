import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import Chatbot from "./components/Chatbot";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Coffee Inspect AI | Premium Grading System",
  description: "Sistem inspeksi kualitas kopi berbasis AI yang modern dan cerdas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable}`}>
      <body className="font-sans antialiased text-[#171717]">
        <ConvexClientProvider>
          {children}
          <Chatbot />
        </ConvexClientProvider>
      </body>
    </html>
  );
}