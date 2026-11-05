const express = require('express');
const connectDB = require('./src/config/db');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server minimalis berjalan dengan normal!',
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;