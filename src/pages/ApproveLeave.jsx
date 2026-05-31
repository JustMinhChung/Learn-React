import React from 'react';
import { useHRContext } from '../contexts/HRContext';

export default function ApproveLeave() {
    const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useHRContext();

    const pendingRequests = leaveRequests.filter(r => r.status === "Chờ duyệt");

    return (
        <div>
            {pendingRequests.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {pendingRequests.map(request => (
                        <div key={request.id} className="card">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <p><strong>Nhân viên:</strong> {request.empName}</p>
                                    <p><strong>Phòng ban:</strong> {request.empDept}</p>
                                </div>
                                <div>
                                    <p><strong>Loại phép:</strong> {request.type}</p>
                                    <p><strong>Số ngày:</strong> <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>{request.days} ngày</span></p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                                <p><strong>Từ:</strong> {request.startDate} <strong>Đến:</strong> {request.endDate}</p>
                                <p><strong>Lý do:</strong> {request.reason}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Gửi lúc: {request.submittedAt}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                    className="btn btn-success"
                                    onClick={() => approveLeaveRequest(request.id)}
                                >
                                    ✅ Phê duyệt
                                </button>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => rejectLeaveRequest(request.id)}
                                >
                                    ❌ Từ chối
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">✅</div>
                    <h3>Không có yêu cầu chờ phê duyệt</h3>
                    <p>Tất cả yêu cầu đã được xử lý</p>
                </div>
            )}
        </div>
    );
}
