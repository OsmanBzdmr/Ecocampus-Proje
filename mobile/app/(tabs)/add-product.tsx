import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { addProductWithImage, fetchCategories, Category } from '@/services/api';
import { getToken } from '@/services/auth';

export default function AddProductScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [image_url, setImageUrl] = useState('');
  const [category_id, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) setCategoryId(res.data[0].id);
    }).catch(() => setError('Kategoriler yüklenemedi'));
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageUrl('');
    }
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      setError('Başlık ve fiyat zorunludur');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      const fd = new FormData();
      fd.append('title', title);
      fd.append('price', String(parseFloat(price)));
      if (description) fd.append('description', description);
      if (category_id) fd.append('category_id', String(category_id));
      if (image_url) fd.append('image_url', image_url);
      if (imageUri) fd.append('image', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
      await addProductWithImage(fd, token);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürün eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Yeni İlan Ver</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Ürün Adı</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Kullanılmış Laptop"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, category_id === cat.id && styles.categoryChipActive]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text style={[styles.categoryChipText, category_id === cat.id && styles.categoryChipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Fiyat (₺)</Text>
        <TextInput
          style={styles.input}
          placeholder="0 (Bağış) veya 100"
          placeholderTextColor="#94a3b8"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        <Text style={styles.hint}>Fiyat 0 ₺ ise otomatik bağış olarak işaretlenir</Text>

        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ürün hakkında bilgi verin..."
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Görsel</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Galeriden Seç</Text>
          )}
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity onPress={() => { setImageUri(null); setImageUrl(''); }}>
            <Text style={styles.removeImage}>Kaldır</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.hint}>Veya URL girin:</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          placeholderTextColor="#94a3b8"
          value={image_url}
          onChangeText={(t) => { setImageUrl(t); setImageUri(null); }}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>İlan Ekle</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#374151',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePicker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  imagePickerText: {
    color: '#6b7280',
    fontSize: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImage: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});
