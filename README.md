# 📝 REST API Todos List Management (Node.js & MongoDB)

Proyek ini adalah backend REST API untuk pengelolaan tugas (Todos List Management) yang dibangun menggunakan Node.js, Express.js, dan MongoDB.

## 🚀 Fitur Utama
- **Autentikasi & Otorisasi**: Login dan Register menggunakan JWT (JSON Web Token).
- **CRUD Todos**: Membuat, membaca, memperbarui, dan menghapus data todo.
- **Filtering & Pagination**: Mendukung pencarian dan pembagian halaman data.
- **Activity Log**: Mencatat setiap aktivitas perubahan data.
- **Dokumentasi Swagger**: Dokumentasi API interaktif di `/api-docs`.
- **Automated Testing**: Pengujian integrasi menggunakan Jest & Supertest.

## 🛠️ Teknologi yang Digunakan
- Node.js & Express.js
- MongoDB & Mongoose
- Swagger UI Express & Swagger JSDoc
- Jest & Supertest

## ⚙️ Cara Menjalankan Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Server:**
   ```bash
   node server.js
   ```

3. **Akses Dokumentasi API (Swagger):**
   Buka browser di `http://localhost:5000/api-docs`

4. **Jalankan Testing (Jest):**
   ```bash
   npx jest tests/todo.test.js --forceExit