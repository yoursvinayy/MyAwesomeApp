import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password.trim());
            const user = userCredential.user;
            const token = await user.getIdToken(); // Get the user's token
            console.log('token is here',token)
            // Store token in AsyncStorage
            await AsyncStorage.setItem('userToken', token);
            console.log('User logged in and token stored!');
            navigation.navigate('Home');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            } else {
                console.error(error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await auth().signOut(); // Firebase sign out
            await AsyncStorage.removeItem('userToken'); // Clear token from AsyncStorage
            console.log('User logged out and token cleared');
            Alert.alert('Logged out', 'You have been logged out successfully.');
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error('Error logging out:', error.message);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor='white'
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor='white'
            />
            <Button
                title="Login"
                onPress={handleLogin}
                color="#007BFF"
            />
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} style={styles.toggleText}>
                <Text style={styles.toggleText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: 'white',
        backgroundColor: '#222',
    },
    toggleText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#007BFF',
    },
});

export default LoginScreen;
