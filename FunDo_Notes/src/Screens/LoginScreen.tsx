import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { auth } from '../Firebase/Api'; 
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Navigate to home screen on success
      navigation.navigate('Home');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleAuthError = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-email':
        setError('Invalid email format');
        break;
      case 'auth/user-disabled':
        setError('Account disabled');
        break;
      case 'auth/user-not-found':
        setError('User not found');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password');
        break;
      case 'auth/too-many-requests':
        setError('Too many attempts. Try again later');
        break;
      default:
        setError('Login failed. Please try again');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Sent',
        `A password reset link has been sent to ${email}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setError('Failed to send reset email');
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={handlePasswordReset}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
    color:'#000'
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#4c51bf',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 10,
  },
  optionsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    color: '#4c51bf',
    fontWeight: '500',
  },
});

export default LoginScreen;