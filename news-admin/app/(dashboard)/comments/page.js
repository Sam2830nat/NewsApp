"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import api from '../../../services/api';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Backend currently doesn't have a "get all comments" across articles
            // We might need to implement this or mock it by fetching news and extracting comments
            // For this simple panel, let's assume we can fetch them or we'll need to update backend
            const response = await api.get('/news');
            const allComments = [];
            response.data.articles.forEach(article => {
                if (article.comments) {
                    article.comments.forEach(c => {
                        allComments.push({
                            ...c,
                            articleTitle: article.title,
                            articleId: article.id
                        });
                    });
                }
            });
            setComments(allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

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
        { key: 'user', title: 'User', render: (val) => val?.name || 'Unknown' },
        { key: 'content', title: 'Comment' },
        { key: 'articleTitle', title: 'Article', render: (val) => <span className="truncate max-w-xs block">{val}</span> },
        { key: 'createdAt', title: 'Date', render: (val) => new Date(val).toLocaleDateString() },
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
            <div>
                <h1 className="text-2xl font-bold">Comments Moderation</h1>
                <p className="text-gray-500">Moderate and manage user comments across articles.</p>
            </div>

            <Table
                columns={columns}
                data={comments}
                loading={loading}
                emptyMessage="No comments found."
            />
        </div>
    );
}
