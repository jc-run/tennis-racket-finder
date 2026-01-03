import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 외부 이미지 호스트 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        // placeholder 이미지용 (개발/테스트)
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        // Supabase Storage 이미지용
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        // Cloudflare R2 Storage 이미지용
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
        // Cloudflare R2 Public URL 이미지용
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
        // Cloudflare CDN 이미지용
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        // AWS S3 이미지용 (선택)
      },
    ],
    // 이미지 최적화 설정
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
