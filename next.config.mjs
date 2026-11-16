/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  webpack: (config, { dev }) => {
    // Disable aggressive file system caching in dev mode to avoid OneDrive file-lock conflicts
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

