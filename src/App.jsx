import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Toast } from './components/Layout/Toast';
import { useHRContext } from './contexts/HRContext';
import './styles/globals.css';
import './App.css';

// Import pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import RequestLeave from './pages/RequestLeave';
import ApproveLeave from './pages/ApproveLeave';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const { toast } = useHRContext();

    // Handle navigation from menu clicks
    useEffect(() => {
        const handleNavigation = (e) => {
            if (e.target.classList.contains('menu-item')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page) setCurrentPage(page);
            }
        };

        document.addEventListener('click', handleNavigation);
        return () => document.removeEventListener('click', handleNavigation);
    }, []);

    // Map page to component
    const pageComponents = {
        dashboard: Dashboard,
        employees: Employees,
        departments: Departments,
        roles: Roles,
        'request-leave': RequestLeave,
        'approve-leave': ApproveLeave,
    };

    const pageTitles = {
        dashboard: 'Bảng điều khiển',
        employees: 'Quản lý nhân viên',
        departments: 'Quản lý phòng ban',
        roles: 'Quản lý chức vụ',
        'request-leave': 'Yêu cầu nghỉ phép',
        'approve-leave': 'Phê duyệt phép nghỉ',
    };

    const CurrentPage = pageComponents[currentPage] || Dashboard;

    return (
        <div className="app-container">
            <Sidebar currentPage={currentPage} />
            <div className="main-content">
                <Header title={pageTitles[currentPage]} />
                <main className="page-content">
                    <CurrentPage />
                </main>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}

export default App;