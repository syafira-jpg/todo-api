const todoService = require('../services/todo.service');

// Controller untuk mengambil semua data (dengan Query Params)
const getTodos = async (req, res) => {
  try {
    const result = await todoService.getAllTodos(req.query);
    res.status(200).json({
      status: 'success',
      data: result.todos,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

// Controller untuk membuat data baru
const createTodo = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const todoData = {
      ...req.body,
      user: userId,
    };

    const todo = await todoService.createTodo(todoData, userId);
    res.status(201).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Controller untuk mengambil data berdasarkan ID
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

// Controller untuk memperbarui data
const updateTodo = async (req, res) => {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }
    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Controller untuk menghapus data
const deleteTodo = async (req, res) => {
  try {
    const todo = await todoService.deleteTodo(req.params.id);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }
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