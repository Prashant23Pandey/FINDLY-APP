import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FINDLY | NIET",
  description: "Gotta find 'em all! The official NIET gamified lost and found.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fredoka.variable,
          nunito.variable
        )}
      >
        <div className="particle-container">
          {/* We'll add a particle component here later */}
        </div>
        <AuthProvider>
          <main className="relative z-10">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
