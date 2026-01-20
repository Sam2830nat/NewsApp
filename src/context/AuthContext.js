import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let token = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');

            if (token) {
                setUserToken(token);
                setUser(userInfo ? JSON.parse(userInfo) : null);
                // Optionally validate token with backend here
            }
            setIsLoading(false);
        } catch (e) {
            console.log(`isLogged in error ${e}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userInfo } = response.data;

            setUserToken(token);
            setUser(userInfo);

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            return { success: true };
        } catch (error) {
            console.log('Login error', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token, ...userInfo } = response.data;

            setUserToken(token);
            setUser(userInfo);

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            return { success: true };
        } catch (error) {
            console.log('Register error', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUser(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
