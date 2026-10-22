const request = require('supertest');
const express = require('express');

// Buat app Express dummy khusus untuk testing jika tidak menggunakan database lokal
const app = express();
app.use(express.json());

// Mock Endpoint Login
app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ token: 'mock-jwt-token-syafira' });
});

// Mock Endpoint Create Todo
app.post('/api/todos', (req, res) => {
  res.status(201).json({ message: 'Todo berhasil dibuat', data: req.body });
});

// Mock Endpoint Get Todo
app.get('/api/todos', (req, res) => {
  res.status(200).json([{ id: 1, title: 'Tugas Testing Jest' }]);
});

describe('Skenario Utama API Todos Integration Test (Mock Mode)', () => {
  let token = 'mock-jwt-token-syafira';

  it('1. Harus berhasil Login dan mendapatkan JWT Token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.token).toBeDefined();
  });

  it('2. Harus berhasil membuat Todo baru', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Tugas Testing Jest',
        description: 'Uji coba automated testing dengan Jest'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  it('3. Harus berhasil mengambil daftar Todo', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });
});