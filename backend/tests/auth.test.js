const request = require('supertest');
const app = require('../server');
const { resetAndSeed } = require('./helpers/seed');
const { loginAsTestUser, registerAndLogin } = require('./helpers/auth');

beforeEach(async () => {
  await resetAndSeed();
});

describe('POST /api/auth/register', () => {
  it('geçerli verilerle yeni kullanıcı oluşturur (201)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'yeniKullanici',
      email: 'yeni@university.edu',
      password: 'sifre123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ username: 'yeniKullanici', email: 'yeni@university.edu' });
    expect(res.body.password).toBeUndefined();
  });

  it('eksik alanlarda 400 ve doğrulama hatası döner', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'eksik@university.edu' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(expect.any(Array));
  });

  it('geçersiz e-posta formatında 400 döner', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'kullanici',
      email: 'gecersiz-eposta',
      password: 'sifre123',
    });

    expect(res.status).toBe(400);
  });

  it('6 karakterden kısa şifrede 400 döner', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'kullanici',
      email: 'kisa@university.edu',
      password: '123',
    });

    expect(res.status).toBe(400);
  });

  it('zaten kayıtlı e-posta ile 409 döner', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'baskaKullanici',
      email: 'test@university.edu', // seedDemoData ile eklenen test kullanıcısı
      password: 'sifre123',
    });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('doğru bilgilerle giriş yapar ve token döner', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@university.edu',
      password: 'test123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ username: 'testuser' });
  });

  it('yanlış şifrede 401 döner', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@university.edu',
      password: 'yanlisSifre',
    });

    expect(res.status).toBe(401);
  });

  it('var olmayan e-posta ile 401 döner', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'yok@university.edu',
      password: 'herhangi',
    });

    expect(res.status).toBe(401);
  });

  it('eksik alanlarda 400 döner', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@university.edu' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('geçerli token ile profil bilgilerini döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).get('/api/auth/me').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: 'testuser', email: 'test@university.edu' });
    expect(res.body.stats).toMatchObject({ totalListings: 10 });
    expect(res.body.listings).toHaveLength(10);
  });

  it('token olmadan 401 döner', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('geçersiz token ile 401 döner', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'gecersiz-token');

    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/auth/me', () => {
  it('doğru şifreyle hesabı siler', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).delete('/api/auth/me').set('Authorization', token).send({ password: 'test123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hesabınız başarıyla silindi');
  });

  it('yanlış şifreyle 401 döner', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).delete('/api/auth/me').set('Authorization', token).send({ password: 'yanlis' });

    expect(res.status).toBe(401);
  });

  it('eksik şifreyle 400 döner (validasyon hatası)', async () => {
    const token = await loginAsTestUser(app);

    const res = await request(app).delete('/api/auth/me').set('Authorization', token).send({});

    expect(res.status).toBe(400);
  });

  it('token olmadan 401 döner', async () => {
    const res = await request(app).delete('/api/auth/me').send({ password: 'test123' });

    expect(res.status).toBe(401);
  });
});
