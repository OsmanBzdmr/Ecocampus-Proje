import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { register as registerApi } from '@/services/api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Tüm alanları doldurun');
      return;
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await registerApi({ username, email, password });
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Kayıt sırasında bir hata oluştu';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.logo}>🌿</Text>
            <Text style={styles.title}>Kayıt başarılı!</Text>
            <Text style={styles.subtitle}>Artık giriş yapabilirsin.</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
            <Text style={styles.buttonText}>Giriş Sayfasına Git</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>EcoCampus</Text>
          <Text style={styles.subtitle}>Yeni Hesap Oluştur</Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="E-posta Adresi"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre (Tekrar)"
          placeholderTextColor="#94a3b8"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Zaten hesabın var mı? <Text style={styles.linkBold}>Giriş yap</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: '#6b7280',
  },
  linkBold: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
