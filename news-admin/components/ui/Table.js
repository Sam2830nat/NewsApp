import React from 'react';

export default function Table({ columns, data, loading, emptyMessage = 'No data found' }) {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="px-6 py-4 border-b">
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-gray-600">
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
