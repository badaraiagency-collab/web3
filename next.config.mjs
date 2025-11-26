/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // You can remove this too, no longer needed
  },
  trailingSlash: false,
  poweredByHeader: false,
  // Ensure static assets are served correctly on App Engine
  assetPrefix: "",
};

export default nextConfig;
