import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs"; 

export const metadata: Metadata = {
  title: "Vidora",
  description: "Nnaedozie dennis movie website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {" "}
      <html lang="en">
        <body className="bg-slate-950 text-gray-200 overflow-x-hidden font-sans">
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="w-full">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}


