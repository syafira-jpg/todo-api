const express = require('express');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todo.routes');
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const statsRoutes = require('./src/routes/stats.routes');
const activityLogRoutes = require('./src/routes/activityLog.routes');
const { logger, notFound, globalErrorHandler } = require('./src/middlewares/error.middleware');

// Tambahan Modul Swagger untuk Dokumentasi API
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// PANGGIL KONEKSI DATABASE DI LUAR
// (Supaya Vercel Serverless Function selalu terhubung ke MongoDB Atlas)
connectDB();

// Konfigurasi Swagger UI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Todos List Management',
      version: '1.0.0',
      description: 'Dokumentasi REST API Todos List Management (Gamelab Project)',
    },
    servers: [
      {
        url: 'https://todo-api-seven-ashen.vercel.app',
        description: 'Server Vercel Production',
      },
      {
        url: 'http://localhost:5000',
        description: 'Server Lokal',
      },
    ],
  },
  // Daftarkan path file route secara eksplisit agar aman di Vercel
  apis: [
    './src/routes/auth.routes.js',
    './src/routes/todo.routes.js',
    './src/routes/category.routes.js',
    './src/routes/stats.routes.js',
    './src/routes/activityLog.routes.js',
    './server.js'
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middlewares Utama
app.use(express.json());
app.use(logger);

// Route Halaman Utama (Root)
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Todo List Management is running successfully!',
    documentation: '/api-docs'
  });
});

// Route Dokumentasi Swagger menggunakan CDN agar TIDAK BLANK/PUTIH di Vercel
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js',
    ],
  })
);

// Routes API Utama
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error Handling
app.use(notFound);
app.use(globalErrorHandler);

// Hanya jalankan listener PORT jika dijalankan secara lokal (node server.js)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi Swagger dapat diakses di http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;