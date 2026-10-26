# 📝 REST API Todos List Management (Node.js & MongoDB)

Proyek backend REST API untuk pengelolaan tugas menggunakan Node.js, Express.js, dan MongoDB.

## 🌐 Live Demo & Dokumentasi
- **Swagger UI Vercel:** [https://todo-api-seven-ashen.vercel.app/api-docs](https://todo-api-seven-ashen.vercel.app/api-docs)

## 🚀 Fitur Utama
- **Autentikasi**: Login dan Register menggunakan JWT.
- **CRUD Todos**: Membuat, membaca, memperbarui, dan menghapus todo.
- **CRUD Kategori**: Mengelola kategori todo (GET, POST, PUT, DELETE).
- **Filtering & Pagination**: Pencarian dan pembagian halaman.
- **Activity Log**: Pencatatan aktivitas perubahan data.
- **Stats & API Key**: Statistik sistem dengan proteksi API Key.
- **Dokumentasi Swagger**: Dokumentasi interaktif di `/api-docs`.
- **Automated Testing**: Pengujian menggunakan Jest & Supertest.

## 🔑 Dokumentasi API Key (Akses Eksternal)
Endpoint statistik (`/api/stats/summary`) dilindungi API Key:
- **Header Key:** `x-api-key`
- **Header Value:** `mysecretapikey123`

## ⚙️ Cara Menjalankan (Lokal)
1. `npm install`
2. Buat file `.env` (isi `MONGO_URI`, `JWT_SECRET`, `API_KEY=mysecretapikey123`)
3. `node server.js`
4. Buka `http://localhost:5000/api-docs`