import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/components/DashboardProvider";
import { TabNav } from "@/components/TabNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Life, in view",
  description: "A personal life dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} antialiased min-h-screen`}>
        <DashboardProvider>
          <TabNav />
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </DashboardProvider>
      </body>
    </html>
  );
}
