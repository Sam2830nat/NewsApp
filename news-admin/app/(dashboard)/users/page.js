"use client";
import React, { useState, useEffect } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import api from '../../../services/api';
import Table from '../../../components/ui/Table';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            key: 'avatar',
            title: 'User',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">{row.name}</span>
                </div>
            )
        },
        { key: 'email', title: 'Email' },
        {
            key: 'role',
            title: 'Role',
            render: (val) => (
                <div className="flex items-center gap-1">
                    {val === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-orange-500" />}
                    <span className={val === 'ADMIN' ? 'text-orange-600 font-semibold' : 'text-gray-600'}>
                        {val}
                    </span>
                </div>
            )
        },
        { key: 'createdAt', title: 'Joined Date', render: (val) => new Date(val).toLocaleDateString() },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Registered Users</h1>
                <p className="text-gray-500">View all users registered on your platform.</p>
            </div>

            <Table
                columns={columns}
                data={users}
                loading={loading}
                emptyMessage="No users found."
            />
        </div>
    );
}
