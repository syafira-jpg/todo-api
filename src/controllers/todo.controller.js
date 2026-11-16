const todoService = require('../services/todo.service');
const ActivityLog = require('../models/activityLog.model');

// Controller untuk mengambil semua data (dengan Metadata Pagination lengkap)
const getTodos = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const result = await todoService.getAllTodos(userId, req.query);
    
    res.status(200).json({
      status: 'success',
      results: result.data.length,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'fail', message: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized, user ID tidak ditemukan' });
    }

    const todoData = {
      ...req.body,
      user: userId,
      created_by: userId,
    };

    const todo = await todoService.createTodo(todoData, userId);

    await ActivityLog.create({
      user: userId,
      action: 'CREATE_TODO',
      snapshot: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        category: todo.category
      }
    });

    res.status(201).json({ status: 'success', data: todo });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: 'fail', message: error.message });
  }
};

const getTodoById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }
    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const updateData = {
      ...req.body,
      updated_by: userId,
    };

    const todo = await todoService.updateTodo(req.params.id, updateData, userId);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }

    await ActivityLog.create({
      user: userId,
      action: 'UPDATE_TODO',
      snapshot: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        category: todo.category
      }
    });

    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: 'fail', message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const todoBeforeDelete = await todoService.getTodoById(req.params.id);

    const todo = await todoService.deleteTodo(req.params.id);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }

    await ActivityLog.create({
      user: userId,
      action: 'DELETE_TODO',
      snapshot: todoBeforeDelete ? {
        id: todoBeforeDelete._id,
        title: todoBeforeDelete.title,
        description: todoBeforeDelete.description,
        completed: todoBeforeDelete.completed,
        category: todoBeforeDelete.category
      } : { id: req.params.id }
    });

    res.status(200).json({ status: 'success', message: 'Todo berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
};