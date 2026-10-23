const express = require('express');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todo.routes');
const authRoutes = require('./src/routes/auth.routes');
const activityLogRoutes = require('./src/routes/activityLog.routes');
const { logger, notFound, globalErrorHandler } = require('./src/middlewares/error.middleware');

// Tambahan Modul Swagger untuk Dokumentasi API
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

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
        url: 'http://localhost:5000',
        description: 'Server Lokal',
      },
    ],
  },
  apis: ['./src/routes/*.js', './server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middlewares Utama
app.use(express.json());
app.use(logger);

// Route Halaman Utama (Root) agar tidak blank saat dibuka di Vercel
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Todo List Management is running successfully!',
    documentation: '/api-docs'
  });
});

// Route Dokumentasi Swagger (Akses di browser: http://localhost:5000/api-docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes API Utama
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error Handling
app.use(notFound);
app.use(globalErrorHandler);

// Hanya jalankan listener & connect DB jika server dijalankan normal (bukan saat testing)
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi Swagger dapat diakses di http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;