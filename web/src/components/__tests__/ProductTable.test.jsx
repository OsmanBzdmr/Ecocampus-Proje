import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from '../ProductTable';

const mockCategories = [
  { id: 1, name: 'Ders Materyalleri' },
  { id: 2, name: 'Elektronik' },
];

const sampleProducts = [
  { id: 1, title: 'Laptop', price: 500, category_id: 2, status: 'active', image_url: null, is_favorited: true, description: 'Dell laptop' },
  { id: 2, title: 'Kitap', price: 0, category_id: 1, status: 'active', image_url: null, is_favorited: false, description: null },
];

describe('ProductTable', () => {
  it('loading stateinde spinner gösterir', () => {
    render(<ProductTable loading={true} products={[]} categories={[]} />);
    expect(screen.getByText('Ürünler yükleniyor...')).toBeInTheDocument();
  });

  it('empty state mesajını gösterir', () => {
    render(<ProductTable loading={false} products={[]} categories={[]} />);
    expect(screen.getByText('Henüz ilan eklenmemiş')).toBeInTheDocument();
  });

  it('ürün listesini render eder', () => {
    render(<ProductTable loading={false} products={sampleProducts} categories={mockCategories} />);
    expect(screen.getByText('Yayındaki İlanlar (2)')).toBeInTheDocument();
    expect(screen.getAllByText('Laptop')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Kitap')[0]).toBeInTheDocument();
    expect(screen.getAllByText('500 ₺')[0]).toBeInTheDocument();
    expect(screen.getAllByText('BAĞIŞ')[0]).toBeInTheDocument();
  });

  it('onToggleFavorite callbackini çağırır', () => {
    const onToggle = vi.fn();
    render(<ProductTable loading={false} products={sampleProducts} categories={mockCategories} onToggleFavorite={onToggle} />);

    const heartSvg = document.querySelector('svg.lucide-heart');
    const btn = heartSvg?.closest('button');
    if (btn) fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith(expect.any(Number));
  });

  it('onViewDetail callbackini çağırır', () => {
    const onView = vi.fn();
    render(<ProductTable loading={false} products={sampleProducts} categories={mockCategories} onViewDetail={onView} />);

    const titleBtn = document.querySelector('td button.font-semibold');
    if (titleBtn) fireEvent.click(titleBtn);
    expect(onView).toHaveBeenCalledWith(sampleProducts[0]);
  });

  it('onEdit ve onDelete callbacklerini çağırır', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<ProductTable loading={false} products={sampleProducts} categories={mockCategories} onEdit={onEdit} onDelete={onDelete} />);

    const editBtn = document.querySelector('button:has(svg.lucide-pencil)');
    if (editBtn) fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(sampleProducts[0]);

    const deleteBtn = document.querySelector('button:has(svg.lucide-trash-2)');
    if (deleteBtn) fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(sampleProducts[0].id);
  });
});
