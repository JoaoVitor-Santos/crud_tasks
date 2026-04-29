import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthActions } from '../contexts/AuthActionsContext';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    registerErrorMessage,
    handleRegister,
    navigateToLogin
  } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterWrapper = async () => {
    setIsLoading(true);
    try {
      await handleRegister();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={registerEmail}
        onChangeText={(text) => {
          setRegisterEmail(text);
          // setErrorMessage(null); // This is now handled in the context
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={registerPassword}
        onChangeText={(text) => {
          setRegisterPassword(text);
          // setErrorMessage(null); // This is now handled in the context
        }}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={registerConfirmPassword}
        onChangeText={(text) => {
          setRegisterConfirmPassword(text);
          // setErrorMessage(null); // This is now handled in the context
        }}
        secureTextEntry
      />
      {registerErrorMessage ? <Text style={styles.errorText}>{registerErrorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegisterWrapper} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Registrando...' : 'Registrar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#cc0000',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default RegisterScreen;