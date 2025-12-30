import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // 🦾 프론트엔드에서 /api/login 으로 요청을 보내면
        source: '/back/:path*',
        // 🦾 실제로는 백엔드 주소인 이쪽으로 몰래 전달한다!
        destination: 'http://10.125.121.186:8080/:path*',
      },
    ];
  },
};



export default nextConfig;
