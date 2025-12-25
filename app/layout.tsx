import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Attendance",
  description: "Next.js + Prisma dashboard for teachers and students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 text-slate-900">
          <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-lg border-b border-slate-300 shadow-md">
            <div className="mx-auto max-w-[1500px] flex justify-between items-center px-6 py-4">
              <h1 className="text-2xl font-black bg-gradient-to-r from-black to-blue-700 bg-clip-text text-transparent">
                Attendance
              </h1>
              <nav className="flex gap-6 font-bold text-sm">
                <a href="/" className="hover:text-blue-700 transition">Overview</a>
                <a href="/teachers" className="hover:text-blue-700 transition">Teachers</a>
                <a href="/students" className="hover:text-blue-700 transition">Students</a>
                <a href="/attendance" className="hover:text-blue-700 transition">Attendance</a>
              </nav>
            </div>
          </header>

          <div className="pt-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
