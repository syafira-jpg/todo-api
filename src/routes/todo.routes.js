const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const protect = require('../middlewares/auth.middleware');
const {
  createTodoValidation,
  updateTodoValidation,
} = require('../middlewares/todo.validator');

// Proteksi token JWT
router.use(protect);

// Route API Todo
router.get('/', todoController.getTodos);
router.post('/', createTodoValidation, todoController.createTodo);

router.get('/:id', todoController.getTodoById);
router.put('/:id', updateTodoValidation, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;