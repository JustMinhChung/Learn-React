import React, { useState } from 'react';
import { useHRContext } from '../contexts/HRContext';

export default function Departments() {
    const { departments } = useHRContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm phòng ban..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button className="btn btn-primary">➕ Thêm phòng ban</button>
            </div>

            {filteredDepartments.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filteredDepartments.map(dept => (
                        <div key={dept.id} className="card">
                            <h3>{dept.name}</h3>
                            <p>{dept.desc}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button className="btn btn-sm" style={{ backgroundColor: 'var(--color-blue)', color: 'white' }}>✏️</button>
                                <button className="btn btn-sm btn-danger">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">🏢</div>
                    <h3>Không có phòng ban</h3>
                </div>
            )}
        </div>
    );
}
