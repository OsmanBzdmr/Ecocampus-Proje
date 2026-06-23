import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>EcoCampus</ThemedText>
        <ThemedText type="subtitle">Sürdürülebilir Kampüs Pazaryeri</ThemedText>

        <ThemedText style={styles.section}>🌿 Hakkında</ThemedText>
        <ThemedText style={styles.body}>
          EcoCampus, öğrencilerin ikinci el eşya, ders materyali ve ihtiyaç fazlası ürünleri
          kolayca paylaşabildiği bir kampüs içi pazaryeridir. İsrafı azaltmak ve
          öğrenciler arasında dayanışmayı artırmak için tasarlanmıştır.
        </ThemedText>

        <ThemedText style={styles.section}>♻️ Nasıl Çalışır?</ThemedText>
        <ThemedText style={styles.body}>
          • İlan ekle: Satmak veya bağışlamak istediğin ürünleri ekle.{'\n'}
          • Keşfet: Diğer öğrencilerin ilanlarına göz at.{'\n'}
          • Bağış: Fiyatı 0 TL olan ilanlar bağış olarak işaretlenir.
        </ThemedText>

        <ThemedText style={styles.version}>v1.0.0</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
  title: { marginBottom: 4 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 20 },
  body: { opacity: 0.8, lineHeight: 24 },
  version: { marginTop: 40, opacity: 0.4, fontSize: 12, textAlign: 'center' },
});
