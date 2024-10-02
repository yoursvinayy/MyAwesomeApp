import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState(''); // State for user's name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password.trim());
      const user = userCredential.user;

      // Update user's display name
      await user.updateProfile({
        displayName: name, // Set display name
      });

      // Store user data in Firestore
      await firestore().collection('signup').doc(user.uid).set({
        displayName: name,
        email: user.email,
        createdAt: firestore.FieldValue.serverTimestamp(), // Store creation time
      });

      console.log('User account created and data stored in Firestore');
      navigation.navigate('LoginScreen');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        Alert.alert('Error', 'That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        Alert.alert('Error', 'That email address is invalid!');
      }

      console.error(error);
      Alert.alert('Error', error.message); // Show error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor='white' // Placeholder color for dark theme
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor='white' // Placeholder color for dark theme
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor='white' // Placeholder color for dark theme
      />
      <Button title="Sign Up" onPress={handleSignUp} color="#ff8c00" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000', // Dark background
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white', // White text color
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white', // White text color in input
    backgroundColor: '#222', // Dark input background
  },
});

export default SignUpScreen;
