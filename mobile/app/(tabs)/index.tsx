import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, Platform, StatusBar, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import { fetchProducts, deleteProduct, Product, fetchCategories, Category } from '@/services/api';
import { getToken, getUserIdFromToken } from '@/services/auth';

const LIMIT = 10;

const FilterBar = React.memo(({
  search, setSearch,
  categories, categoryFilter, setCategoryFilter,
  statusFilter, setStatusFilter,
  minPrice, setMinPrice, maxPrice, setMaxPrice,
  setFiltersDirty,
}: {
  search: string;
  setSearch: (v: string) => void;
  categories: Category[];
  categoryFilter: number | undefined;
  setCategoryFilter: (v: number | undefined) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  setFiltersDirty: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  return (
    <View style={styles.filterBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="İlanlarda ara..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={(t) => {
          setSearch(t);
          if (timeout.current) clearTimeout(timeout.current);
          timeout.current = setTimeout(() => setFiltersDirty((c) => c + 1), 300);
        }}
      />
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !categoryFilter && styles.filterChipActive]}
          onPress={() => { setCategoryFilter(undefined); setFiltersDirty((c) => c + 1); }}
        >
          <Text style={[styles.filterChipText, !categoryFilter && styles.filterChipTextActive]}>Tümü</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.filterChip, categoryFilter === cat.id && styles.filterChipActive]}
            onPress={() => { setCategoryFilter(cat.id); setFiltersDirty((c) => c + 1); }}
          >
            <Text style={[styles.filterChipText, categoryFilter === cat.id && styles.filterChipTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filterRow}>
        {['', 'active', 'reserved', 'sold'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.filterChip, statusFilter === s && styles.filterChipActive]}
            onPress={() => { setStatusFilter(s); setFiltersDirty((c) => c + 1); }}
          >
            <Text style={[styles.filterChipText, statusFilter === s && styles.filterChipTextActive]}>
              {s === '' ? 'Tümü' : s === 'active' ? 'Aktif' : s === 'reserved' ? 'Rezerve' : 'Satıldı'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.priceRow}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min ₺"
          placeholderTextColor="#94a3b8"
          value={minPrice}
          onChangeText={(t) => {
            setMinPrice(t);
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setFiltersDirty((c) => c + 1), 300);
          }}
          keyboardType="decimal-pad"
        />
        <Text style={styles.priceSep}>-</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Max ₺"
          placeholderTextColor="#94a3b8"
          value={maxPrice}
          onChangeText={(t) => {
            setMaxPrice(t);
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setFiltersDirty((c) => c + 1), 300);
          }}
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  );
});

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [filtersDirty, setFiltersDirty] = useState(0);

  useEffect(() => {
    getUserIdFromToken().then(setUserId);
    fetchCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    loadPage(1, true);
  }, [filtersDirty]);

  const loadPage = async (p: number, replace: boolean) => {
    if (replace && products.length === 0) setLoading(true);
    setError('');
    try {
      const params: Record<string, any> = { page: p, limit: LIMIT };
      if (search) params.search = search;
      if (categoryFilter) params.category_id = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      const response = await fetchProducts(params);
      const data = response.data as any;
      const newProducts = Array.isArray(data) ? data : data.products || [];
      const totalPages = parseInt(response.headers?.['x-total-pages'] || '1', 10);
      setProducts((prev) => (replace ? newProducts : [...prev, ...newProducts]));
      setPage(p);
      setHasMore(p < totalPages);
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu. Aşağı çekerek tekrar deneyin.');
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    loadPage(page + 1, false);
  };

  const handleViewDetail = (product: Product) => {
    router.push({ pathname: '/detail' as any, params: { id: product.id.toString() } });
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'İlanı Sil',
      'Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              if (!token) return;
              await deleteProduct(product.id, token);
              setProducts((prev) => prev.filter((p) => p.id !== product.id));
            } catch (err) {
              console.error("Silme hatası:", err);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => {
    const isOwner = userId !== null && item.user_id === userId;

    return (
      <TouchableOpacity onPress={() => handleViewDetail(item)} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />
          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.title}</Text>
              {isOwner && (
                <View style={styles.ownerActions}>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/edit-product' as any, params: { product: JSON.stringify(item) } })}
                    style={styles.editBtn}
                  >
                    <Text style={styles.editBtnText}>Düzenle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>Sil</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {item.price == 0 ? 'Bağış' : `${item.price} ₺`}
              </Text>
              {item.status && (
                <Text style={[
                  styles.statusBadge,
                  item.status === 'active' ? styles.statusActive :
                  item.status === 'reserved' ? styles.statusReserved : styles.statusSold
                ]}>
                  {item.status === 'active' ? 'Aktif' :
                   item.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#22c55e" />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EcoCampus Vitrin</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <FilterBar
        search={search}
        setSearch={setSearch}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setFiltersDirty={setFiltersDirty}
      />

      <FlatList
        style={{ flex: 1 }}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={products.length === 0 ? styles.emptyContainer : { paddingHorizontal: 10, paddingBottom: 10 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Henüz ilan yok</Text>
              <Text style={styles.emptySub}>İlk ilanı sen ekle!</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  errorBannerText: {
    color: '#dc2626',
    fontSize: 13,
    textAlign: 'center',
  },
  filterBar: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: '#22c55e',
  },
  filterChipText: {
    fontSize: 13,
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  priceSep: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
  },
  editBtn: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    color: '#d97706',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    color: '#27ae60',
    marginTop: 5,
    fontWeight: 'bold'
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  emptySub: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  statusReserved: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusSold: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
