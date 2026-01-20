"use client";
import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
                        {footer}
                    </div>
                )}
                {!footer && (
                    <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
