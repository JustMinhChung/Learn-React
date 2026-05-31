import React, { useState } from 'react';
import { useHRContext } from '../contexts/HRContext';
import '../styles/pages.css';

export default function Employees() {
    const { employees, departments } = useHRContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    const filteredEmployees = employees.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = !filterDept || emp.dept === filterDept;
        return matchSearch && matchDept;
    });

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
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
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
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id}>
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
