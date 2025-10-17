/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 SSR 모드 (로컬 개발용)
  // output: 'export' - 정적 export는 build:export 스크립트에서만 사용
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // SSR에서는 이미지 최적화 활성화
    formats: ['image/webp', 'image/avif'], // 최신 이미지 포맷 지원
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // 반응형 이미지 크기
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 작은 이미지 크기
  },
  // 프로덕션 최적화
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'], // 패키지 임포트 최적화
  },
}

export default nextConfig
