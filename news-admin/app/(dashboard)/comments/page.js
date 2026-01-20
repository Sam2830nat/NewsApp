"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, ExternalLink, MessageSquare } from 'lucide-react';
import api from '../../../services/api';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [editContent, setEditContent] = useState('');

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/comments');
            setComments(response.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleOpenEdit = (comment) => {
        setCurrentComment(comment);
        setEditContent(comment.content);
        setEditModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/comments/${currentComment.id}`, { content: editContent });
            setEditModalOpen(false);
            fetchComments();
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            await api.delete(`/comments/${id}`);
            fetchComments();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const columns = [
        {
            key: 'user',
            title: 'User',
            render: (val) => (
                <div>
                    <p className="font-medium text-gray-900">{val?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{val?.email}</p>
                </div>
            )
        },
        {
            key: 'content',
            title: 'Comment',
            render: (val) => <p className="max-w-md text-sm text-gray-700">{val}</p>
        },
        {
            key: 'article',
            title: 'Article',
            render: (val) => (
                <div className="flex items-center gap-1 group">
                    <span className="truncate max-w-[150px] block text-xs text-gray-500">{val?.title}</span>
                </div>
            )
        },
        {
            key: 'parentId',
            title: 'Type',
            render: (val) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${!val ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {!val ? 'Root' : 'Reply'}
                </span>
            )
        },
        { key: 'createdAt', title: 'Date', render: (val) => new Date(val).toLocaleDateString() },
        {
            key: 'actions',
            title: 'Actions',
            render: (_, row) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
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
            <div>
                <h1 className="text-2xl font-bold">Comments Moderation</h1>
                <p className="text-gray-500">Manage and edit user feedback across all articles.</p>
            </div>

            <Table
                columns={columns}
                data={comments}
                loading={loading}
                emptyMessage="No comments found."
            />

            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Comment"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate}>Save Changes</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 italic text-sm text-gray-500">
                        "{currentComment?.content}"
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Modified Content</label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
