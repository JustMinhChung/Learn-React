import React, { useState } from 'react';
import { useHRContext } from '../contexts/HRContext';
import '../styles/sidebar.css';

export const Sidebar = ({ currentPage = 'dashboard' }) => {
    const { notifications, theme, toggleTheme } = useHRContext();
    const [showNotifications, setShowNotifications] = useState(false);

    const pendingApprovalsCount = notifications.filter(n => !n.read).length;

    const menuItems = [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: '📊', path: '/' },
        { id: 'employees', label: 'Nhân viên', icon: '👥', path: '/employees' },
        { id: 'departments', label: 'Phòng ban', icon: '🏢', path: '/departments' },
        { id: 'roles', label: 'Chức vụ', icon: '💼', path: '/roles' },
        { id: 'request-leave', label: 'Yêu cầu nghỉ phép', icon: '📅', path: '/request-leave' },
        { id: 'approve-leave', label: 'Phê duyệt phép', icon: '✅', path: '/approve-leave' }
    ];

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-logo">💼</div>
                <h2>HR Portal</h2>
            </div>

            {/* Menu */}
            <nav className="sidebar-menu">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href={item.path}
                        className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
                        data-page={item.id}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                        {item.id === 'approve-leave' && pendingApprovalsCount > 0 && (
                            <span className="badge">{pendingApprovalsCount}</span>
                        )}
                    </a>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <button 
                    className="theme-btn"
                    onClick={toggleTheme}
                    title="Chuyển đổi chế độ tối/sáng"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <div className="dropdown-menu">
                    <button 
                        className="notif-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNotifications(!showNotifications);
                        }}
                    >
                        🔔
                        {pendingApprovalsCount > 0 && <span className="badge">{pendingApprovalsCount}</span>}
                    </button>
                    {showNotifications && (
                        <div className="notif-dropdown">
                            {notifications.length > 0 ? (
                                <>
                                    <div className="notif-list">
                                        {notifications.slice(0, 5).map(notif => (
                                            <div key={notif.id} className="notif-item">
                                                <span>{notif.text}</span>
                                                <small>{notif.time}</small>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        className="clear-notif-btn"
                                        onClick={() => {
                                            // clearNotifications();
                                            setShowNotifications(false);
                                        }}
                                    >
                                        Xóa tất cả
                                    </button>
                                </>
                            ) : (
                                <div className="notif-empty">Không có thông báo</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
