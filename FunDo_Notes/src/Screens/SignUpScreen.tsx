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

const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      Alert.alert(
        'Account Created',
        'Your account has been successfully created!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill all fields');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleAuthError = (error: any) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('Email already in use');
        break;
      case 'auth/invalid-email':
        setError('Invalid email format');
        break;
      case 'auth/weak-password':
        setError('Password is too weak');
        break;
      case 'auth/operation-not-allowed':
        setError('Operation not allowed');
        break;
      default:
        setError('Signup failed. Please try again');
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// Reuse the same styles as LoginScreen
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
    justifyContent: 'center',
  },
  linkText: {
    color: '#4c51bf',
    fontWeight: '500',
  },
});

export default SignupScreen;