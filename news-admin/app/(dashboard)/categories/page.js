"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name });
            setModalOpen(false);
            setName('');
            fetchCategories();
        } catch (error) {
            alert('Failed to create category');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This might affect articles in this category.')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const columns = [
        { key: 'name', title: 'Category Name' },
        { key: 'newsCount', title: 'News Count', render: (_, row) => row._count?.articles || 0 },
        {
            key: 'actions',
            title: 'Actions',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:text-red-600"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-gray-500">Organize your news by categories.</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <Table
                columns={columns}
                data={categories}
                loading={loading}
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Add New Category"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Technology, Sports"
                    />
                </form>
            </Modal>
        </div>
    );
}
