import React, { useState } from 'react';
import { useHRContext } from '../contexts/HRContext';

export default function Roles() {
    const { roles, departments } = useHRContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    const filteredRoles = roles.filter(role => {
        const matchSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = !filterDept || role.dept === filterDept;
        return matchSearch && matchDept;
    });

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm chức vụ..."
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
                <button className="btn btn-primary">➕ Thêm chức vụ</button>
            </div>

            {filteredRoles.length > 0 ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Chức vụ</th>
                                <th>Phòng ban</th>
                                <th>Mô tả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map(role => (
                                <tr key={role.id}>
                                    <td><strong>{role.name}</strong></td>
                                    <td>{role.dept}</td>
                                    <td>{role.desc}</td>
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
                    <div className="empty-state-icon">💼</div>
                    <h3>Không có chức vụ</h3>
                </div>
            )}
        </div>
    );
}
