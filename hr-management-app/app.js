/* ==========================================================================
   HR PORTAL APPLICATION CORE LOGIC - MULTI-PAGE APPLICATION (MPA)
   ========================================================================== */

const API_BASE = 'http://localhost:3000/api';

// --- GLOBAL STATE (Loaded dynamically from SQLite Backend API) ---
let employees = [];
let leaveRequests = [];
let activities = [];
let roles = [];
let departments = [];
let notifications = [];
let empCurrentPage = 1;
const empItemsPerPage = 20;

// Determine active page from body attribute
const currentPage = document.body.getAttribute("data-page") || "dashboard";

// --- DOM ELEMENTS REFERENCE ---
const DOM = {
    // Nav elements
    menuLinks: document.querySelectorAll(".sidebar .menu-item"),
    pageTitle: document.getElementById("page-title"),
    liveDate: document.getElementById("live-date"),
    
    // Theme Toggle
    themeBtn: document.getElementById("theme-btn"),
    
    // Notifications
    notifBtn: document.getElementById("notif-btn"),
    notifDropdown: document.getElementById("notif-dropdown"),
    notifList: document.getElementById("notif-list"),
    clearNotifBtn: document.getElementById("clear-notif"),
    pendingBadge: document.getElementById("pending-badge"),
    
    // Dashboard Stats (index.html only)
    statTotalEmp: document.getElementById("stat-total-emp"),
    statAttendanceRate: document.getElementById("stat-attendance-rate"),
    statLeaveToday: document.getElementById("stat-leave-today"),
    statLeaveTodayNames: document.getElementById("stat-leave-today-names"),
    statPendingRequests: document.getElementById("stat-pending-requests"),
    deptDistribution: document.getElementById("department-distribution"),
    recentActivities: document.getElementById("recent-activities"),
    
    // Employee Tab (employees.html only)
    searchEmpInput: document.getElementById("search-emp"),
    filterDeptSelect: document.getElementById("filter-dept"),
    filterStatusSelect: document.getElementById("filter-status"),
    btnAddEmployee: document.getElementById("btn-add-employee"),
    employeesTbody: document.getElementById("employees-tbody"),
    empEmptyState: document.getElementById("emp-empty-state"),
    
    // Roles Tab (roles.html only)
    searchRoleInput: document.getElementById("search-role"),
    filterRoleDeptSelect: document.getElementById("filter-role-dept"),
    btnAddRole: document.getElementById("btn-add-role"),
    rolesTbody: document.getElementById("roles-tbody"),
    roleEmptyState: document.getElementById("role-empty-state"),
    
    // Leave Request Tab (request-leave.html only)
    leaveEmpSelect: document.getElementById("leave-emp-id"),
    leaveTypeSelect: document.getElementById("leave-type"),
    empRemainingLeavesBadge: document.getElementById("emp-remaining-leaves"),
    leaveStartDateInput: document.getElementById("leave-start-date"),
    leaveEndDateInput: document.getElementById("leave-end-date"),
    leaveCalculatedDays: document.getElementById("leave-calculated-days"),
    leaveReasonTextarea: document.getElementById("leave-reason"),
    leaveRequestForm: document.getElementById("leave-request-form"),
    leaveHistoryContainer: document.getElementById("leave-history-container"),
    
    // Approvals Tab (approve-leave.html only)
    approvalsContainer: document.getElementById("approvals-container"),
    approvalEmptyState: document.getElementById("approval-empty-state"),
    approvalPendingBadge: document.getElementById("approval-pending-badge"),
    
    // Modals
    employeeModal: document.getElementById("employee-modal"),
    employeeForm: document.getElementById("employee-form"),
    empFormId: document.getElementById("emp-form-id"),
    modalTitle: document.getElementById("modal-title"),
    closeEmpModalBtn: document.getElementById("close-emp-modal"),
    btnCancelEmp: document.getElementById("btn-cancel-emp"),
    
    profileModal: document.getElementById("profile-modal"),
    profileModalBody: document.getElementById("profile-modal-body"),
    closeProfileModalBtn: document.getElementById("close-profile-modal"),
    
    roleModal: document.getElementById("role-modal"),
    roleForm: document.getElementById("role-form"),
    roleFormId: document.getElementById("role-form-id"),
    roleModalTitle: document.getElementById("role-modal-title"),
    closeRoleModalBtn: document.getElementById("close-role-modal"),
    btnCancelRole: document.getElementById("btn-cancel-role"),
    inputRoleName: document.getElementById("role-name"),
    inputRoleDept: document.getElementById("role-dept"),
    inputRoleDesc: document.getElementById("role-desc"),

    // Department page elements
    searchDeptInput: document.getElementById("search-dept"),
    btnAddDepartment: document.getElementById("btn-add-department"),
    btnAddRoleInDept: document.getElementById("btn-add-role-in-dept"),
    departmentsTbody: document.getElementById("departments-tbody"),
    deptEmptyState: document.getElementById("dept-empty-state"),
    departmentModal: document.getElementById("department-modal"),
    departmentForm: document.getElementById("department-form"),
    departmentFormId: document.getElementById("department-form-id"),
    departmentModalTitle: document.getElementById("department-modal-title"),
    closeDepartmentModalBtn: document.getElementById("close-department-modal"),
    btnCancelDepartment: document.getElementById("btn-cancel-department"),
    inputDeptName: document.getElementById("department-name"),
    inputDeptDesc: document.getElementById("department-desc"),
    
    // Form Inputs inside employee modal
    inputEmpName: document.getElementById("emp-name"),
    inputEmpGender: document.getElementById("emp-gender"),
    inputEmpEmail: document.getElementById("emp-email"),
    inputEmpPhone: document.getElementById("emp-phone"),
    inputEmpDept: document.getElementById("emp-dept"),
    inputEmpRole: document.getElementById("emp-role"),
    inputEmpJoinDate: document.getElementById("emp-join-date"),
    inputEmpSalary: document.getElementById("emp-salary"),
    inputEmpTotalLeaves: document.getElementById("emp-total-leaves"),
    inputEmpStatus: document.getElementById("emp-status"),
    
    toastContainer: document.getElementById("toast-container")
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

async function loadAllData() {
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

        employees = await empRes.json();
        leaveRequests = await leaveRes.json();
        activities = await actRes.json();
        roles = await roleRes.json();
        departments = await deptRes.json();
        
        // Mock static notifications
        notifications = [
            { id: "n-1", text: "Yêu cầu phép mới từ Nguyễn Minh Tuấn đang chờ duyệt.", time: "08:15", read: false },
            { id: "n-2", text: "Yêu cầu phép mới từ Phạm Thanh Hương đang chờ duyệt.", time: "14:45", read: false }
        ];
    } catch (error) {
        console.error("Error loading data from API:", error);
        showToast("Không thể kết nối đến máy chủ API backend! Hãy kiểm tra server.", "error");
    }
}

