const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db');

// Import Routers
const todoRoutes = require('./src/routes/todo.routes');
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const statsRoutes = require('./src/routes/stats.routes');
const activityLogRoutes = require('./src/routes/activityLog.routes');

// Import Middlewares
const { logger, notFound, globalErrorHandler } = require('./src/middlewares/error.middleware');

const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Connect Database
connectDB();

// Konfigurasi Swagger Spec lengkap dengan components.schemas
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
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan token JWT kamu di sini (tanpa kata Bearer)',
        },
      },
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
            user: { type: 'string' },
            category: { type: 'string' },
            created_by: { type: 'string' },
            updated_by: { type: 'string' },
            archived: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            user: { type: 'string' },
            created_by: { type: 'string' },
            updated_by: { type: 'string' },
            archived: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ActivityLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            action: { type: 'string' },
            description: { type: 'string' },
            snapshot: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: [
    path.join(process.cwd(), 'src/routes/*.js'),
    path.join(__dirname, 'src/routes/*.js')
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(logger);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Todo List Management is running successfully!',
    documentation: '/api-docs'
  });
});

// Endpoint Swagger JSON Data
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// Halaman Swagger UI
app.get('/api-docs', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>API Todos List Management - Swagger UI</title>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          window.ui = SwaggerUIBundle({
            url: "/api-docs/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(globalErrorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;