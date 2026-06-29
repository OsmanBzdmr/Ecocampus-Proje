jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useFocusEffect: jest.fn(),
  useLocalSearchParams: () => ({}),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  getFavorites: jest.fn(),
  toggleFavorite: jest.fn(),
}));

jest.mock('../../services/auth', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

import React from 'react';
import { act } from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';

const mockUseFocusEffect = require('expo-router').useFocusEffect as jest.Mock;
const mockGetFavorites = require('../../services/api').getFavorites as jest.Mock;
const mockToggleFavorite = require('../../services/api').toggleFavorite as jest.Mock;

let focusCallback: () => void;

describe('FavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFavorites.mockResolvedValue({ data: [] });
    focusCallback = undefined as any;
    mockUseFocusEffect.mockImplementation((cb: any) => { focusCallback = cb; });
  });

  it('bileşen render edilir', () => {
    const FavoritesScreen = require('@/app/(tabs)/favorites').default;
    act(() => { TestRenderer.create(<FavoritesScreen />); });
  });

  it('useFocusEffect callbacki API çağrısı yapar', async () => {
    mockGetFavorites.mockResolvedValue({
      data: [{ id: 1, name: 'Ürün 1', price: '100', image_url: 'img.jpg', is_favorited: true, category_id: 1, user_id: 1, status: 'active', description: 'Açıklama', created_at: '2024-01-01' }],
    });

    const FavoritesScreen = require('@/app/(tabs)/favorites').default;
    act(() => { TestRenderer.create(<FavoritesScreen />); });

    expect(focusCallback).toBeDefined();
    await act(async () => { focusCallback(); });

    expect(mockGetFavorites).toHaveBeenCalledWith('test-token');
  });
});