async function initApp() {
    // 1. Live date
    updateLiveDate();
    
    // 2. Initialize Light/Dark theme from localStorage
    const savedTheme = localStorage.getItem("hr_portal_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    // 3. Highlight Sidebar Active menu item dynamically based on currentPage
    DOM.menuLinks.forEach(link => {
        const pageAttr = link.getAttribute("data-page");
        if (pageAttr === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // 4. Fetch all data asynchronously from the high-performance SQLite backend!
    await loadAllData();

    // 5. Update the sidebar approvals pending badge on ALL pages
    const pendingApprovalsCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
    if (DOM.pendingBadge) {
        if (pendingApprovalsCount > 0) {
            DOM.pendingBadge.textContent = pendingApprovalsCount;
            DOM.pendingBadge.style.display = "inline-block";
        } else {
            DOM.pendingBadge.style.display = "none";
        }
    }

    // 6. Populate all department dropdowns before rendering pages
    populateDepartmentSelects();

    // 7. Initialize page-specific data
    switch(currentPage) {
        case "dashboard":
            renderDashboard();
            break;
        case "employees":
            populateRoleDropdown();
            renderEmployeeTable();
            break;
        case "roles":
            renderRoleTable();
            break;
        case "departments":
            renderDepartmentTable();
            break;
        case "request-leave":
            populateEmployeeDropdowns();
            renderLeaveHistory();
            break;
        case "approve-leave":
            renderApprovals();
            break;
    }

    // 8. Render notification dropdown counts
    renderNotifications();
}

function updateLiveDate() {
    if (!DOM.liveDate) return;
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dateStr = `${dayName}, ${now.getDate()} tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
    DOM.liveDate.textContent = dateStr;
}

// --- GLOBAL EVENT LISTENERS BINDINGS ---
function setupEventListeners() {
    // Theme Switcher (Shared)
    if (DOM.themeBtn) {
        DOM.themeBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", nextTheme);
            localStorage.setItem("hr_portal_theme", nextTheme);
            showToast(`Đã chuyển sang giao diện ${nextTheme === "dark" ? "Tối" : "Sáng"}!`, "info");
        });
    }

    // Notifications Dropdown toggle (Shared)
    if (DOM.notifBtn) {
        DOM.notifBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (DOM.notifDropdown) DOM.notifDropdown.classList.toggle("show");
        });
    }

    document.addEventListener("click", () => {
        if (DOM.notifDropdown) DOM.notifDropdown.classList.remove("show");
    });

    if (DOM.clearNotifBtn) {
        DOM.clearNotifBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notifications = [];
            renderNotifications();
            showToast("Đã xóa tất cả thông báo.", "info");
        });
    }

    // --- PAGE-SPECIFIC EVENT LISTENERS ---
    
    // Page: EMPLOYEES
    if (currentPage === "employees") {
        if (DOM.searchEmpInput) DOM.searchEmpInput.addEventListener("input", () => { empCurrentPage = 1; renderEmployeeTable(); });
        if (DOM.filterDeptSelect) DOM.filterDeptSelect.addEventListener("change", () => { empCurrentPage = 1; renderEmployeeTable(); });
        if (DOM.filterStatusSelect) DOM.filterStatusSelect.addEventListener("change", () => { empCurrentPage = 1; renderEmployeeTable(); });

        // Modal triggers
        if (DOM.btnAddEmployee) DOM.btnAddEmployee.addEventListener("click", () => openEmployeeModal());
        if (DOM.closeEmpModalBtn) DOM.closeEmpModalBtn.addEventListener("click", closeEmployeeModal);
        if (DOM.btnCancelEmp) DOM.btnCancelEmp.addEventListener("click", closeEmployeeModal);
        if (DOM.employeeForm) DOM.employeeForm.addEventListener("submit", handleEmployeeFormSubmit);
        if (DOM.closeProfileModalBtn) DOM.closeProfileModalBtn.addEventListener("click", () => DOM.profileModal.classList.remove("open"));
    }

    // Page: ROLES
    if (currentPage === "roles") {
        if (DOM.searchRoleInput) DOM.searchRoleInput.addEventListener("input", renderRoleTable);
        if (DOM.filterRoleDeptSelect) DOM.filterRoleDeptSelect.addEventListener("change", renderRoleTable);

        // Modal triggers
        if (DOM.btnAddRole) DOM.btnAddRole.addEventListener("click", () => openRoleModal());
        if (DOM.closeRoleModalBtn) DOM.closeRoleModalBtn.addEventListener("click", closeRoleModal);
        if (DOM.btnCancelRole) DOM.btnCancelRole.addEventListener("click", closeRoleModal);
        if (DOM.roleForm) DOM.roleForm.addEventListener("submit", handleRoleFormSubmit);
    }

    // Page: DEPARTMENTS
    if (currentPage === "departments") {
        if (DOM.searchDeptInput) DOM.searchDeptInput.addEventListener("input", renderDepartmentTable);
        if (DOM.btnAddDepartment) DOM.btnAddDepartment.addEventListener("click", () => openDepartmentModal());
        if (DOM.closeDepartmentModalBtn) DOM.closeDepartmentModalBtn.addEventListener("click", closeDepartmentModal);
        if (DOM.btnCancelDepartment) DOM.btnCancelDepartment.addEventListener("click", closeDepartmentModal);
        if (DOM.departmentForm) DOM.departmentForm.addEventListener("submit", handleDepartmentFormSubmit);
    }

    // Page: REQUEST LEAVE
    if (currentPage === "request-leave") {
        if (DOM.leaveEmpSelect) DOM.leaveEmpSelect.addEventListener("change", updateRemainingLeavesBadge);
        if (DOM.leaveStartDateInput) DOM.leaveStartDateInput.addEventListener("change", calculateLeaveDays);
        if (DOM.leaveEndDateInput) DOM.leaveEndDateInput.addEventListener("change", calculateLeaveDays);
        if (DOM.leaveRequestForm) DOM.leaveRequestForm.addEventListener("submit", handleLeaveRequestSubmit);
    }
}

function populateDepartmentSelects() {
    const selectedDeptFilter = DOM.filterDeptSelect ? DOM.filterDeptSelect.value : "";
    const selectedRoleDeptFilter = DOM.filterRoleDeptSelect ? DOM.filterRoleDeptSelect.value : "";
    const selectedEmpDept = DOM.inputEmpDept ? DOM.inputEmpDept.value : "";
    const selectedRoleDept = DOM.inputRoleDept ? DOM.inputRoleDept.value : "";

    const buildOptions = (items, defaultText) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `<option value="">${defaultText}</option>`;
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;
            wrapper.appendChild(option);
        });
        return wrapper.innerHTML;
    };

    if (DOM.filterDeptSelect) {
        DOM.filterDeptSelect.innerHTML = buildOptions(departments, "Tất cả Phòng ban");
        if (selectedDeptFilter) DOM.filterDeptSelect.value = selectedDeptFilter;
    }

    if (DOM.filterRoleDeptSelect) {
        DOM.filterRoleDeptSelect.innerHTML = buildOptions(departments, "Tất cả Phòng ban");
        if (selectedRoleDeptFilter) DOM.filterRoleDeptSelect.value = selectedRoleDeptFilter;
    }

    if (DOM.inputEmpDept) {
        DOM.inputEmpDept.innerHTML = buildOptions(departments, "-- Chọn phòng ban --");
        if (selectedEmpDept) DOM.inputEmpDept.value = selectedEmpDept;
    }

    if (DOM.inputRoleDept) {
        DOM.inputRoleDept.innerHTML = buildOptions(departments, "-- Chọn phòng ban liên kết --");
        if (selectedRoleDept) DOM.inputRoleDept.value = selectedRoleDept;
    }
}

function renderDepartmentTable() {
    if (!DOM.departmentsTbody) return;
    DOM.departmentsTbody.innerHTML = "";

    const query = DOM.searchDeptInput ? DOM.searchDeptInput.value.toLowerCase().trim() : "";
    const filtered = departments.filter(dept => {
        const matchesName = dept.name.toLowerCase().includes(query);
        const matchesDesc = dept.desc ? dept.desc.toLowerCase().includes(query) : false;
        return matchesName || matchesDesc;
    });

    if (filtered.length === 0) {
        if (DOM.deptEmptyState) DOM.deptEmptyState.style.display = "flex";
        return;
    } else {
        if (DOM.deptEmptyState) DOM.deptEmptyState.style.display = "none";
    }

    filtered.forEach(dept => {
        const activeEmployees = employees.filter(e => e.dept === dept.name && e.status !== 'Đã nghỉ việc').length;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${dept.id}</strong></td>
            <td><strong>${dept.name}</strong></td>
            <td>${dept.desc || "<em class='text-muted'>Không có mô tả</em>"}</td>
            <td><span class="remaining-days-badge" style="padding: 4px 10px; font-size: 0.8rem;">${activeEmployees} NV</span></td>
            <td class="text-right">
                <div class="table-actions">
                    <button class="action-icon-btn btn-add-hover" onclick="openRoleModal(null, '${dept.name}')" title="Thêm chức vụ vào phòng ban này">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <button class="action-icon-btn btn-edit-hover" onclick="editDepartment('${dept.id}')" title="Chỉnh sửa">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="action-icon-btn btn-delete-hover" onclick="deleteDepartment('${dept.id}')" title="Xóa phòng ban">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </td>
        `;
        DOM.departmentsTbody.appendChild(row);
    });
}

function openDepartmentModal(deptId = null) {
    if (!DOM.departmentModal) return;

    DOM.departmentModal.classList.add("open");
    DOM.departmentForm.reset();
    DOM.departmentFormId.value = "";

    if (deptId) {
        const dept = departments.find(d => d.id === deptId);
        if (!dept) return;
        DOM.departmentModalTitle.textContent = `Chỉnh sửa phòng ban: ${dept.name}`;
        DOM.departmentFormId.value = dept.id;
        DOM.inputDeptName.value = dept.name;
        DOM.inputDeptDesc.value = dept.desc || "";
    } else {
        DOM.departmentModalTitle.textContent = "Thêm phòng ban mới";
    }
}

function closeDepartmentModal() {
    if (DOM.departmentModal) DOM.departmentModal.classList.remove("open");
}

async function handleDepartmentFormSubmit(e) {
    e.preventDefault();

    const formId = DOM.departmentFormId.value;
    const name = DOM.inputDeptName.value.trim();
    const desc = DOM.inputDeptDesc.value.trim();

    if (!name) {
        showToast("Vui lòng nhập tên phòng ban!", "error");
        return;
    }

    const deptNameRegex = /^[\p{L}0-9 ]+$/u;
    if (!deptNameRegex.test(name)) {
        showToast("Tên phòng ban chỉ được chứa chữ, số và khoảng trắng.", "error");
        return;
    }

    const duplicate = departments.some(d => d.name.toLowerCase() === name.toLowerCase() && d.id !== formId);
    if (duplicate) {
        showToast("Phòng ban này đã tồn tại trong hệ thống.", "error");
        return;
    }

    try {
        let response;
        if (formId) {
            // PUT to API
            response = await fetch(`${API_BASE}/departments/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, desc })
            });
        } else {
            // POST to API
            response = await fetch(`${API_BASE}/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, desc })
            });
        }

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Giao dịch không thành công.");
        }

        showToast(formId ? "Cập nhật phòng ban thành công!" : "Thêm phòng ban mới thành công!", "success");
        closeDepartmentModal();
        await loadAllData();
        renderDepartmentTable();
    } catch (err) {
        showToast(err.message, "error");
    }
}

