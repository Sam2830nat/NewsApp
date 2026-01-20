"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
    const { admin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !admin) {
            router.push('/login');
        }
    }, [admin, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!admin) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Welcome, {admin.name}</span>
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                            {admin.name.charAt(0)}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
