import React, { createContext, useState, useContext, useEffect } from 'react';
import { AppStore } from '../utils/storage';
import { 
    DEFAULT_EMPLOYEES, 
    DEFAULT_LEAVE_REQUESTS, 
    DEFAULT_ROLES, 
    DEFAULT_DEPARTMENTS, 
    DEFAULT_ACTIVITIES 
} from '../utils/mockData';

const HRContext = createContext();

export const HRProvider = ({ children }) => {
    const [employees, setEmployees] = useState(() => 
        AppStore.get("employees", DEFAULT_EMPLOYEES)
    );
    const [leaveRequests, setLeaveRequests] = useState(() =>
        AppStore.get("leave_requests", DEFAULT_LEAVE_REQUESTS)
    );
    const [roles, setRoles] = useState(() =>
        AppStore.get("roles", DEFAULT_ROLES)
    );
    const [departments, setDepartments] = useState(() =>
        AppStore.get("departments", DEFAULT_DEPARTMENTS)
    );
    const [activities, setActivities] = useState(() =>
        AppStore.get("activities", DEFAULT_ACTIVITIES)
    );
    const [notifications, setNotifications] = useState(() =>
        AppStore.get("notifications", [
            { id: "n-1", text: "Yêu cầu phép mới từ Nguyễn Minh Tuấn đang chờ duyệt.", time: "08:15", read: false },
            { id: "n-2", text: "Yêu cầu phép mới từ Phạm Thanh Hương đang chờ duyệt.", time: "14:45", read: false }
        ])
    );
    const [theme, setTheme] = useState(() => 
        localStorage.getItem("hr_portal_theme") || "light"
    );
    const [toast, setToast] = useState(null);

    // Persist data to localStorage whenever state changes
    useEffect(() => {
        AppStore.set("employees", employees);
    }, [employees]);

    useEffect(() => {
        AppStore.set("leave_requests", leaveRequests);
    }, [leaveRequests]);

    useEffect(() => {
        AppStore.set("roles", roles);
    }, [roles]);

    useEffect(() => {
        AppStore.set("departments", departments);
    }, [departments]);

    useEffect(() => {
        AppStore.set("activities", activities);
    }, [activities]);

    useEffect(() => {
        AppStore.set("notifications", notifications);
    }, [notifications]);

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("hr_portal_theme", theme);
    }, [theme]);

    const addEmployee = (employee) => {
        setEmployees([...employees, employee]);
        addActivity("success", `Nhân viên mới ${employee.name} được thêm vào hệ thống.`);
    };

    const updateEmployee = (id, updatedData) => {
        setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
        addActivity("info", `Thông tin nhân viên ${updatedData.name || 'đã được'} cập nhật.`);
    };

    const deleteEmployee = (id) => {
        const emp = employees.find(e => e.id === id);
        setEmployees(employees.filter(e => e.id !== id));
        if (emp) addActivity("warning", `Nhân viên ${emp.name} đã bị xóa.`);
    };

    const addLeaveRequest = (request) => {
        setLeaveRequests([...leaveRequests, request]);
        addActivity("warning", `Yêu cầu nghỉ phép từ ${request.empName} đang chờ duyệt.`);
        addNotification(`Yêu cầu phép mới từ ${request.empName} đang chờ duyệt.`);
    };

    const updateLeaveRequest = (id, updatedData) => {
        setLeaveRequests(leaveRequests.map(req => req.id === id ? { ...req, ...updatedData } : req));
    };

    const approveLeaveRequest = (id) => {
        const request = leaveRequests.find(r => r.id === id);
        if (request) {
            updateLeaveRequest(id, { status: "Đã duyệt" });
            addActivity("success", `Yêu cầu nghỉ phép của ${request.empName} đã được phê duyệt.`);
        }
    };

    const rejectLeaveRequest = (id) => {
        const request = leaveRequests.find(r => r.id === id);
        if (request) {
            updateLeaveRequest(id, { status: "Bị từ chối" });
            addActivity("warning", `Yêu cầu nghỉ phép của ${request.empName} đã bị từ chối.`);
        }
    };

    const addRole = (role) => {
        setRoles([...roles, role]);
        addActivity("success", `Chức vụ mới ${role.name} được thêm vào.`);
    };

    const updateRole = (id, updatedData) => {
        setRoles(roles.map(role => role.id === id ? { ...role, ...updatedData } : role));
    };

    const deleteRole = (id) => {
        const role = roles.find(r => r.id === id);
        setRoles(roles.filter(r => r.id !== id));
        if (role) addActivity("warning", `Chức vụ ${role.name} đã bị xóa.`);
    };

    const addDepartment = (department) => {
        setDepartments([...departments, department]);
        addActivity("success", `Phòng ban mới ${department.name} được thêm vào.`);
    };

    const updateDepartment = (id, updatedData) => {
        setDepartments(departments.map(dept => dept.id === id ? { ...dept, ...updatedData } : dept));
    };

    const deleteDepartment = (id) => {
        const dept = departments.find(d => d.id === id);
        setDepartments(departments.filter(d => d.id !== id));
        if (dept) addActivity("warning", `Phòng ban ${dept.name} đã bị xóa.`);
    };

    const addActivity = (type, text) => {
        const newActivity = {
            id: `act-${Date.now()}`,
            type,
            text,
            time: "Vừa xong"
        };
        setActivities([newActivity, ...activities.slice(0, 9)]);
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

    const showToast = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
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
