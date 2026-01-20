"use client";
import React, { useState, useEffect } from 'react';
import { Newspaper, Users, MessageSquare, Tags } from 'lucide-react';
import api from '../../services/api';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        newsCount: 0,
        userCount: 0,
        commentCount: 0,
        categoryCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mocking stats for now or fetching if endpoints exist
                // Based on our controllers, we have:
                // /api/news (all)
                // /api/users (admin only)
                // /api/categories
                // /api/comments (might need admin total, currently article based)

                const [newsRes, usersRes, catsRes] = await Promise.all([
                    api.get('/news'),
                    api.get('/users'),
                    api.get('/categories')
                ]);

                setStats({
                    newsCount: newsRes.data.articles?.length || 0,
                    userCount: usersRes.data.length || 0,
                    commentCount: 0, // Need to implement total comments endpoint or count locally
                    categoryCount: catsRes.data.length || 0
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total News', value: stats.newsCount, icon: Newspaper, color: 'bg-blue-100 text-blue-600' },
        { title: 'Total Users', value: stats.userCount, icon: Users, color: 'bg-green-100 text-green-600' },
        { title: 'Categories', value: stats.categoryCount, icon: Tags, color: 'bg-purple-100 text-purple-600' },
        { title: 'Comments', value: stats.commentCount, icon: MessageSquare, color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
                <p className="text-gray-500">Quick stats of your news application.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-4">Welcome to the News Admin Panel!</h3>
                <p className="text-gray-600 leading-relaxed">
                    From here you can manage all aspects of your news application. Use the sidebar to navigate through columns.
                    You can create new articles, manage categories, moderate user comments, and view registered users.
                </p>
            </div>
        </div>
    );
}
