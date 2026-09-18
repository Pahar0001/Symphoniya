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
  // Удалённые разделы (статьи, ИИ-услуги, ИИ-визуализация) — чтобы старые ссылки
  // и индекс поисковиков не упирались в 404.
  async redirects() {
    return [
      { source: "/stati", destination: "/fasady", permanent: true },
      { source: "/stati/:slug*", destination: "/fasady", permanent: true },
      { source: "/uslugi", destination: "/kontakty", permanent: true },
      { source: "/visualizaciya/:id*", destination: "/", permanent: true },
      { source: "/raschet", destination: "/kontakty", permanent: true },
    ];
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
