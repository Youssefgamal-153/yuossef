import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center py-8 animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
            <p className="text-sm text-gray-500">
                Designed & Developed by Youssef Gamal © 2025
            </p>
        </footer>
    );
};
