import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetail from '../ProductDetail';

const mockProduct = {
  id: 1,
  title: 'Test Laptop',
  price: 500,
  description: 'Açıklama metni',
  image_url: 'https://example.com/img.jpg',
  category_name: 'Elektronik',
  username: 'testuser',
  created_at: '2025-01-01T00:00:00Z',
  status: 'active',
  is_favorited: true,
};

const getProductByIdMock = vi.fn(() => Promise.resolve({ data: mockProduct }));
const toggleFavoriteMock = vi.fn(() => Promise.resolve({ data: { favorited: false } }));

vi.mock('../../services/api', () => ({
  getProductById: (...args) => getProductByIdMock(...args),
  toggleFavorite: (...args) => toggleFavoriteMock(...args),
}));

describe('ProductDetail', () => {
  it('productId verilmeden render edilmez', () => {
    const { container } = render(<ProductDetail productId={null} onClose={() => {}} token={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('loading statei gösterir sonra ürün detayını render eder', async () => {
    render(<ProductDetail productId={1} onClose={() => {}} token="test-token" />);

    expect(await screen.findByText('Test Laptop')).toBeInTheDocument();
    expect(screen.getByText('500 ₺')).toBeInTheDocument();
    expect(screen.getByText('Açıklama metni')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Elektronik')).toBeInTheDocument();
  });

  it('favori kalp ikonu token varsa gösterilir', async () => {
    render(<ProductDetail productId={1} onClose={() => {}} token="test-token" />);

    await screen.findByText('Test Laptop');
    const heartBtn = document.querySelector('svg.lucide-heart')?.closest('button');
    expect(heartBtn).not.toBeNull();
  });

  it('token yoksa favori butonu gösterilmez', async () => {
    render(<ProductDetail productId={1} onClose={() => {}} token={null} />);

    await screen.findByText('Test Laptop');
    const heartSvg = document.querySelector('svg.lucide-heart');
    expect(heartSvg).toBeNull();
  });

  it('kapatma butonu onClose callbackini çağırır', async () => {
    const onClose = vi.fn();
    render(<ProductDetail productId={1} onClose={onClose} token="test-token" />);

    await screen.findByText('Test Laptop');
    const closeBtn = document.querySelector('svg.lucide-x')?.closest('button');
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
