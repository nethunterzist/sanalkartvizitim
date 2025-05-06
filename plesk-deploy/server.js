const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Ortam değişkeni kontrolü, default olarak production
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

// Next.js uygulamasını oluştur
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // URL'yi analiz et
      const parsedUrl = parse(req.url, true);
      
      // Next.js request handler'a yönlendir
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Sunucu hatası:', err);
      res.statusCode = 500;
      res.end('Sunucu hatası');
    }
  })
  .once('error', (err) => {
    console.error('Sunucu başlatılırken hata oluştu:', err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(`> Sunucu hazır: http://${hostname}:${port}`);
  });
}); 