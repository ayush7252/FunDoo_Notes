import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({ navigation }: any) => {
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === 'Loading...') return 'Loading';
        if (prev === 'Loading') return 'Loading.';
        if (prev === 'Loading.') return 'Loading..';
        return 'Loading...';
      });
    }, 500);

    const timer = setTimeout(() => {
      const user = auth().currentUser;
      if (user) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('LoginScreen');
      }
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FunDoo Notes</Text>
      <Text style={styles.subtitle}>Your Smart Note-Taking App</Text>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c51bf" />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>

      <Text style={styles.footerText}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c51bf',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4c51bf',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#999',
  },
});

export default SplashScreen;