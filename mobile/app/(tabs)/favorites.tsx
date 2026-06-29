import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, Platform, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getFavorites, toggleFavorite, Product } from '@/services/api';
import { getToken } from '@/services/auth';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) { router.replace('/login'); return; }
      const res = await getFavorites(token);
      setFavorites(res.data);
    } catch (err) {
      console.error('Favori yükleme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [loadFavorites])
  );

  const handleToggleFavorite = async (productId: number) => {
    try {
      const token = await getToken();
      if (!token) { router.replace('/login'); return; }
      await toggleFavorite(productId, token);
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
    } catch {}
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '/detail' as any, params: { id: item.id.toString() } })} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleToggleFavorite(item.id)} style={styles.favBtn}>
              <Text style={styles.favActive}>❤️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
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
        <Text style={styles.headerText}>Favorilerim</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : { padding: 10 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>Henüz favori ilanınız yok</Text>
            <Text style={styles.emptySub}>İlanlarda kalp ikonuna tıklayarak favorilere ekleyin</Text>
          </View>
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
  card: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#111827',
  },
  favBtn: {
    paddingHorizontal: 8,
  },
  favActive: {
    fontSize: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
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
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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
    textAlign: 'center',
  },
});
