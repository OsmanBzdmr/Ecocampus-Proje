const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    })),
  },
}));

import {
  fetchProducts, getProductById, addProduct, updateProduct, deleteProduct,
  login, register, fetchCategories, getMe, deleteAccount, toggleFavorite, getFavorites,
} from '../api';

const TOKEN = 'test-token-123';

describe('fetchProducts', () => {
  it('token olmadan çağrılır', () => {
    fetchProducts({ page: 1, limit: 10 });
    expect(mockGet).toHaveBeenCalledWith('/api/products', {
      params: { page: 1, limit: 10 },
    });
  });

  it('token ile çağrılır', () => {
    fetchProducts({ search: 'laptop' }, TOKEN);
    expect(mockGet).toHaveBeenCalledWith('/api/products', {
      params: { search: 'laptop' },
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });

  it('params olmadan çağrılır', () => {
    fetchProducts();
    expect(mockGet).toHaveBeenCalledWith('/api/products', { params: {} });
  });
});

describe('getProductById', () => {
  it('token olmadan çağrılır', () => {
    getProductById(5);
    expect(mockGet).toHaveBeenCalledWith('/api/products/5', {});
  });

  it('token ile çağrılır', () => {
    getProductById(5, TOKEN);
    expect(mockGet).toHaveBeenCalledWith('/api/products/5', {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });
});

describe('addProduct', () => {
  it('multipart form-data ile çağrılır', () => {
    const data = new FormData();
    addProduct(data, TOKEN);
    expect(mockPost).toHaveBeenCalledWith('/api/products', data, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'multipart/form-data' },
    });
  });
});

describe('updateProduct', () => {
  it('doğru ID ve token ile çağrılır', () => {
    const data = { title: 'New Title' };
    updateProduct(3, data, TOKEN);
    expect(mockPut).toHaveBeenCalledWith('/api/products/3', data, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'multipart/form-data' },
    });
  });
});

describe('deleteProduct', () => {
  it('doğru ID ve token ile çağrılır', () => {
    deleteProduct(7, TOKEN);
    expect(mockDelete).toHaveBeenCalledWith('/api/products/7', {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });
});

describe('login', () => {
  it('credentials ile çağrılır', () => {
    const creds = { email: 'a@b.com', password: '123' };
    login(creds);
    expect(mockPost).toHaveBeenCalledWith('/api/auth/login', creds);
  });
});

describe('register', () => {
  it('kullanıcı verisi ile çağrılır', () => {
    const data = { username: 'test', email: 'a@b.com', password: '123' };
    register(data);
    expect(mockPost).toHaveBeenCalledWith('/api/auth/register', data);
  });
});

describe('fetchCategories', () => {
  it('GET /api/categories çağrılır', () => {
    fetchCategories();
    expect(mockGet).toHaveBeenCalledWith('/api/categories');
  });
});

describe('getMe', () => {
  it('Authorization header ile çağrılır', () => {
    getMe(TOKEN);
    expect(mockGet).toHaveBeenCalledWith('/api/auth/me', {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });
});

describe('deleteAccount', () => {
  it('password ve token ile çağrılır', () => {
    deleteAccount('sifre', TOKEN);
    expect(mockDelete).toHaveBeenCalledWith('/api/auth/me', {
      headers: { Authorization: `Bearer ${TOKEN}` },
      data: { password: 'sifre' },
    });
  });
});

describe('toggleFavorite', () => {
  it('POST /api/favorites/:id ile çağrılır', () => {
    toggleFavorite(42, TOKEN);
    expect(mockPost).toHaveBeenCalledWith('/api/favorites/42', null, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });
});

describe('getFavorites', () => {
  it('Authorization header ile çağrılır', () => {
    getFavorites(TOKEN);
    expect(mockGet).toHaveBeenCalledWith('/api/favorites', {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });
});
