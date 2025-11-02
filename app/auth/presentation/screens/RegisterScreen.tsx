import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRegister } from '@/auth/presentation/composables/useRegister';
import { ValidationError } from '@/core/domain/errors/ValidationError';

export const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { mutate: register, isPending, error } = useRegister();

  const handleRegister = () => {
    register(
      { email, password, confirmPassword, firstName, lastName },
      {
        onSuccess: (user) => {
          Alert.alert('Success', `Welcome, ${user.firstName}! Your account has been created.`);
        },
        onError: (error) => {
          if (error instanceof ValidationError) {
            Alert.alert('Validation Error', error.message);
          } else {
            Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
          }
        },
      }
    );
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        editable={!isPending}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        editable={!isPending}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isPending}
      />

      {error && (
        <Text style={styles.errorText}>
          {error instanceof ValidationError ? error.message : 'Registration failed. Please try again.'}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
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
