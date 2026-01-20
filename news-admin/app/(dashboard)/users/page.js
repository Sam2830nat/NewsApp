"use client";
import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });

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

    const handleOpenCreate = () => {
        setCurrentUser(null);
        setFormData({ name: '', email: '', password: '', role: 'USER' });
        setModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Leave blank unless changing
            role: user.role
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await api.put(`/users/${currentUser.id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            setModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/users/${currentUser.id}`);
            setDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const columns = [
        {
            key: 'avatar',
            title: 'User',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.id}</p>
                    </div>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {val}
                    </span>
                </div>
            )
        },
        { key: 'createdAt', title: 'Joined Date', render: (val) => new Date(val).toLocaleDateString() },
        {
            key: 'actions',
            title: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setCurrentUser(row); setDeleteModalOpen(true); }}
                        className="text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Registered Users</h1>
                    <p className="text-gray-500">Manage all registered accounts and roles.</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </Button>
            </div>

            <Table
                columns={columns}
                data={users}
                loading={loading}
                emptyMessage="No users found."
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={currentUser ? 'Edit User' : 'Add New User'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{currentUser ? 'Save Changes' : 'Create User'}</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                    />
                    <Input
                        label={currentUser ? "New Password (leave blank to keep current)" : "Password"}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                    />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="USER">User (Standard)</option>
                            <option value="ADMIN">Admin (Full Access)</option>
                        </select>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete User</Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="font-bold text-red-700">{currentUser?.name}</p>
                    <p className="text-sm text-red-600">{currentUser?.email}</p>
                </div>
            </Modal>
        </div>
    );
}
