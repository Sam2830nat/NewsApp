import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        setError(null);
        const result = await register(name, email, password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h1' style={styles.header}>Create Account</Text>

            {error && (
                <Text status='danger' style={styles.error}>{error}</Text>
            )}

            <Input
                style={styles.input}
                placeholder='Full Name'
                value={name}
                onChangeText={setName}
            />
            <Input
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
            />
            <Input
                style={styles.input}
                placeholder='Password'
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
            />

            <Button style={styles.button} onPress={handleRegister}>
                SIGN UP
            </Button>

            <Button
                appearance='ghost'
                status='basic'
                onPress={() => navigation.goBack()}
            >
                Already have an account? Login
            </Button>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    error: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default RegisterScreen;
