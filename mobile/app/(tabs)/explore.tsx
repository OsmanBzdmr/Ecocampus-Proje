import { StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { removeToken } from '@/services/auth';

export default function AboutScreen() {
  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Oturumunuzu kapatmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">EcoCampus</ThemedText>
      <ThemedText>Sürdürülebilir Kampüs Pazaryeri 🌿</ThemedText>
      <ThemedText style={styles.sub}>
        Öğrencilerin eşya paylaştığı, israfı azaltan bir platform.
      </ThemedText>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  sub: { textAlign: 'center', opacity: 0.7 },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
