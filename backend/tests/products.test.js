const request = require('supertest');
const app = require('../server');
const { resetAndSeed } = require('./helpers/seed');
const { loginAsTestUser, registerAndLogin } = require('./helpers/auth');

beforeEach(async () => {
  await resetAndSeed();
});

describe('GET /api/products', () => {
  it('geriye dönük uyumluluk: sayfalama parametresi yokken düz bir dizi döner', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(10); // seedDemoData ile eklenen 10 ürün
  });

  it('page/limit verildiğinde sayfalama header\'larını döner', async () => {
    const res = await request(app).get('/api/products').query({ page: 1, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.headers['x-total-count']).toBe('10');
    expect(res.headers['x-page']).toBe('1');
    expect(res.headers['x-limit']).toBe('2');
    expect(res.headers['x-total-pages']).toBe('5');
  });

  it('search parametresiyle başlık/açıklamada arama yapar', async () => {
    const res = await request(app).get('/api/products').query({ search: 'Laptop' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toMatch(/Laptop/);
  });

  it('category_id parametresiyle filtreler', async () => {
    const res = await request(app).get('/api/products').query({ category_id: 1 });

    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.category_id === 1)).toBe(true);
  });

  it('geçersiz page parametresinde 400 döner', async () => {
    const res = await request(app).get('/api/products').query({ page: 0 });

    expect(res.status).toBe(400);
  });

  it('status parametresiyle filtreler (active)', async () => {
    const res = await request(app).get('/api/products').query({ status: 'active', page: 1, limit: 50 });

    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.status === 'active')).toBe(true);
  });

  it('status parametresiyle filtreler (sold)', async () => {
    const res = await request(app).get('/api/products').query({ status: 'sold', page: 1, limit: 50 });

    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.status === 'sold')).toBe(true);
  });

  it('min_price ve max_price ile fiyat aralığı filtreler', async () => {
    const res = await request(app).get('/api/products').query({ min_price: 100, max_price: 600, page: 1, limit: 50 });

    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.price >= 100 && p.price <= 600)).toBe(true);
  });

  it('sort ve order parametreleriyle sıralama yapar', async () => {
    const res = await request(app).get('/api/products').query({ sort: 'price', order: 'asc', page: 1, limit: 50 });

    expect(res.status).toBe(200);
    expect(res.body[0].price).toBeLessThanOrEqual(res.body[res.body.length - 1].price);
  });

  it('Bearer token ile is_favorited bilgisi gelir', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).get('/api/products').query({ page: 1, limit: 5 }).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('is_favorited');
  });
});

describe('POST /api/products', () => {
  it('token olmadan 401 döner', async () => {
    const res = await request(app).post('/api/products').send({ title: 'Yeni Ürün', price: 10 });

    expect(res.status).toBe(401);
  });

  it('geçerli token ve veriyle 201 döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', token)
      .send({ title: 'Yeni Ürün', price: 99.5, category_id: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Yeni Ürün', price: 99.5 });
  });

  it('geçersiz veride (eksik başlık) 400 döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', token)
      .send({ price: 10 });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/products/:id', () => {
  it('ürün sahibi olmayan kullanıcı düzenleyemez (403)', async () => {
    const otherToken = await registerAndLogin(app, {
      username: 'baskaKullanici',
      email: 'baska@university.edu',
      password: 'sifre123',
    });

    const res = await request(app)
      .put('/api/products/1')
      .set('Authorization', otherToken)
      .send({ title: 'Hacklendi' });

    expect(res.status).toBe(403);
  });

  it('ürün sahibi başarıyla günceller (200)', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app)
      .put('/api/products/1')
      .set('Authorization', token)
      .send({ title: 'Güncellenmiş Başlık' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Güncellenmiş Başlık');
  });

  it('var olmayan ürün için 404 döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app)
      .put('/api/products/9999')
      .set('Authorization', token)
      .send({ title: 'Fark Etmez' });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/products/:id', () => {
  it('var olan ürünü döner', async () => {
    const res = await request(app).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('price');
    expect(res.body).toHaveProperty('description');
  });

  it('var olmayan ürün için 404 döner', async () => {
    const res = await request(app).get('/api/products/9999');

    expect(res.status).toBe(404);
  });

  it('Bearer token ile is_favorited bilgisi gelir', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).get('/api/products/1').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('is_favorited');
  });
});

describe('DELETE /api/products/:id', () => {
  it('ürün sahibi olmayan kullanıcı silemez (403)', async () => {
    const otherToken = await registerAndLogin(app, {
      username: 'baskaKullanici2',
      email: 'baska2@university.edu',
      password: 'sifre123',
    });

    const res = await request(app).delete('/api/products/1').set('Authorization', otherToken);

    expect(res.status).toBe(403);
  });

  it('ürün sahibi başarıyla siler (200)', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).delete('/api/products/1').set('Authorization', token);

    expect(res.status).toBe(200);

    const listRes = await request(app).get('/api/products');
    expect(listRes.body).toHaveLength(9);
  });

  it('token olmadan 401 döner', async () => {
    const res = await request(app).delete('/api/products/1');

    expect(res.status).toBe(401);
  });

  it('var olmayan ürün için 404 döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).delete('/api/products/9999').set('Authorization', token);

    expect(res.status).toBe(404);
  });
});
