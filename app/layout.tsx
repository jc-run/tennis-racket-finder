import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tennis Racket Finder | 테니스 라켓 검색 & 커뮤니티",
    template: "%s | Tennis Racket Finder",
  },
  description: "테니스 라켓의 상세 스펙을 검색하고, 사용자 리뷰와 댓글을 통해 정보를 공유할 수 있는 커뮤니티 플랫폼",
  keywords: ["테니스", "라켓", "검색", "리뷰", "커뮤니티", "테니스 라켓 추천"],
  authors: [{ name: "Tennis Racket Finder" }],
  creator: "Tennis Racket Finder",
  publisher: "Tennis Racket Finder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "Tennis Racket Finder | 테니스 라켓 검색 & 커뮤니티",
    description: "테니스 라켓의 상세 스펙을 검색하고, 사용자 리뷰와 댓글을 통해 정보를 공유할 수 있는 커뮤니티 플랫폼",
    siteName: "Tennis Racket Finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tennis Racket Finder | 테니스 라켓 검색 & 커뮤니티",
    description: "테니스 라켓의 상세 스펙을 검색하고, 사용자 리뷰와 댓글을 통해 정보를 공유할 수 있는 커뮤니티 플랫폼",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
