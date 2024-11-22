/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'images.remotePatterns', 'firebasestorage.googleapis.com'],
  },
};
module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};
module.exports = nextConfig;
