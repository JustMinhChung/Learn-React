import React from 'react';
import { useHRContext } from '../contexts/HRContext';
import '../styles/pages.css';

export default function Dashboard() {
    const { employees, leaveRequests, departments, activities } = useHRContext();

    const totalEmployees = employees.length;
    const attendanceRate = "95%";
    const leavesToday = employees.filter(e => e.status === "Nghỉ phép").length;
    const pendingRequests = leaveRequests.filter(r => r.status === "Chờ duyệt").length;

    const stats = [
        { icon: '👥', label: 'Tổng nhân viên', value: totalEmployees, color: 'primary' },
        { icon: '📊', label: 'Tỉ lệ hiện diện', value: attendanceRate, color: 'success' },
        { icon: '🏖️', label: 'Đang nghỉ phép', value: leavesToday, color: 'warning' },
        { icon: '⏳', label: 'Chờ phê duyệt', value: pendingRequests, color: 'danger' }
    ];

    return (
        <div>
            {/* Statistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            {stat.label}
                        </div>
                        <div className="value" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Department Distribution */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Department Cards */}
                <div className="card">
                    <h3>Phân bố nhân viên theo phòng ban</h3>
                    <div style={{ marginTop: '16px' }}>
                        {departments.map(dept => {
                            const deptEmployees = employees.filter(e => e.dept === dept.name).length;
                            return (
                                <div key={dept.id} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span>{dept.name}</span>
                                        <strong>{deptEmployees}</strong>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div 
                                            style={{
                                                height: '100%',
                                                backgroundColor: 'var(--color-primary)',
                                                width: `${(deptEmployees / totalEmployees) * 100}%`,
                                                transition: 'width 0.3s ease'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="card">
                    <h3>Hoạt động gần đây</h3>
                    <div style={{ marginTop: '16px' }}>
                        {activities.length > 0 ? (
                            activities.slice(0, 5).map(activity => (
                                <div key={activity.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <span style={{ 
                                            fontSize: '12px',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            marginTop: '6px',
                                            backgroundColor: activity.type === 'success' ? 'var(--color-success)' : 
                                                           activity.type === 'warning' ? 'var(--color-warning)' :
                                                           activity.type === 'danger' ? 'var(--color-danger)' : 
                                                           'var(--color-primary)'
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>
                                                {activity.text}
                                            </p>
                                            <small style={{ color: 'var(--text-muted)' }}>{activity.time}</small>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Không có hoạt động</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Leave Requests Summary */}
            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Tóm tắt yêu cầu nghỉ phép</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                            {leaveRequests.filter(r => r.status === "Đã duyệt").length}
                        </div>
                        <small style={{ color: 'var(--text-muted)' }}>Đã phê duyệt</small>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-warning)' }}>
                            {leaveRequests.filter(r => r.status === "Chờ duyệt").length}
                        </div>
                        <small style={{ color: 'var(--text-muted)' }}>Đang chờ</small>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-danger)' }}>
                            {leaveRequests.filter(r => r.status === "Bị từ chối").length}
                        </div>
                        <small style={{ color: 'var(--text-muted)' }}>Bị từ chối</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
