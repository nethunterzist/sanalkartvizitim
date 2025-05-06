/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // SWC derleyici sorununu çözmek için
  swcMinify: false,
  experimental: {
    swcPlugins: []
  },
  // Standalone modu için output yapılandırması
  output: 'standalone',
  // QR rotası yönlendirmesi için
  async redirects() {
    return [
      {
        source: '/:slug/qr',
        destination: '/api/qr-codes/:slug',
        permanent: true,
      },
    ]
  },
  // VCF dosyalarının doğru MIME tipi ile sunulması için
  async headers() {
    return [
      {
        source: '/:path*.vcf',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/vcard',
          },
          {
            key: 'Content-Disposition',
            value: 'attachment',
          }
        ],
      },
    ]
  }
};

module.exports = nextConfig; 