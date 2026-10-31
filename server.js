const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todo.routes');
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const statsRoutes = require('./src/routes/stats.routes');
const activityLogRoutes = require('./src/routes/activityLog.routes');
const { logger, notFound, globalErrorHandler } = require('./src/middlewares/error.middleware');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

connectDB();

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
  apis: [
    path.join(__dirname, 'src', 'routes', 'auth.routes.js'),
    path.join(__dirname, 'src', 'routes', 'todo.routes.js'),
    path.join(__dirname, 'src', 'routes', 'category.routes.js'),
    path.join(__dirname, 'src', 'routes', 'stats.routes.js'),
    path.join(__dirname, 'src', 'routes', 'activityLog.routes.js'),
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Todo List Management is running successfully!',
    documentation: '/api-docs'
  });
});

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

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/activity-logs', activityLogRoutes);

app.use(notFound);
app.use(globalErrorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;