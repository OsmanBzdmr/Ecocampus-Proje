import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'; // 1. Bunu ekledik

// 2. Dinamik IP Tespiti
// Expo Go üzerinden bağlandığın bilgisayarın IP adresini otomatik çeker
const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  const ip = debuggerHost.split(':')[0]; // Port numarasını ayırıp sadece IP'yi alıyoruz
  
  // Eğer IP tespit edilemezse (Simülatör durumları için) varsayılan localhost
  return ip ? `http://${ip}:5000/api/products` : 'http://10.0.2.2:5000/api/products';
};

const API_URL = getApiUrl();
console.log("Bağlanılan API Adresi:", API_URL); // Terminalde hangi IP'ye bağlandığını görebilirsin

export default function App() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    getProducts();
    const interval = setInterval(getProducts, 5000); 
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>
          {item.price == 0 ? '❤️ BAĞIŞ' : `${item.price} TL`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EcoCampus Vitrin</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
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

    marginBottom: 15,

    borderRadius: 10,

    overflow: 'hidden',

    elevation: 3, // Android gölge

    shadowColor: '#000', // iOS gölge

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

  title: {

    fontSize: 18,

    fontWeight: 'bold',

  },

  price: {

    fontSize: 16,

    color: '#27ae60',

    marginTop: 5,

    fontWeight: 'bold'

  }

});