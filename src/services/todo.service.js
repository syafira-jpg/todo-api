const Todo = require('../models/todo.model');
const ActivityLog = require('../models/activityLog.model');

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
  let query = {};
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

  // Sorting
  let sortOption = {};
  if (sortBy) {
    sortOption[sortBy] = order === 'desc' ? -1 : 1;
  } else {
    sortOption.createdAt = -1;
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const todos = await Todo.find(query)
    .populate('user', 'name email')
    .populate('category', 'name')
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
const updateTodo = async (id, data) => {
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
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  recordActivity,
};