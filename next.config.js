/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // standalone-сборка нужна для лёгкого Docker-образа (см. docker/Dockerfile)
  output: "standalone",
  images: {
    remotePatterns: [
      // Локальные изображения из /public работают без настройки.
      // Здесь — домены будущего S3/CDN, если подключим позже.
      { protocol: "https", hostname: "**.render.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
