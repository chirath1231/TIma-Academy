import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduCommerce | Tuition Classes",
  description: "E-commerce for educational tuition classes: browse courses, enroll, and checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="gradient-bg">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold gradient-text text-xl">Tima Academy</Link>
            <nav className="nav text-sm">
              <Link href="/courses">Courses</Link>
              <Link href="/about">About</Link>
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/cart">Wishlist</Link>

            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="gradient-bg">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm flex items-center justify-between">
            <p className="muted">© {new Date().getFullYear()} Tima Academy</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
