const Todo = require('../models/todo.model');
const Category = require('../models/category.model');
const ActivityLog = require('../models/activityLog.model');
const AppError = require('../utils/appError');

// Fungsi helper untuk mencatat log aktivitas
const recordActivity = async (userId, action, description, snapshot = null) => {
  try {
    if (userId) {
      await ActivityLog.create({
        user: userId,
        action,
        description,
        snapshot,
      });
    }
  } catch (error) {
    console.error('Gagal mencatat activity log:', error.message);
  }
};

// Mengambil semua todo milik user dengan Filtering, Search, Sorting, & Pagination
const getAllTodos = async (userId, queryParams = {}) => {
  const { search, completed, isCompleted, sortBy, order, page = 1, limit = 10 } = queryParams;

  // Filter berdasarkan user yang sedang login
  let query = { archived: false };
  if (userId) {
    query.user = userId;
  }

  // Filter pencarian berdasarkan judul
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Filter status selesai (memeriksa parameter completed atau isCompleted, diselaraskan ke field 'completed')
  const statusFilter = completed !== undefined ? completed : isCompleted;
  if (statusFilter !== undefined) {
    query.completed = statusFilter === 'true' || statusFilter === true;
  }

  // Filter kategori jika ada
  if (queryParams.category) {
    query.category = queryParams.category;
  }

  // Sorting
  let sortOption = {};
  const sortField = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'].includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;
  sortOption[sortField] = sortOrder;

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const data = await Todo.find(query)
    .populate('user', 'name email')
    .populate('category', 'name')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const total = await Todo.countDocuments(query);

  return {
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

// Membuat todo baru + Catat Log
const createTodo = async (data, userId) => {
  if (typeof data === 'object' && !data.user && userId) {
    data.user = userId;
    data.created_by = userId;
  }

  // Validasi Category ID: pastikan kategori terdaftar di database
  if (data.category) {
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new AppError('Kategori tidak ditemukan atau ID kategori tidak valid!', 400);
    }
  }

  const newTodo = await Todo.create(data);
  
  // Catat Activity Log dengan Snapshot
  await recordActivity(
    data.user || userId, 
    'CREATE_TODO', 
    `Membuat todo baru: "${newTodo.title}"`,
    {
      id: newTodo._id,
      title: newTodo.title,
      description: newTodo.description,
      completed: newTodo.completed,
      category: newTodo.category
    }
  );

  return newTodo;
};

// Mengambil todo berdasarkan ID
const getTodoById = async (id) => {
  return await Todo.findById(id)
    .populate('user', 'name email')
    .populate('category', 'name');
};

// Memperbarui todo berdasarkan ID + Catat Log
const updateTodo = async (id, data, userId = null) => {
  if (userId) {
    data.updated_by = userId;
  }

  // Validasi Category ID jika dikirim saat update
  if (data.category) {
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new AppError('Kategori tidak ditemukan atau ID kategori tidak valid!', 400);
    }
  }

  const updatedTodo = await Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  
  if (updatedTodo) {
    // Catat Activity Log dengan Snapshot
    await recordActivity(
      updatedTodo.user, 
      'UPDATE_TODO', 
      `Memperbarui todo: "${updatedTodo.title}"`,
      {
        id: updatedTodo._id,
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
        category: updatedTodo.category
      }
    );
  }

  return updatedTodo;
};

// Menghapus todo berdasarkan ID + Catat Log
const deleteTodo = async (id) => {
  // Ambil data dulu untuk snapshot sebelum dihapus
  const todoBeforeDelete = await Todo.findById(id);

  const deletedTodo = await Todo.findByIdAndDelete(id);
  
  if (deletedTodo) {
    // Catat Activity Log dengan Snapshot
    await recordActivity(
      deletedTodo.user, 
      'DELETE_TODO', 
      `Menghapus todo: "${deletedTodo.title}"`,
      todoBeforeDelete ? {
        id: todoBeforeDelete._id,
        title: todoBeforeDelete.title,
        description: todoBeforeDelete.description,
        completed: todoBeforeDelete.completed,
        category: todoBeforeDelete.category
      } : { id }
    );
  }

  return deletedTodo;
};

module.exports = {
  getAllTodos,
  getAllTodosFiltered: getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  recordActivity,
};