window.editDepartment = function(deptId) {
    openDepartmentModal(deptId);
};

window.deleteDepartment = async function(deptId) {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;

    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa phòng ban "${dept.name}"?`);
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_BASE}/departments/${deptId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Không thể xóa phòng ban.");
        }

        showToast(`Đã xóa phòng ban ${dept.name}.`, "warning");
        await loadAllData();
        renderDepartmentTable();
    } catch (err) {
        showToast(err.message, "error");
    }
}

// --- DYNAMIC RENDERING: DASHBOARD ---
function renderDashboard() {
    const totalCount = employees.filter(e => e.status !== "Đã nghỉ việc").length;
    const leaveTodayCount = employees.filter(e => e.status === "Nghỉ phép").length;
    const pendingCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
    const attendanceRate = totalCount > 0 ? Math.round(((totalCount - leaveTodayCount) / totalCount) * 100) : 100;
    
    if (DOM.statTotalEmp) DOM.statTotalEmp.textContent = totalCount;
    if (DOM.statAttendanceRate) DOM.statAttendanceRate.textContent = `${attendanceRate}%`;
    if (DOM.statLeaveToday) DOM.statLeaveToday.textContent = leaveTodayCount;
    
    if (DOM.statLeaveTodayNames) {
        const leaveTodayList = employees.filter(e => e.status === "Nghỉ phép").map(e => e.name);
        DOM.statLeaveTodayNames.textContent = leaveTodayList.length > 0 ? leaveTodayList.join(", ") : "Hôm nay không có ai nghỉ";
    }
    
    if (DOM.statPendingRequests) {
        DOM.statPendingRequests.textContent = pendingCount;
        if (pendingCount > 0) {
            DOM.statPendingRequests.classList.add("text-warning");
        } else {
            DOM.statPendingRequests.classList.remove("text-warning");
        }
    }

    renderDepartmentChart(totalCount);
    renderActivityFeed();
}

function renderDepartmentChart(totalCount) {
    if (!DOM.deptDistribution) return;
    DOM.deptDistribution.innerHTML = "";
    
    const activeEmployees = employees.filter(e => e.status !== "Đã nghỉ việc");
    
    departments.forEach(dept => {
        const count = activeEmployees.filter(e => e.dept === dept.name).length;
        const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        
        const item = document.createElement("div");
        item.className = "dept-progress-item";
        item.innerHTML = `
            <div class="dept-info-row">
                <span class="dept-name">${dept.name}</span>
                <span class="dept-count">${count} nhân sự (${percentage}%)</span>
            </div>
            <div class="dept-bar-bg">
                <div class="dept-bar-fill" style="width: 0%"></div>
            </div>
        `;
        
        DOM.deptDistribution.appendChild(item);
        
        setTimeout(() => {
            const bar = item.querySelector(".dept-bar-fill");
            if (bar) bar.style.width = `${percentage}%`;
        }, 100);
    });
}

function renderActivityFeed() {
    if (!DOM.recentActivities) return;
    DOM.recentActivities.innerHTML = "";
    
    if (activities.length === 0) {
        DOM.recentActivities.innerHTML = `<div class="notif-empty">Chưa có hoạt động nào được ghi nhận</div>`;
        return;
    }
    
    activities.slice(0, 6).forEach(act => {
        const actEl = document.createElement("div");
        actEl.className = "activity-item";
        
        let iconSvg = "";
        if (act.type === "success") {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>`;
        } else if (act.type === "info") {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>`;
        } else if (act.type === "warning") {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
        } else {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;
        }
        
        actEl.innerHTML = `
            <div class="activity-icon-badge badge-${act.type}">${iconSvg}</div>
            <div class="activity-details">
                <span class="activity-text">${act.text}</span>
                <span class="activity-time">${act.time}</span>
            </div>
        `;
        DOM.recentActivities.appendChild(actEl);
    });
}

// --- DYNAMIC RENDERING: EMPLOYEE DIRECTORY ---
function renderEmployeeTable() {
    if (!DOM.employeesTbody) return;
    DOM.employeesTbody.innerHTML = "";
    
    const query = DOM.searchEmpInput ? DOM.searchEmpInput.value.toLowerCase().trim() : "";
    const deptFilter = DOM.filterDeptSelect ? DOM.filterDeptSelect.value : "";
    const statusFilter = DOM.filterStatusSelect ? DOM.filterStatusSelect.value : "";
    
    const filtered = employees.filter(emp => {
        const matchesQuery = emp.name.toLowerCase().includes(query) ||
                             emp.email.toLowerCase().includes(query) ||
                             emp.role.toLowerCase().includes(query) ||
                             emp.id.toLowerCase().includes(query);
        const matchesDept = !deptFilter || emp.dept === deptFilter;
        const matchesStatus = !statusFilter || emp.status === statusFilter;
        
        return matchesQuery && matchesDept && matchesStatus;
    });

    const pagEl = document.getElementById("emp-pagination");

    if (filtered.length === 0) {
        if (DOM.empEmptyState) DOM.empEmptyState.style.display = "flex";
        if (pagEl) pagEl.innerHTML = "";
        return;
    } else {
        if (DOM.empEmptyState) DOM.empEmptyState.style.display = "none";
    }

    const totalPages = Math.ceil(filtered.length / empItemsPerPage);
    if (empCurrentPage > totalPages) empCurrentPage = totalPages || 1;

    const start = (empCurrentPage - 1) * empItemsPerPage;
    const end = empCurrentPage * empItemsPerPage;
    const pageEmployees = filtered.slice(start, end);

    pageEmployees.forEach((emp, index) => {
        const initials = emp.name.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase();
        let statusClass = "status-working";
        if (emp.status === "Nghỉ phép") statusClass = "status-leave";
        if (emp.status === "Đã nghỉ việc") statusClass = "status-resigned";
        
        const globalIndex = start + index + 1;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${globalIndex}</strong></td>
            <td>
                <div class="employee-profile-cell">
                    <div class="employee-avatar">${initials}</div>
                    <div class="employee-meta-info">
                        <span class="employee-name-bold">${emp.name}</span>
                        <span class="employee-id-small">${emp.id}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="employee-contact">
                    <span class="employee-contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        ${emp.email}
                    </span>
                    <span class="employee-contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        ${emp.phone}
                    </span>
                </div>
            </td>
            <td><strong>${emp.dept}</strong></td>
            <td>${emp.role}</td>
            <td>${formatDate(emp.join_date)}</td>
            <td><span class="status-badge ${statusClass}">${emp.status}</span></td>
            <td class="text-right">
                <div class="table-actions">
                    <button class="action-icon-btn" onclick="viewEmployeeDetail('${emp.id}')" title="Xem hồ sơ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="action-icon-btn btn-edit-hover" onclick="editEmployee('${emp.id}')" title="Chỉnh sửa">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="action-icon-btn btn-delete-hover" onclick="deleteEmployee('${emp.id}')" title="Xóa nhân sự">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </td>
        `;
        DOM.employeesTbody.appendChild(row);
    });

    renderEmployeePagination(filtered.length, totalPages, start, end);
}

