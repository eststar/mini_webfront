import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // 프록시
        source: '/back/:path*',
        destination: 'http://10.125.121.186:8081/:path*',
      },
    ];
  },
  
};



export default nextConfig;
