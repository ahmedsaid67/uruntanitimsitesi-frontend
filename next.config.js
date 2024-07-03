const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['127.0.0.1','http://api.asdyazilim.com/','https://api.asdyazilim.com/'], // Protokol ve sondaki eğik çizgi olmadan
  },
}

module.exports = nextConfig;
