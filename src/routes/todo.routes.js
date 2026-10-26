const express = require('express');
const todoController = require('../controllers/todo.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // Pastikan auth middleware diikutsertakan jika dibutuhkan

const router = express.Router();

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the logged-in user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos retrieved successfully
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new todo item
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Bad request
 */
router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update an existing todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;