import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Configure rewrites to proxy API requests to the Express backend
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    return [
      // Proxy backend API routes (excluding Next.js API routes)
      {
        source: '/backend-api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      // Proxy health check endpoint
      {
        source: '/backend-health',
        destination: `${backendUrl}/health`,
      },
    ];
  },
  
  // Allow images from external sources if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
