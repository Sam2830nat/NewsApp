"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Newspaper,
    Users,
    Settings,
    MessageSquare,
    Tags,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'News Articles', icon: Newspaper, href: '/news' },
    { name: 'Categories', icon: Tags, href: '/categories' },
    { name: 'Comments', icon: MessageSquare, href: '/comments' },
    { name: 'Users', icon: Users, href: '/users' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-900 text-white">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-orange-500">NewsAdmin</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-orange-500 text-white'
                                    : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-gray-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
