"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        if (token && adminData) {
            setAdmin(JSON.parse(adminData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...data } = response.data;

            if (data.role !== 'ADMIN') {
                throw new Error('Access denied. Admin role required.');
            }

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminData', JSON.stringify(data));
            setAdmin(data);
            router.push('/');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setAdmin(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
