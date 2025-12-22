/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  allowedDevOrigins: [
    'http://localhost:5174',
    'http://10.14.96.199:5174', // your current LAN IP
  ],

  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
