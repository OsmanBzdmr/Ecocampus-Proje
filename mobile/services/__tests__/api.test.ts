jest.mock('axios');

// @ts-ignore
const axiosMock = require('axios');
const { mockGet, mockPost, mockPut, mockDelete } = axiosMock;

import {
  fetchProducts, getProductById, addProductWithImage,
  updateProductWithImage, deleteProduct,
  login, register, fetchCategories, getMe, deleteAccount,
  toggleFavorite, getFavorites,
} from '../api';

const TOKEN = 'test-token-123';
const BEARER = `Bearer ${TOKEN}`;

describe('fetchProducts', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  it('token olmadan çağrılır', () => {
    fetchProducts({ page: 1 });
    expect(mockGet).toHaveBeenCalledWith('/api/products', {
      params: { page: 1 },
    });
  });

  it('token ile çağrılır', () => {
    fetchProducts({ search: 'laptop' }, TOKEN);
    expect(mockGet).toHaveBeenCalledWith('/api/products', {
      params: { search: 'laptop' },
      headers: { Authorization: BEARER },
    });
  });

  it('params olmadan çağrılır', () => {
    fetchProducts();
    expect(mockGet).toHaveBeenCalledWith('/api/products', { params: undefined });
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
      headers: { Authorization: BEARER },
    });
  });
});

describe('addProductWithImage', () => {
  it('FormData ve token ile çağrılır', () => {
    const formData = new FormData();
    addProductWithImage(formData, TOKEN);
    expect(mockPost).toHaveBeenCalledWith('/api/products', formData, {
      headers: { Authorization: BEARER },
    });
  });
});

describe('updateProductWithImage', () => {
  it('FormData ve token ile çağrılır', () => {
    const formData = new FormData();
    updateProductWithImage(3, formData, TOKEN);
    expect(mockPut).toHaveBeenCalledWith('/api/products/3', formData, {
      headers: { Authorization: BEARER },
    });
  });
});

describe('deleteProduct', () => {
  it('doğru ID ve token ile çağrılır', () => {
    deleteProduct(7, TOKEN);
    expect(mockDelete).toHaveBeenCalledWith('/api/products/7', {
      headers: { Authorization: BEARER },
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
      headers: { Authorization: BEARER },
    });
  });
});

describe('deleteAccount', () => {
  it('password ve token ile çağrılır', () => {
    deleteAccount('sifre', TOKEN);
    expect(mockDelete).toHaveBeenCalledWith('/api/auth/me', {
      headers: { Authorization: BEARER },
      data: { password: 'sifre' },
    });
  });
});

describe('toggleFavorite', () => {
  it('POST /api/favorites/:id ile çağrılır', () => {
    toggleFavorite(42, TOKEN);
    expect(mockPost).toHaveBeenCalledWith('/api/favorites/42', null, {
      headers: { Authorization: BEARER },
    });
  });
});

describe('getFavorites', () => {
  it('Authorization header ile çağrılır', () => {
    getFavorites(TOKEN);
    expect(mockGet).toHaveBeenCalledWith('/api/favorites', {
      headers: { Authorization: BEARER },
    });
  });
});
