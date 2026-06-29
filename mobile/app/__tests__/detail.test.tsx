jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  getProductById: jest.fn(),
  toggleFavorite: jest.fn(),
}));

jest.mock('../../services/auth', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

import React from 'react';
import { act } from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';

const mockGetProductById = require('../../services/api').getProductById as jest.Mock;
const mockToggleFavorite = require('../../services/api').toggleFavorite as jest.Mock;
const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.Mock;

describe('DetailScreen', () => {
  const sampleProduct = {
    id: 1,
    title: 'Test Ürün',
    description: 'Test açıklama',
    price: '150',
    image_url: 'https://example.com/img.jpg',
    is_favorited: false,
    category_id: 1,
    user_id: 1,
    status: 'active',
    created_at: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ id: '1' });
    mockGetProductById.mockResolvedValue({ data: sampleProduct });
  });

  it('bileşen render edilir ve ürün detayı yüklenir', async () => {
    const DetailScreen = require('@/app/detail').default;

    await act(async () => {
      TestRenderer.create(<DetailScreen />);
    });

    expect(mockGetProductById).toHaveBeenCalledWith(1);
  });

  it('id parametresi yoksa API çağrılmaz', async () => {
    mockUseLocalSearchParams.mockReturnValue({});
    const DetailScreen = require('@/app/detail').default;

    await act(async () => {
      TestRenderer.create(<DetailScreen />);
    });

    expect(mockGetProductById).not.toHaveBeenCalled();
  });
});
