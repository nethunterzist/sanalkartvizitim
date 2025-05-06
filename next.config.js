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