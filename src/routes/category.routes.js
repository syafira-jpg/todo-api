const express = require('express');
const router = express.Router();

// Contoh endpoint Kategori (GET, POST, PUT, DELETE)
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all categories endpoint',
    data: []
  });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: { name }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    message: `Category with id ${id} updated successfully`
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    message: `Category with id ${id} deleted successfully`
  });
});

module.exports = router;