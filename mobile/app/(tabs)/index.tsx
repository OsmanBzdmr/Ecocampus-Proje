import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, Platform, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { fetchProducts, deleteProduct, Product, getProductById } from '@/services/api';
import { getToken, getUserIdFromToken } from '@/services/auth';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    getUserIdFromToken().then(setUserId);
    getProducts();
  }, []);

  const getProducts = async () => {
    setError('');
    try {
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu. Aşağı çekerek tekrar deneyin.');
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getProducts();
    setRefreshing(false);
  }, []);

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

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={products.length === 0 ? styles.emptyContainer : { padding: 10 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
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
});
