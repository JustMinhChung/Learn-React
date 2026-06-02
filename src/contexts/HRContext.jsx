import React, { createContext, useState, useContext, useEffect } from 'react';

const HRContext = createContext();

export const HRProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [activities, setActivities] = useState([]);
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem("notifications");
            return saved ? JSON.parse(saved) : [
                { id: "n-1", text: "Yêu cầu phép mới từ Nguyễn Minh Tuấn đang chờ duyệt.", time: "08:15", read: false },
                { id: "n-2", text: "Yêu cầu phép mới từ Phạm Thanh Hương đang chờ duyệt.", time: "14:45", read: false }
            ];
        } catch (e) {
            return [];
        }
    });
    const [theme, setTheme] = useState(() => 
        localStorage.getItem("hr_portal_theme") || "light"
    );
    const [toast, setToast] = useState(null);

    const API_BASE = 'http://localhost:3000/api';

    // Helper functions for mapping
    const mapEmployeeToCamelCase = (emp) => ({
        id: emp.id,
        name: emp.name,
        gender: emp.gender,
        email: emp.email,
        phone: emp.phone,
        dept: emp.dept,
        role: emp.role,
        joinDate: emp.join_date,
        salary: emp.salary,
        totalLeaves: emp.total_leaves,
        remainingLeaves: emp.remaining_leaves,
        status: emp.status
    });

    const mapLeaveRequestToCamelCase = (req) => ({
        id: req.id,
        empId: req.emp_id,
        empName: req.emp_name,
        empDept: req.emp_dept,
        type: req.type,
        startDate: req.start_date,
        endDate: req.end_date,
        days: req.days,
        reason: req.reason,
        status: req.status,
        submittedAt: req.submitted_at
    });

    // Fetch all data from API
    const loadAllData = async () => {
        try {
            const [empRes, leaveRes, actRes, roleRes, deptRes] = await Promise.all([
                fetch(`${API_BASE}/employees`),
                fetch(`${API_BASE}/leave-requests`),
                fetch(`${API_BASE}/activities`),
                fetch(`${API_BASE}/roles`),
                fetch(`${API_BASE}/departments`)
            ]);

            if (!empRes.ok || !leaveRes.ok || !actRes.ok || !roleRes.ok || !deptRes.ok) {
                throw new Error("Mất kết nối đến cơ sở dữ liệu backend!");
            }

            const empData = await empRes.json();
            const leaveData = await leaveRes.json();
            const actData = await actRes.json();
            const roleData = await roleRes.json();
            const deptData = await deptRes.json();

            setEmployees(empData.map(mapEmployeeToCamelCase));
            setLeaveRequests(leaveData.map(mapLeaveRequestToCamelCase));
            setActivities(actData);
            setRoles(roleData);
            setDepartments(deptData);
        } catch (error) {
            console.error("Error loading data from API:", error);
            showToast("Không thể kết nối đến máy chủ API backend!", "error");
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    // Persist notifications
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("hr_portal_theme", theme);
    }, [theme]);

    const showToast = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addEmployee = async (employee) => {
        try {
            const response = await fetch(`${API_BASE}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: employee.name,
                    gender: employee.gender,
                    email: employee.email,
                    phone: employee.phone,
                    dept: employee.dept,
                    role: employee.role,
                    join_date: employee.joinDate,
                    salary: employee.salary,
                    total_leaves: employee.totalLeaves,
                    status: employee.status
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Thêm nhân viên thất bại");
            }

            showToast(`Nhân viên mới ${employee.name} được thêm thành công!`, "success");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const updateEmployee = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_BASE}/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedData.name,
                    gender: updatedData.gender,
                    email: updatedData.email,
                    phone: updatedData.phone,
                    dept: updatedData.dept,
                    role: updatedData.role,
                    join_date: updatedData.joinDate,
                    salary: updatedData.salary,
                    total_leaves: updatedData.totalLeaves,
                    status: updatedData.status
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Cập nhật nhân viên thất bại");
            }

            showToast(`Cập nhật thông tin nhân viên ${updatedData.name || ''} thành công!`, "success");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const deleteEmployee = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/employees/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Xóa nhân viên thất bại");
            }

            showToast("Hồ sơ nhân viên đã được chuyển thành Đã nghỉ việc.", "warning");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const addLeaveRequest = async (request) => {
        try {
            const response = await fetch(`${API_BASE}/leave-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emp_id: request.empId,
                    type: request.type,
                    start_date: request.startDate,
                    end_date: request.endDate,
                    days: request.days,
                    reason: request.reason
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Gửi yêu cầu nghỉ phép thất bại");
            }

            showToast(`Gửi yêu cầu nghỉ phép từ ${request.empName} thành công!`, "success");
            addNotification(`Yêu cầu phép mới từ ${request.empName} đang chờ duyệt.`);
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const updateLeaveRequest = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_BASE}/leave-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: updatedData.status
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Cập nhật yêu cầu thất bại");
            }

            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const approveLeaveRequest = async (id) => {
        await updateLeaveRequest(id, { status: "Đã duyệt" });
        showToast("Yêu cầu nghỉ phép đã được phê duyệt.", "success");
    };

    const rejectLeaveRequest = async (id) => {
        await updateLeaveRequest(id, { status: "Từ chối" });
        showToast("Yêu cầu nghỉ phép đã bị từ chối.", "warning");
    };

    const addRole = async (role) => {
        try {
            const response = await fetch(`${API_BASE}/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: role.name,
                    dept: role.dept,
                    desc: role.desc
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Thêm chức vụ thất bại");
            }

            showToast(`Chức vụ mới ${role.name} được thêm thành công!`, "success");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const updateRole = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_BASE}/roles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedData.name,
                    dept: updatedData.dept,
                    desc: updatedData.desc
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Cập nhật chức vụ thất bại");
            }

            showToast(`Cập nhật chức vụ ${updatedData.name || ''} thành công!`, "success");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const deleteRole = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/roles/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Xóa chức vụ thất bại");
            }

            showToast("Đã xóa chức vụ thành công.", "warning");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const addDepartment = async (department) => {
        try {
            const response = await fetch(`${API_BASE}/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: department.name,
                    desc: department.desc
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Thêm phòng ban thất bại");
            }

            showToast(`Phòng ban mới ${department.name} được thêm thành công!`, "success");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const updateDepartment = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_BASE}/departments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedData.name,
                    desc: updatedData.desc
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Cập nhật phòng ban thất bại");
            }

            showToast(`Cập nhật phòng ban ${updatedData.name || ''} thành công!`, "success");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const deleteDepartment = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/departments/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Xóa phòng ban thất bại");
            }

            showToast("Đã xóa phòng ban thành công.", "warning");
            await loadAllData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const addActivity = async (type, text) => {
        await loadAllData();
    };

    const addNotification = (text) => {
        const newNotif = {
            id: `n-${Date.now()}`,
            text,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            read: false
        };
        setNotifications([newNotif, ...notifications]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const value = {
        // State
        employees,
        leaveRequests,
        roles,
        departments,
        activities,
        notifications,
        theme,
        toast,

        // Employee actions
        addEmployee,
        updateEmployee,
        deleteEmployee,

        // Leave Request actions
        addLeaveRequest,
        updateLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,

        // Role actions
        addRole,
        updateRole,
        deleteRole,

        // Department actions
        addDepartment,
        updateDepartment,
        deleteDepartment,

        // Other actions
        addActivity,
        addNotification,
        clearNotifications,
        toggleTheme,
        showToast
    };

    return <HRContext.Provider value={value}>{children}</HRContext.Provider>;
};

export const useHRContext = () => {
    const context = useContext(HRContext);
    if (!context) {
        throw new Error("useHRContext must be used within HRProvider");
    }
    return context;
};