function renderEmployeePagination(totalItems, totalPages, start, end) {
    const pagEl = document.getElementById("emp-pagination");
    if (!pagEl) return;

    if (totalPages <= 1) {
        pagEl.innerHTML = "";
        return;
    }

    const currentEnd = Math.min(end, totalItems);
    const infoText = `Hiển thị <strong>${start + 1}</strong> - <strong>${currentEnd}</strong> trong tổng số <strong>${totalItems}</strong> nhân sự`;

    pagEl.innerHTML = `
        <span style="font-size: 0.9rem; color: var(--text-secondary);">${infoText}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn btn-sm" id="btn-prev-page" ${empCurrentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>◀ Trước</button>
            <span style="font-weight: 500;">Trang ${empCurrentPage} / ${totalPages}</span>
            <button class="btn btn-sm" id="btn-next-page" ${empCurrentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>Sau ▶</button>
        </div>
    `;

    const prevBtn = document.getElementById("btn-prev-page");
    const nextBtn = document.getElementById("btn-next-page");

    if (prevBtn && empCurrentPage > 1) {
        prevBtn.addEventListener("click", () => {
            empCurrentPage--;
            renderEmployeeTable();
        });
    }

    if (nextBtn && empCurrentPage < totalPages) {
        nextBtn.addEventListener("click", () => {
            empCurrentPage++;
            renderEmployeeTable();
        });
    }
}

