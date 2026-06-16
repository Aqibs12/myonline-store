import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { BottomNav } from "@/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export const metadata: Metadata = {
  title: STORE_NAME,
  description: `Shop the latest products at ${STORE_NAME}.`,
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
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <AnnouncementBar />
          <Navbar />
          {/* pb-16 md:pb-0 leaves room for the fixed bottom nav on mobile */}
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          {/* Spacer so footer content isn't hidden behind the fixed bottom nav */}
          <div className="h-16 md:hidden" aria-hidden />
          <BottomNav />
          <Toaster position="bottom-center" containerStyle={{ bottom: "72px" }} />
        </AuthProvider>
      </body>
    </html>
  );
}
