import React, { useState, useEffect } from 'react';
import { useHRContext } from '../contexts/HRContext';
import '../styles/pages.css';

export default function Employees() {
    const { employees, departments } = useHRContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterDept]);

    const filteredEmployees = employees.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = !filterDept || emp.dept === filterDept;
        return matchSearch && matchDept;
    });

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const displayedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, minWidth: '250px' }}
                />
                <select
                    className="form-control"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    style={{ flex: 1, minWidth: '200px' }}
                >
                    <option value="">Tất cả phòng ban</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                </select>
                <button className="btn btn-primary">➕ Thêm nhân viên</button>
            </div>

            {/* Table */}
            {filteredEmployees.length > 0 ? (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã NV</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Phòng ban</th>
                                    <th>Chức vụ</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedEmployees.map((emp, index) => (
                                    <tr key={emp.id}>
                                        <td><strong>{(currentPage - 1) * itemsPerPage + index + 1}</strong></td>
                                        <td>{emp.id}</td>
                                        <td>{emp.name}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.dept}</td>
                                        <td>{emp.role}</td>
                                        <td>
                                            <span className={`badge badge-${emp.status === "Đang làm việc" ? "success" : emp.status === "Nghỉ phép" ? "warning" : "danger"}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-sm" style={{ backgroundColor: 'var(--color-blue)', color: 'white' }}>✏️</button>
                                            <button className="btn btn-sm btn-danger">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</strong> trong tổng số <strong>{filteredEmployees.length}</strong> nhân sự
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button 
                                    className="btn btn-sm" 
                                    onClick={handlePrevPage} 
                                    disabled={currentPage === 1}
                                    style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    ◀ Trước
                                </button>
                                <span style={{ fontWeight: '500' }}>Trang {currentPage} / {totalPages}</span>
                                <button 
                                    className="btn btn-sm" 
                                    onClick={handleNextPage} 
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    Sau ▶
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <h3>Không có nhân viên</h3>
                    <p>Hãy thêm nhân viên đầu tiên</p>
                </div>
            )}
        </div>
    );
}
