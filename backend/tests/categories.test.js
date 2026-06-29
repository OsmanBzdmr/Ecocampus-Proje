const request = require('supertest');
const app = require('../server');
const { resetAndSeed } = require('./helpers/seed');

beforeEach(async () => {
  await resetAndSeed();
});

describe('GET /api/categories', () => {
  it('kategorileri dizi olarak döner', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('seed verilerindeki kategorileri içerir', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.body.length).toBeGreaterThanOrEqual(3);
    const names = res.body.map((c) => c.name);
    expect(names).toContain('Ders Materyalleri');
    expect(names).toContain('Elektronik');
    expect(names).toContain('Eşya');
  });

  it('her kategori id, name ve icon alanlarına sahiptir', async () => {
    const res = await request(app).get('/api/categories');

    res.body.forEach((cat) => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('icon');
    });
  });

  it('token olmadan da erişilebilir', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.status).toBe(200);
  });
});
