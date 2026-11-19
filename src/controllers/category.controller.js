const Category = require('../models/category.model');

// Mengambil semua kategori milik user yang sedang login
const getCategories = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const categories = await Category.find({ user: userId });

    res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

// Membuat kategori baru (menyertakan created_by)
const createCategory = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized, user ID tidak ditemukan' });
    }

    const { name } = req.body;

    const newCategory = await Category.create({
      name,
      user: userId,
      created_by: userId,
      updated_by: userId,
    });

    res.status(201).json({
      status: 'success',
      data: newCategory,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Memperbarui kategori berdasarkan ID (menyertakan updated_by)
const updateCategory = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const { id } = req.params;
    const { name } = req.body;

    const updatePayload = { name };
    if (userId) {
      updatePayload.updated_by = userId;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ status: 'fail', message: 'Kategori tidak ditemukan' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Menghapus kategori berdasarkan ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ status: 'fail', message: 'Kategori tidak ditemukan' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};