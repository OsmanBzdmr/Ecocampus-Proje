jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  fetchProducts: jest.fn(),
  deleteProduct: jest.fn(),
  toggleFavorite: jest.fn(),
  fetchCategories: jest.fn(),
}));

jest.mock('../../services/auth', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
  getUserIdFromToken: jest.fn().mockResolvedValue(1),
}));

import React from 'react';
import { act } from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';

const mockFetchProducts = require('../../services/api').fetchProducts as jest.Mock;
const mockFetchCategories = require('../../services/api').fetchCategories as jest.Mock;

describe('IndexScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchProducts.mockResolvedValue({ data: [], total: 0 });
    mockFetchCategories.mockResolvedValue({ data: [] });
  });

  it('bileşen render edilir', async () => {
    const IndexScreen = require('@/app/(tabs)/index').default;

    await act(async () => {
      TestRenderer.create(<IndexScreen />);
    });

    expect(mockFetchProducts).toHaveBeenCalled();
    expect(mockFetchCategories).toHaveBeenCalled();
  });
});
