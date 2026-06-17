import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { BottomNav } from "@/components/bottom-nav";
import { FloatingButtons } from "@/components/floating-buttons";
import { CartDrawer } from "@/components/cart-drawer";
import { AuthDrawer } from "@/components/auth-drawer";
import { ProgressBarProvider } from "@/components/progress-bar-provider";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
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
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ProgressBarProvider>
          <AuthProvider>
            <AnnouncementBar />
            <Navbar />
            {/* pb-16 md:pb-0 leaves room for the fixed bottom nav on mobile */}
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            {/* Spacer so footer content isn't hidden behind the fixed bottom nav */}
            <div className="h-16 md:hidden" aria-hidden />
            <CartDrawer />
            <AuthDrawer />
            <FloatingButtons />
            <BottomNav />
            <Toaster position="bottom-center" containerStyle={{ bottom: "72px" }} />
          </AuthProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
