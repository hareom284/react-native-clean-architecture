import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLogin } from '@/auth/presentation/composables/useLogin';
import { ValidationError } from '@/core/domain/errors/ValidationError';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = () => {
    login(
      { email, password },
      {
        onSuccess: (user) => {
          Alert.alert('Success', `Welcome back, ${user.firstName}!`);
        },
        onError: (error) => {
          if (error instanceof ValidationError) {
            Alert.alert('Validation Error', error.message);
          } else {
            Alert.alert('Login Failed', error.message || 'An error occurred during login');
          }
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isPending}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isPending}
      />

      {error && (
        <Text style={styles.errorText}>
          {error instanceof ValidationError ? error.message : 'Login failed. Please try again.'}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  },
});
