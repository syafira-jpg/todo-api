const todoService = require('../services/todo.service');
const ActivityLog = require('../models/activityLog.model');

// Controller untuk mengambil semua data (dengan Query Params yang bersih)
const getTodos = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const filter = { user: userId, archived: false };
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const todos = await todoService.getAllTodosFiltered(filter, skip, limit);
    
    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

// Controller untuk membuat data baru (Sudah otomatis mencatat Activity Log)
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

    const todo = await todoService.createTodo(todoData);

    // --- PENCATATAN ACTIVITY LOG OTOMATIS ---
    await ActivityLog.create({
      user: userId,
      action: 'CREATE',
      description: `Menambahkan todo baru: ${todo.title || 'Tanpa Judul'}`
    });
    // ----------------------------------------

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

// Controller untuk memperbarui data (Sudah otomatis mencatat Activity Log)
const updateTodo = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const updateData = {
      ...req.body,
      updated_by: userId,
    };

    const todo = await todoService.updateTodo(req.params.id, updateData);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }

    // --- PENCATATAN ACTIVITY LOG OTOMATIS ---
    await ActivityLog.create({
      user: userId,
      action: 'UPDATE',
      description: `Memperbarui todo ID: ${req.params.id}`
    });
    // ----------------------------------------

    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Controller untuk menghapus data (Sudah otomatis mencatat Activity Log)
const deleteTodo = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const todo = await todoService.deleteTodo(req.params.id);
    if (!todo) {
      return res.status(404).json({ status: 'fail', message: 'Todo tidak ditemukan' });
    }

    // --- PENCATATAN ACTIVITY LOG OTOMATIS ---
    await ActivityLog.create({
      user: userId,
      action: 'DELETE',
      description: `Menghapus todo ID: ${req.params.id}`
    });
    // ----------------------------------------

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