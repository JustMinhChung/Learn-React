import React, { useState } from 'react';
import { useHRContext } from '../contexts/HRContext';
import { calculateLeaveDays } from '../utils/helpers';

export default function RequestLeave() {
    const { employees, addLeaveRequest } = useHRContext();
    const [formData, setFormData] = useState({
        empId: '',
        type: 'Nghỉ phép năm',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const selectedEmployee = employees.find(e => e.id === formData.empId);
    const leaveDays = calculateLeaveDays(formData.startDate, formData.endDate);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.empId || !formData.startDate || !formData.endDate) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        addLeaveRequest({
            id: `LR${Date.now()}`,
            empId: formData.empId,
            empName: selectedEmployee.name,
            empDept: selectedEmployee.dept,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            days: leaveDays,
            reason: formData.reason,
            status: "Chờ duyệt",
            submittedAt: new Date().toLocaleString('vi-VN')
        });

        setFormData({
            empId: '',
            type: 'Nghỉ phép năm',
            startDate: '',
            endDate: '',
            reason: ''
        });

        alert('Yêu cầu nghỉ phép đã được gửi');
    };

    return (
        <div>
            <div className="card" style={{ maxWidth: '500px', marginBottom: '24px' }}>
                <h3>Gửi yêu cầu nghỉ phép</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
                    <div className="form-group">
                        <label>Nhân viên</label>
                        <select
                            className="form-control"
                            value={formData.empId}
                            onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                        >
                            <option value="">-- Chọn nhân viên --</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                            ))}
                        </select>
                    </div>

                    {selectedEmployee && (
                        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                            <p><strong>Phòng ban:</strong> {selectedEmployee.dept}</p>
                            <p><strong>Phép còn lại:</strong> <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>{selectedEmployee.remainingLeaves} ngày</span></p>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Loại phép</label>
                        <select
                            className="form-control"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Nghỉ phép năm</option>
                            <option>Nghỉ ốm</option>
                            <option>Nghỉ không lương</option>
                            <option>Nghỉ lễ</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày kết thúc</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {formData.startDate && formData.endDate && (
                        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', textAlign: 'center' }}>
                            <strong style={{ color: 'var(--color-primary)' }}>{leaveDays} ngày</strong>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Lý do</label>
                        <textarea
                            className="form-control"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            rows="3"
                            placeholder="Nhập lý do xin nghỉ phép..."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Gửi yêu cầu
                    </button>
                </form>
            </div>
        </div>
    );
}
