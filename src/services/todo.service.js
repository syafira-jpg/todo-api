const Todo = require('../models/todo.model');
const ActivityLog = require('../models/activityLog.model');

// Fungsi helper untuk mencatat log aktivitas
const recordActivity = async (userId, action, description) => {
  try {
    if (userId) {
      await ActivityLog.create({
        user: userId,
        action,
        description,
      });
    }
  } catch (error) {
    console.error('Gagal mencatat activity log:', error.message);
  }
};

// Mengambil semua todo dengan Filtering, Search, Sorting, & Pagination
const getAllTodos = async (queryParams = {}) => {
  const { search, completed, sortBy, order, page = 1, limit = 10 } = queryParams;

  let query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (completed !== undefined) {
    query.completed = completed === 'true';
  }

  let sortOption = {};
  if (sortBy) {
    sortOption[sortBy] = order === 'desc' ? -1 : 1;
  } else {
    sortOption.createdAt = -1;
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const todos = await Todo.find(query)
    .populate('user', 'name email')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const totalData = await Todo.countDocuments(query);

  return {
    todos,
    pagination: {
      totalData,
      totalPages: Math.ceil(totalData / limitNum),
      currentPage: pageNum,
      limit: limitNum,
    },
  };
};

// Membuat todo baru + Catat Log
const createTodo = async (data, userId) => {
  if (typeof data === 'object' && !data.user && userId) {
    data.user = userId;
  }
  const newTodo = await Todo.create(data);
  
  // Catat Activity Log
  await recordActivity(data.user || userId, 'CREATE', `Membuat todo baru: "${newTodo.title}"`);

  return newTodo;
};

// Mengambil todo berdasarkan ID
const getTodoById = async (id) => {
  return await Todo.findById(id).populate('user', 'name email');
};

// Memperbarui todo berdasarkan ID + Catat Log
const updateTodo = async (id, data) => {
  const updatedTodo = await Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  
  if (updatedTodo) {
    // Catat Activity Log
    await recordActivity(updatedTodo.user, 'UPDATE', `Memperbarui todo: "${updatedTodo.title}"`);
  }

  return updatedTodo;
};

// Menghapus todo berdasarkan ID + Catat Log
const deleteTodo = async (id) => {
  const deletedTodo = await Todo.findByIdAndDelete(id);
  
  if (deletedTodo) {
    // Catat Activity Log
    await recordActivity(deletedTodo.user, 'DELETE', `Menghapus todo: "${deletedTodo.title}"`);
  }

  return deletedTodo;
};

module.exports = {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
};