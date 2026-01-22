"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import api from '../../../services/api';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

export default function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        categoryId: '',
        status: 'PUBLISHED'
    });

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await api.get('/news');
            setArticles(response.data.articles || []);

            const catRes = await api.get('/categories');
            setCategories(catRes.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleOpenEdit = (article) => {
        setCurrentArticle(article);
        setFormData({
            title: article.title,
            content: article.content,
            image: article.image || '',
            categoryId: article.categoryId,
            status: article.status
        });
        setModalOpen(true);
    };

    const handleOpenCreate = () => {
        setCurrentArticle(null);
        setFormData({
            title: '',
            content: '',
            image: '',
            categoryId: categories[0]?.id || '',
            status: 'PUBLISHED'
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentArticle) {
                await api.put(`/news/${currentArticle.id}`, formData);
            } else {
                await api.post('/news', formData);
            }
            setModalOpen(false);
            fetchNews();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/news/${currentArticle.id}`);
            setDeleteModalOpen(false);
            fetchNews();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const columns = [
        {
            key: 'image',
            title: 'Image',
            render: (val) => val ? <img src={val} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-100 rounded" />
        },
        { key: 'title', title: 'Title' },
        { key: 'category', title: 'Category', render: (val) => val?.name || 'N/A' },
        { key: 'author', title: 'Author', render: (val) => val?.name || 'Admin' },
        {
            key: 'status',
            title: 'Status',
            render: (val) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {val}
                </span>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setCurrentArticle(row); setDeleteModalOpen(true); }} className="text-red-500 hover:text-red-600">
                        < Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">News Articles</h1>
                    <p className="text-gray-500">Manage your published and draft articles.</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Article
                </Button>
            </div>

            <Table
                columns={columns}
                data={articles}
                loading={loading}
                emptyMessage="No articles found. Start by creating one!"
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={currentArticle ? 'Edit Article' : 'Create Article'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{currentArticle ? 'Save Changes' : 'Create'}</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Input
                        label="Image URL"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
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
                        <Button variant="danger" onClick={handleDelete}>Delete Article</Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this article? This action cannot be undone.</p>
                <p className="mt-2 font-bold text-gray-900">{currentArticle?.title}</p>
            </Modal>
        </div>
    );
}
