import React from 'react';
import '../styles/toast.css';

export const Toast = ({ message, type = 'info' }) => {
    if (!message) return null;

    const typeClass = {
        success: 'toast-success',
        error: 'toast-error',
        warning: 'toast-warning',
        info: 'toast-info'
    }[type] || 'toast-info';

    return (
        <div className={`toast ${typeClass}`}>
            <span>{message}</span>
        </div>
    );
};
