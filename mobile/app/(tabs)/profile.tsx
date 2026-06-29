import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { getMe, deleteAccount, UserProfile } from '@/services/api';
import { getToken, removeToken } from '@/services/auth';
import { eco } from '@/constants/theme';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) {
        router.replace('/login');
        return;
      }
      const res = await getMe(token);
      setProfile(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        await removeToken();
        router.replace('/login');
        return;
      }
      setError(err.response?.data?.message || 'Profil yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorText}>{error || 'Profil yüklenemedi.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = profile.user.username.charAt(0).toUpperCase();
  const createdDate = new Date(profile.user.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.username}>{profile.user.username}</Text>
        <Text style={styles.email}>{profile.user.email}</Text>
        <Text style={styles.memberSince}>Üye oldu: {createdDate}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.stats.totalListings}</Text>
          <Text style={styles.statLabel}>Toplam İlan</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.stats.activeListings}</Text>
          <Text style={styles.statLabel}>Satılık</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.stats.donationListings}</Text>
          <Text style={styles.statLabel}>Bağış</Text>
        </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.stats.totalValue} ₺</Text>
            <Text style={styles.statLabel}>Toplam Değer</Text>
          </View>
      </View>

      {/* Listings */}
      <Text style={styles.sectionTitle}>İlanlarım</Text>
      {profile.listings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Henüz ilan eklemediniz</Text>
        </View>
      ) : (
        <View style={styles.listings}>
          {profile.listings.map((item) => (
            <View key={item.id} style={styles.listingCard}>
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{item.title}</Text>
                <Text style={styles.listingPrice}>
                  {item.price === 0 ? 'Bağış' : `${item.price} ₺`}
                </Text>
              </View>
              <View style={styles.listingBadgeRow}>
                <View style={[styles.badge, item.price > 0 ? styles.badgeActive : styles.badgeDonation]}>
                  <Text style={[styles.badgeText, item.price > 0 ? styles.badgeTextActive : styles.badgeTextDonation]}>
                    {item.price > 0 ? 'Aktif' : 'Bağış'}
                  </Text>
                </View>
                {item.status && (
                  <View style={[styles.badge,
                    item.status === 'active' ? styles.badgeActive :
                    item.status === 'reserved' ? { backgroundColor: '#fef3c7' } : { backgroundColor: '#fef2f2' }
                  ]}>
                    <Text style={[styles.badgeText,
                      item.status === 'active' ? styles.badgeTextActive :
                      item.status === 'reserved' ? { color: '#92400e' } : { color: '#dc2626' }
                    ]}>
                      {item.status === 'active' ? 'Aktif' :
                       item.status === 'reserved' ? 'Rezerve' : 'Satıldı'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Güvenli Çıkış</Text>
      </TouchableOpacity>

      {/* Delete Account */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteVisible(true)}>
        <Text style={styles.deleteButtonText}>Hesabı Sil</Text>
      </TouchableOpacity>

      <Modal visible={deleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hesabı Sil</Text>
            <Text style={styles.modalText}>
              Bu işlem geri alınamaz. Tüm ilanlarınız kalıcı olarak silinecek.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Şifrenizi girin"
              placeholderTextColor="#94a3b8"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => { setDeleteVisible(false); setDeletePassword(''); }}
              >
                <Text style={styles.modalCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDelete}
                onPress={async () => {
                  if (!deletePassword) return;
                  setDeleteLoading(true);
                  try {
                    const token = await getToken();
                    if (!token) { router.replace('/login'); return; }
                    await deleteAccount(deletePassword, token);
                    await removeToken();
                    router.replace('/login');
                  } catch {
                    Alert.alert('Hata', 'Şifre hatalı veya silme işlemi başarısız');
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                disabled={deleteLoading}
              >
                <Text style={styles.modalDeleteText}>
                  {deleteLoading ? 'Siliniyor...' : 'Hesabı Sil'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: eco[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: eco[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: eco[800],
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  listings: {
    gap: 8,
  },
  listingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  listingInfo: {
    flex: 1,
    marginRight: 12,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  listingPrice: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
  },
  badgeDonation: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#15803d',
  },
  badgeTextDonation: {
    color: '#92400e',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  modalDelete: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalDeleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  listingBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
});
