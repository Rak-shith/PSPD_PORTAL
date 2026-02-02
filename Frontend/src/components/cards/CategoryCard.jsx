import React from 'react';

export default function CategoryCard({ category, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
        >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                {category.name}
            </h3>
            {category.description && (
                <p className="text-sm text-gray-500 mt-2">{category.description}</p>
            )}
        </div>
    );
}
