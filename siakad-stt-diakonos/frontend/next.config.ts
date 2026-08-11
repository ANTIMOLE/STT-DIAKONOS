// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//    output: 'standalone',
// };

// export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: 'export',  // ← GANTI dari 'standalone' jadi 'export'
//   images: {
//     unoptimized: true  // ← TAMBAHKAN ini
//   }
//   // config lain tetap
// };

// export default nextConfig;

// frontend/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  
  
  // Compress responses
  compress: true,
  
  // Production optimizations
  reactStrictMode: true,
  
  // Image optimization (disable if Plesk limited)
  images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '',
      pathname: '/**',
    },
  ],
  // unoptimized: true, if needed
},
  
  // Rewrites untuk API (development only)
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;