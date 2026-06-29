import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getProductById, toggleFavorite, Product } from '@/services/api';
import { getToken } from '@/services/auth';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      const token = await getToken();
      const res = await getProductById(parseInt(id), token || undefined);
      setProduct(res.data);
    })().catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : !product ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Ürün bulunamadı</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 48 }}>📦</Text>
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.title}</Text>
              <TouchableOpacity
                onPress={async () => {
                  const token = await getToken();
                  if (!token) { router.replace('/login'); return; }
                  try {
                    const res = await toggleFavorite(product.id, token);
                    setProduct((prev) => prev ? { ...prev, is_favorited: res.data.favorited } : prev);
                  } catch {}
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  {product.is_favorited ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.meta}>
              {product.username && (
                <Text style={styles.metaText}>{product.username}</Text>
              )}
              {product.created_at && (
                <Text style={styles.metaText}>
                  {new Date(product.created_at).toLocaleDateString('tr-TR')}
                </Text>
              )}
            </View>

            <View style={styles.priceRow}>
              {product.price == 0 ? (
                <Text style={styles.donationBadge}>Bağış</Text>
              ) : (
                <Text style={styles.price}>{product.price} ₺</Text>
              )}
              {product.status && (
                <Text style={[
                  styles.statusBadge,
                  product.status === 'active' ? styles.statusActive :
                  product.status === 'reserved' ? styles.statusReserved : styles.statusSold
                ]}>
                  {product.status === 'active' ? 'Aktif' :
                   product.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                </Text>
              )}
            </View>

            {product.category_name && (
              <Text style={styles.category}>{product.category_name}</Text>
            )}

            {product.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Açıklama</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  donationBadge: {
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 3,
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
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: 16,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 24,
  },
});
