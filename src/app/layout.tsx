import type { Metadata } from "next";
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
    title: "Sistema de Suporte",
    description: "Plataforma de gestão de registos de suporte",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-200 to-gray-100 text-gray-900`}
        >
        <div className="min-h-screen flex flex-col items-center justify-start p-6">
            <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-8 border border-gray-300 overflow-hidden">
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}




