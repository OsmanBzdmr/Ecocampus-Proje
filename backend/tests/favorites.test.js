const request = require('supertest');
const app = require('../server');
const { resetAndSeed } = require('./helpers/seed');
const { loginAsTestUser, registerAndLogin } = require('./helpers/auth');

beforeEach(async () => {
  await resetAndSeed();
});

describe('POST /api/favorites/:productId', () => {
  it('token olmadan 401 döner', async () => {
    const res = await request(app).post('/api/favorites/1');

    expect(res.status).toBe(401);
  });

  it('ürünü favorilere ekler', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).post('/api/favorites/1').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(true);
  });

  it('favoriden çıkarır (toggle)', async () => {
    const token = await loginAsTestUser(app);

    await request(app).post('/api/favorites/1').set('Authorization', token);
    const res = await request(app).post('/api/favorites/1').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(false);
  });

  it('tekrar favorilere eklenebilir (re-toggle)', async () => {
    const token = await loginAsTestUser(app);

    await request(app).post('/api/favorites/1').set('Authorization', token);
    await request(app).post('/api/favorites/1').set('Authorization', token);
    const res = await request(app).post('/api/favorites/1').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(true);
  });

  it('var olmayan ürün için 404 döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).post('/api/favorites/9999').set('Authorization', token);

    expect(res.status).toBe(404);
  });

  it('Bearer ön ekli token ile de çalışır', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).post('/api/favorites/2').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(true);
  });
});

describe('GET /api/favorites', () => {
  it('token olmadan 401 döner', async () => {
    const res = await request(app).get('/api/favorites');

    expect(res.status).toBe(401);
  });

  it('boş favori listesi döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).get('/api/favorites').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('favori listesi dizi olarak döner', async () => {
    const token = await loginAsTestUser(app);

    await request(app).post('/api/favorites/1').set('Authorization', token);

    const res = await request(app).get('/api/favorites').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('favori listesindeki ürünlerde is_favorited: true bulunur', async () => {
    const token = await loginAsTestUser(app);

    await request(app).post('/api/favorites/1').set('Authorization', token);

    const res = await request(app).get('/api/favorites').set('Authorization', token);

    expect(res.status).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('is_favorited');
      expect(res.body[0].is_favorited).toBe(true);
    }
  });
});