// --- EMPLOYEE MODAL & FORM LOGIC ---
function openEmployeeModal(empId = null) {
    if (!DOM.employeeModal) return;
    
    DOM.employeeModal.classList.add("open");
    DOM.employeeForm.reset();
    DOM.empFormId.value = "";
    
    populateRoleDropdown(); // Populates roles select dynamically
    
    if (empId) {
        // Edit Mode
        const emp = employees.find(e => e.id === empId);
        if (!emp) return;
        
        DOM.modalTitle.textContent = `Chỉnh sửa hồ sơ: ${emp.name}`;
        DOM.empFormId.value = emp.id;
        
        DOM.inputEmpName.value = emp.name;
        DOM.inputEmpGender.value = emp.gender;
        DOM.inputEmpEmail.value = emp.email;
        DOM.inputEmpPhone.value = emp.phone;
        DOM.inputEmpDept.value = emp.dept;
        DOM.inputEmpRole.value = emp.role;
        DOM.inputEmpJoinDate.value = emp.join_date;
        DOM.inputEmpSalary.value = emp.salary;
        DOM.inputEmpTotalLeaves.value = emp.total_leaves;
        DOM.inputEmpStatus.value = emp.status;
    } else {
        // Create Mode
        DOM.modalTitle.textContent = "Thêm nhân viên mới";
        DOM.inputEmpJoinDate.value = new Date().toISOString().split("T")[0];
        DOM.inputEmpStatus.value = "Đang làm việc";
        DOM.inputEmpTotalLeaves.value = 12;
    }
}

function closeEmployeeModal() {
    if (DOM.employeeModal) DOM.employeeModal.classList.remove("open");
}

async function handleEmployeeFormSubmit(e) {
    e.preventDefault();
    
    const formId = DOM.empFormId.value;
    const name = DOM.inputEmpName.value.trim();
    const gender = DOM.inputEmpGender.value;
    const email = DOM.inputEmpEmail.value.trim();
    const phone = DOM.inputEmpPhone.value.trim();
    const dept = DOM.inputEmpDept.value;
    const role = DOM.inputEmpRole.value;
    const joinDate = DOM.inputEmpJoinDate.value;
    const salary = parseFloat(DOM.inputEmpSalary.value);
    const totalLeaves = parseInt(DOM.inputEmpTotalLeaves.value) || 12;
    const status = DOM.inputEmpStatus.value;
    
    if (!name || !email || !phone || !role || !joinDate || isNaN(salary)) {
        showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
        return;
    }

    // Validation: Name must not contain special characters or numbers
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƯưăâêôơư\s]+$/;
    if (!nameRegex.test(name)) {
        showToast("Họ tên không được chứa số hoặc ký tự đặc biệt!", "error");
        return;
    }

    // Validation: Phone must not contain letters
    const phoneRegex = /^[^a-zA-Z]+$/;
    if (!phoneRegex.test(phone)) {
        showToast("Số điện thoại không được chứa chữ cái!", "error");
        return;
    }

    // Enforce 9 to 11 digits for standard Vietnamese phone numbers
    const digitOnlyPhone = phone.replace(/[^0-9]/g, "");
    if (digitOnlyPhone.length < 9 || digitOnlyPhone.length > 11) {
        showToast("Số điện thoại phải chứa từ 9 đến 11 chữ số!", "error");
        return;
    }

    try {
        let response;
        const payload = { name, gender, email, phone, dept, role, join_date: joinDate, salary, total_leaves: totalLeaves, status };
        
        if (formId) {
            // PUT request to API
            response = await fetch(`${API_BASE}/employees/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // POST request to API
            response = await fetch(`${API_BASE}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Giao dịch không thành công.");
        }

        showToast(formId ? "Cập nhật thông tin nhân viên thành công!" : "Đã thêm nhân viên thành công!", "success");
        closeEmployeeModal();
        await loadAllData();
        renderEmployeeTable();
    } catch (err) {
        showToast(err.message, "error");
    }
}

window.viewEmployeeDetail = function(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    const initials = emp.name.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase();
    let statusClass = "status-working";
    if (emp.status === "Nghỉ phép") statusClass = "status-leave";
    if (emp.status === "Đã nghỉ việc") statusClass = "status-resigned";

    if (DOM.profileModalBody) {
        DOM.profileModalBody.innerHTML = `
            <div class="profile-card-header">
                <div class="profile-large-avatar">${initials}</div>
                <h2>${emp.name}</h2>
                <p>${emp.role} • <strong>${emp.dept}</strong></p>
                <span class="status-badge ${statusClass}" style="margin-top: 10px;">${emp.status}</span>
            </div>
            <div class="profile-grid-details" style="margin-top: 20px;">
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Mã Nhân Viên</span>
                    <span class="profile-detail-value">${emp.id}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Giới tính</span>
                    <span class="profile-detail-value">${emp.gender || "Không chỉ định"}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Email Công Việc</span>
                    <span class="profile-detail-value">${emp.email}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Số Điện Thoại</span>
                    <span class="profile-detail-value">${emp.phone}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Ngày Vào Làm</span>
                    <span class="profile-detail-value">${formatDate(emp.join_date)}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Lương Cơ Bản</span>
                    <span class="profile-detail-value">${formatCurrency(emp.salary)}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Phép năm còn lại</span>
                    <span class="profile-detail-value" style="font-weight: 700; color: var(--color-primary);">${emp.remaining_leaves} / ${emp.total_leaves} ngày</span>
                </div>
            </div>
        `;
    }
    
    if (DOM.profileModal) DOM.profileModal.classList.add("open");
};

window.editEmployee = function(empId) {
    openEmployeeModal(empId);
};

window.deleteEmployee = async function(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên "${emp.name}" khỏi hệ thống? 
(Lưu ý: Hành động này sẽ chuyển trạng thái của họ sang "Đã nghỉ việc")`);
    
    if (confirmDelete) {
        try {
            const response = await fetch(`${API_BASE}/employees/${empId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Lỗi khi xóa nhân sự");
            }

            showToast(`Đã chuyển trạng thái nhân viên ${emp.name} sang Đã nghỉ việc.`, "warning");
            await loadAllData();
            renderEmployeeTable();
        } catch (err) {
            showToast(err.message, "error");
        }
    }
};

// --- DYNAMIC RENDERING: ROLE MANAGEMENT ---
function populateRoleDropdown() {
    if (!DOM.inputEmpRole) return;
    
    const currentValue = DOM.inputEmpRole.value;
    DOM.inputEmpRole.innerHTML = `<option value="">-- Chọn chức vụ --</option>`;
    
    roles.forEach(role => {
        const option = document.createElement("option");
        option.value = role.name;
        option.textContent = `${role.name} (${role.dept})`;
        DOM.inputEmpRole.appendChild(option);
    });
    
    if (currentValue) {
        DOM.inputEmpRole.value = currentValue;
    }
}

function renderRoleTable() {
    if (!DOM.rolesTbody) return;
    DOM.rolesTbody.innerHTML = "";
    
    const query = DOM.searchRoleInput ? DOM.searchRoleInput.value.toLowerCase().trim() : "";
    const deptFilter = DOM.filterRoleDeptSelect ? DOM.filterRoleDeptSelect.value : "";
    
    const filtered = roles.filter(role => {
        const matchesQuery = role.name.toLowerCase().includes(query) ||
                             role.id.toLowerCase().includes(query) ||
                             (role.desc && role.desc.toLowerCase().includes(query));
        const matchesDept = !deptFilter || role.dept === deptFilter;
        return matchesQuery && matchesDept;
    });
    
    if (filtered.length === 0) {
        if (DOM.roleEmptyState) DOM.roleEmptyState.style.display = "flex";
        return;
    } else {
        if (DOM.roleEmptyState) DOM.roleEmptyState.style.display = "none";
    }
    
    filtered.forEach(role => {
        const activeEmpWithRole = employees.filter(e => e.role === role.name && e.status !== "Đã nghỉ việc").length;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${role.id}</strong></td>
            <td><strong>${role.name}</strong></td>
            <td><span class="status-badge status-working" style="background-color: var(--color-primary-light); color: var(--color-primary);">${role.dept}</span></td>
            <td>${role.desc || "<em class='text-muted'>Không có mô tả</em>"}</td>
            <td><span class="remaining-days-badge" style="padding: 4px 10px; font-size: 0.8rem;">${activeEmpWithRole} nhân sự</span></td>
            <td class="text-right">
                <div class="table-actions">
                    <button class="action-icon-btn btn-edit-hover" onclick="editRole('${role.id}')" title="Chỉnh sửa">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="action-icon-btn btn-delete-hover" onclick="deleteRole('${role.id}')" title="Xóa chức vụ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </td>
        `;
        DOM.rolesTbody.appendChild(row);
    });
}

function openRoleModal(roleId = null, defaultDeptName = null) {
    if (!DOM.roleModal) return;
    
    DOM.roleModal.classList.add("open");
    DOM.roleForm.reset();
    DOM.roleFormId.value = "";
    
    // Dynamically render department dropdown in role form modal
    populateDepartmentSelects();
    
    if (roleId) {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;
        DOM.roleModalTitle.textContent = `Chỉnh sửa chức vụ: ${role.name}`;
        DOM.roleFormId.value = role.id;
        DOM.inputRoleName.value = role.name;
        DOM.inputRoleDept.value = role.dept;
        DOM.inputRoleDesc.value = role.desc || "";
    } else {
        DOM.roleModalTitle.textContent = "Thêm chức vụ mới";
        if (defaultDeptName && DOM.inputRoleDept) {
            DOM.inputRoleDept.value = defaultDeptName;
        }
    }
}

function closeRoleModal() {
    if (DOM.roleModal) DOM.roleModal.classList.remove("open");
}

async function handleRoleFormSubmit(e) {
    e.preventDefault();
    
    const formId = DOM.roleFormId.value;
    const name = DOM.inputRoleName.value.trim();
    const dept = DOM.inputRoleDept.value;
    const desc = DOM.inputRoleDesc.value.trim();
    
    if (!name || !dept) {
        showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
        return;
    }
    
    try {
        let response;
        const payload = { name, dept, desc };
        
        if (formId) {
            // PUT request to API
            response = await fetch(`${API_BASE}/roles/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // POST request to API
            response = await fetch(`${API_BASE}/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Giao dịch không thành công.");
        }

        showToast(formId ? "Cập nhật chức vụ thành công!" : "Thêm chức vụ mới thành công!", "success");
        closeRoleModal();
        await loadAllData();
        renderRoleTable();
    } catch (err) {
        showToast(err.message, "error");
    }
}

window.editRole = function(roleId) {
    openRoleModal(roleId);
};

window.deleteRole = async function(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa chức vụ "${role.name}"?`);
    if (!confirmDelete) return;
    
    try {
        const response = await fetch(`${API_BASE}/roles/${roleId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Không thể xóa chức vụ.");
        }

        showToast(`Đã xóa chức vụ ${role.name}.`, "warning");
        await loadAllData();
        renderRoleTable();
    } catch (err) {
        showToast(err.message, "error");
    }
};

// --- LEAVE SYSTEM LOGIC ---
function populateEmployeeDropdowns() {
    if (!DOM.leaveEmpSelect) return;
    DOM.leaveEmpSelect.innerHTML = `<option value="">-- Chọn nhân viên --</option>`;
    
    const activeEmps = employees.filter(e => e.status !== "Đã nghỉ việc");
    activeEmps.forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.id;
        option.textContent = `${emp.id} - ${emp.name} (${emp.dept})`;
        DOM.leaveEmpSelect.appendChild(option);
    });
}

function updateRemainingLeavesBadge() {
    if (!DOM.leaveEmpSelect || !DOM.empRemainingLeavesBadge) return;
    
    const empId = DOM.leaveEmpSelect.value;
    if (!empId) {
        DOM.empRemainingLeavesBadge.textContent = "0 ngày";
        return;
    }
    
    const emp = employees.find(e => e.id === empId);
    if (emp) {
        DOM.empRemainingLeavesBadge.textContent = `${emp.remaining_leaves} ngày`;
    }
}

function calculateLeaveDays() {
    if (!DOM.leaveStartDateInput || !DOM.leaveEndDateInput || !DOM.leaveCalculatedDays) return;
    
    const start = DOM.leaveStartDateInput.value;
    const end = DOM.leaveEndDateInput.value;
    
    if (!start || !end) {
        DOM.leaveCalculatedDays.textContent = "0 ngày";
        return;
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (endDate < startDate) {
        DOM.leaveCalculatedDays.textContent = "Ngày kết thúc phải lớn hơn ngày bắt đầu!";
        DOM.leaveCalculatedDays.style.color = "var(--color-danger)";
        return;
    }
    
    DOM.leaveCalculatedDays.style.color = "";
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    DOM.leaveCalculatedDays.textContent = `${totalDays} ngày`;
}

async function handleLeaveRequestSubmit(e) {
    e.preventDefault();
    
    const empId = DOM.leaveEmpSelect.value;
    const type = DOM.leaveTypeSelect.value;
    const startDate = DOM.leaveStartDateInput.value;
    const endDate = DOM.leaveEndDateInput.value;
    const reason = DOM.leaveReasonTextarea.value.trim();
    
    if (!empId || !startDate || !endDate || !reason) {
        showToast("Vui lòng điền đầy đủ thông tin xin nghỉ!", "error");
        return;
    }
    
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    const timeDiff = new Date(endDate).getTime() - new Date(startDate).getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    if (days <= 0) {
        showToast("Ngày kết thúc không hợp lệ!", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/leave-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emp_id: empId, type, start_date: startDate, end_date: endDate, days, reason })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Gửi đơn không thành công.");
        }

        showToast("Đã gửi đơn xin nghỉ phép thành công! Đang chờ duyệt.", "success");
        DOM.leaveRequestForm.reset();
        DOM.leaveCalculatedDays.textContent = "0 ngày";
        DOM.empRemainingLeavesBadge.textContent = "0 ngày";
        
        await loadAllData();
        renderLeaveHistory();
        
        // Refresh sidebar pending approvals badge
        const pendingCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
        if (DOM.pendingBadge) {
            if (pendingCount > 0) {
                DOM.pendingBadge.textContent = pendingCount;
                DOM.pendingBadge.style.display = "inline-block";
            } else {
                DOM.pendingBadge.style.display = "none";
            }
        }
    } catch (err) {
        showToast(err.message, "error");
    }
}

function renderLeaveHistory() {
    if (!DOM.leaveHistoryContainer) return;
    DOM.leaveHistoryContainer.innerHTML = "";
    
    if (leaveRequests.length === 0) {
        DOM.leaveHistoryContainer.innerHTML = `<div class="notif-empty">Chưa có lịch sử yêu cầu phép</div>`;
        return;
    }
    
    leaveRequests.forEach(req => {
        let badgeClass = "badge-pending";
        if (req.status === "Đã duyệt") badgeClass = "badge-approved";
        if (req.status === "Từ chối") badgeClass = "badge-rejected";
        
        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
            <div class="history-header">
                <span class="history-emp-name">${req.emp_name}</span>
                <span class="history-badge ${badgeClass}">${req.status}</span>
            </div>
            <div class="history-details">
                <div><strong>Loại:</strong> ${req.type}</div>
                <div><strong>Số ngày:</strong> ${req.days} ngày</div>
                <div style="grid-column: span 2;"><strong>Thời gian:</strong> ${formatDate(req.start_date)} - ${formatDate(req.end_date)}</div>
            </div>
            <p class="history-reason">"${req.reason}"</p>
        `;
        DOM.leaveHistoryContainer.appendChild(card);
    });
}

// --- DYNAMIC RENDERING: APPROVALS ---
function renderApprovals() {
    if (!DOM.approvalsContainer) return;
    DOM.approvalsContainer.innerHTML = "";
    
    const pendingList = leaveRequests.filter(req => req.status === "Chờ duyệt");
    if (DOM.approvalPendingBadge) DOM.approvalPendingBadge.textContent = `${pendingList.length} Yêu cầu chờ duyệt`;
    
    if (pendingList.length === 0) {
        if (DOM.approvalEmptyState) DOM.approvalEmptyState.style.display = "flex";
        return;
    } else {
        if (DOM.approvalEmptyState) DOM.approvalEmptyState.style.display = "none";
    }
    
    pendingList.forEach(req => {
        const initials = req.emp_name.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase();
        
        const card = document.createElement("div");
        card.className = "approval-card";
        card.innerHTML = `
            <div class="approval-profile">
                <div class="employee-avatar">${initials}</div>
                <div class="approval-info">
                    <span class="approval-emp-name">${req.emp_name}</span>
                    <span class="approval-emp-dept">${req.emp_id} • <strong>${req.emp_dept}</strong></span>
                </div>
            </div>
            
            <div class="approval-dates">
                <div><strong>Loại phép:</strong> ${req.type}</div>
                <div><strong>Thời gian nghỉ:</strong> ${formatDate(req.start_date)} đến ${formatDate(req.end_date)}</div>
                <div><strong>Tổng số ngày nghỉ:</strong> <strong style="color: var(--color-primary)">${req.days} ngày</strong></div>
            </div>
            
            <p class="approval-reason"><strong>Lý do:</strong> "${req.reason}"</p>
            
            <div class="approval-actions">
                <button class="btn btn-secondary btn-danger" onclick="decideLeaveRequest('${req.id}', 'reject')">Từ chối</button>
                <button class="btn btn-primary btn-success" onclick="decideLeaveRequest('${req.id}', 'approve')">Duyệt nghỉ</button>
            </div>
        `;
        DOM.approvalsContainer.appendChild(card);
    });
}

window.decideLeaveRequest = async function(reqId, action) {
    const confirmAction = confirm(`Bạn có chắc chắn muốn ${action === "approve" ? "phê duyệt" : "từ chối"} yêu cầu nghỉ phép này?`);
    if (!confirmAction) return;

    try {
        const response = await fetch(`${API_BASE}/leave-requests/${reqId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: action === "approve" ? "Đã duyệt" : "Từ chối" })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Không thể phê duyệt.");
        }

        showToast(action === "approve" ? `Đã phê duyệt phép nghỉ thành công!` : `Đã từ chối đơn phép nghỉ.`, "success");
        await loadAllData();
        renderApprovals();
        
        // Refresh sidebar pending count
        const pendingCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
        if (DOM.pendingBadge) {
            if (pendingCount > 0) {
                DOM.pendingBadge.textContent = pendingCount;
                DOM.pendingBadge.style.display = "inline-block";
            } else {
                DOM.pendingBadge.style.display = "none";
            }
        }
    } catch (err) {
        showToast(err.message, "error");
    }
};

// --- DYNAMIC RENDERING: NOTIFICATIONS ---
function renderNotifications() {
    if (!DOM.notifList) return;
    DOM.notifList.innerHTML = "";
    
    const unreadCount = notifications.filter(n => !n.read).length;
    const dot = document.querySelector(".notif-dot");
    if (dot) {
        if (unreadCount > 0) {
            dot.style.display = "block";
        } else {
            dot.style.display = "none";
        }
    }
    
    if (notifications.length === 0) {
        DOM.notifList.innerHTML = `<div class="notif-empty">Không có thông báo mới</div>`;
        return;
    }
    
    notifications.forEach(notif => {
        const item = document.createElement("div");
        item.className = "notif-item";
        item.innerHTML = `
            <div class="notif-item-icon" style="background-color: var(--color-primary-light); color: var(--color-primary)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div class="notif-item-details">
                <p>${notif.text}</p>
                <span class="notif-item-time">${notif.time}</span>
            </div>
        `;
        DOM.notifList.appendChild(item);
    });
}

// --- UTILITY FUNCTIONS ---
function logActivity(type, text) {
    // Activities are handled on the server side via transactions, but we can log client side events if needed
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else if (type === "error") {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${message}</div>
    `;
    
    if (DOM.toastContainer) DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCurrency(number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(number);
}

function getFormattedNow() {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${date} ${time}`;
}
