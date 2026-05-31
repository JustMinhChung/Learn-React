/* ==========================================================================
   HR PORTAL APPLICATION CORE LOGIC - MULTI-PAGE APPLICATION (MPA)
   ========================================================================== */

// --- INITIAL MOCK DATA ---
const DEFAULT_EMPLOYEES = [
    {
        id: "NV001",
        name: "Nguyễn Minh Tuấn",
        gender: "Nam",
        email: "tuan.nm@company.com",
        phone: "0912345678",
        dept: "Kỹ thuật",
        role: "Kỹ sư Backend chính",
        joinDate: "2023-01-15",
        salary: 26000000,
        totalLeaves: 12,
        remainingLeaves: 8,
        status: "Đang làm việc"
    },
    {
        id: "NV002",
        name: "Trần Thị Mai",
        gender: "Nữ",
        email: "mai.tt@company.com",
        phone: "0987654321",
        dept: "Nhân sự",
        role: "Trưởng phòng HR",
        joinDate: "2022-05-10",
        salary: 32000000,
        totalLeaves: 15,
        remainingLeaves: 12,
        status: "Đang làm việc"
    },
    {
        id: "NV003",
        name: "Lê Hoàng Nam",
        gender: "Nam",
        email: "nam.lh@company.com",
        phone: "0905123456",
        dept: "Kỹ thuật",
        role: "Frontend Developer",
        joinDate: "2024-03-01",
        salary: 19500000,
        totalLeaves: 12,
        remainingLeaves: 7,
        status: "Nghỉ phép"
    },
    {
        id: "NV004",
        name: "Phạm Thanh Hương",
        gender: "Nữ",
        email: "huong.pt@company.com",
        phone: "0977889900",
        dept: "Marketing",
        role: "Chuyên viên Content",
        joinDate: "2023-11-20",
        salary: 16000000,
        totalLeaves: 12,
        remainingLeaves: 11,
        status: "Đang làm việc"
    },
    {
        id: "NV005",
        name: "Đặng Anh Tú",
        gender: "Nam",
        email: "tu.da@company.com",
        phone: "0933445566",
        dept: "Thiết kế",
        role: "UI/UX Designer",
        joinDate: "2024-02-15",
        salary: 22000000,
        totalLeaves: 12,
        remainingLeaves: 9,
        status: "Đang làm việc"
    },
    {
        id: "NV006",
        name: "Bùi Văn Hùng",
        gender: "Nam",
        email: "hung.bv@company.com",
        phone: "0966554433",
        dept: "Kinh doanh",
        role: "Trưởng nhóm Kinh doanh",
        joinDate: "2022-09-01",
        salary: 28000000,
        totalLeaves: 12,
        remainingLeaves: 0,
        status: "Đã nghỉ việc"
    }
];

const DEFAULT_LEAVE_REQUESTS = [
    {
        id: "LR001",
        empId: "NV003",
        empName: "Lê Hoàng Nam",
        empDept: "Kỹ thuật",
        type: "Nghỉ ốm",
        startDate: "2026-05-24",
        endDate: "2026-05-26",
        days: 3,
        reason: "Sốt siêu vi, bác sĩ chỉ định nghỉ ngơi tại nhà.",
        status: "Đã duyệt",
        submittedAt: "2026-05-23 09:30"
    },
    {
        id: "LR002",
        empId: "NV001",
        empName: "Nguyễn Minh Tuấn",
        empDept: "Kỹ thuật",
        type: "Nghỉ phép năm",
        startDate: "2026-05-28",
        endDate: "2026-05-30",
        days: 3,
        reason: "Giải quyết công việc cá nhân ở quê.",
        status: "Chờ duyệt",
        submittedAt: "2026-05-24 08:15"
    },
    {
        id: "LR003",
        empId: "NV004",
        empName: "Phạm Thanh Hương",
        empDept: "Marketing",
        type: "Nghỉ phép năm",
        startDate: "2026-06-10",
        endDate: "2026-06-12",
        days: 3,
        reason: "Nghỉ phép hè du lịch cùng gia đình.",
        status: "Chờ duyệt",
        submittedAt: "2026-05-24 14:45"
    }
];

const DEFAULT_ACTIVITIES = [
    {
        id: "act-1",
        type: "success",
        text: "Yêu cầu nghỉ phép của <strong>Lê Hoàng Nam</strong> đã được phê duyệt.",
        time: "Hôm qua lúc 17:00"
    },
    {
        id: "act-2",
        type: "info",
        text: "Nhân viên mới <strong>Đặng Anh Tú</strong> được thêm vào phòng Thiết kế.",
        time: "3 ngày trước"
    },
    {
        id: "act-3",
        type: "warning",
        text: "Hệ thống ghi nhận <strong>Nguyễn Minh Tuấn</strong> gửi yêu cầu nghỉ phép mới.",
        time: "Hôm nay lúc 08:15"
    }
];

const DEFAULT_ROLES = [
    { id: "CV001", name: "Kỹ sư Backend chính", dept: "Kỹ thuật", desc: "Phát triển hệ thống máy chủ và API" },
    { id: "CV002", name: "Trưởng phòng HR", dept: "Nhân sự", desc: "Quản lý tuyển dụng và chính sách nhân sự" },
    { id: "CV003", name: "Frontend Developer", dept: "Kỹ thuật", desc: "Xây dựng giao diện ứng dụng web" },
    { id: "CV004", name: "Chuyên viên Content", dept: "Marketing", desc: "Lập kế hoạch và sản xuất nội dung" },
    { id: "CV005", name: "UI/UX Designer", dept: "Thiết kế", desc: "Thiết kế trải nghiệm và giao diện người dùng" },
    { id: "CV006", name: "Trưởng nhóm Kinh doanh", dept: "Kinh doanh", desc: "Định hướng mục tiêu doanh số bán hàng" }
];

const DEFAULT_DEPARTMENTS = [
    { id: "PB001", name: "Kỹ thuật", desc: "Chịu trách nhiệm phát triển sản phẩm và giải pháp kỹ thuật." },
    { id: "PB002", name: "Nhân sự", desc: "Quản lý tuyển dụng, đào tạo và phúc lợi nhân viên." },
    { id: "PB003", name: "Marketing", desc: "Xây dựng chiến lược truyền thông và thương hiệu." },
    { id: "PB004", name: "Kinh doanh", desc: "Phát triển doanh số và chăm sóc khách hàng." },
    { id: "PB005", name: "Thiết kế", desc: "Thiết kế giao diện và trải nghiệm người dùng." }
];

// --- APP STATE & LOCALSTORAGE WRAPPING ---
class AppStore {
    static get(key, defaultValue) {
        const data = localStorage.getItem(`hr_portal_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    }

    static set(key, value) {
        localStorage.setItem(`hr_portal_${key}`, JSON.stringify(value));
    }
}

// State management loaded from localStorage
let employees = AppStore.get("employees", DEFAULT_EMPLOYEES);
let leaveRequests = AppStore.get("leave_requests", DEFAULT_LEAVE_REQUESTS);
let activities = AppStore.get("activities", DEFAULT_ACTIVITIES);
let roles = AppStore.get("roles", DEFAULT_ROLES);
let departments = AppStore.get("departments", DEFAULT_DEPARTMENTS);
let notifications = AppStore.get("notifications", [
    { id: "n-1", text: "Yêu cầu phép mới từ Nguyễn Minh Tuấn đang chờ duyệt.", time: "08:15", read: false },
    { id: "n-2", text: "Yêu cầu phép mới từ Phạm Thanh Hương đang chờ duyệt.", time: "14:45", read: false }
]);

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

function initApp() {
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

    // 4. Update the sidebar approvals pending badge on ALL pages
    const pendingApprovalsCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
    if (DOM.pendingBadge) {
        if (pendingApprovalsCount > 0) {
            DOM.pendingBadge.textContent = pendingApprovalsCount;
            DOM.pendingBadge.style.display = "inline-block";
        } else {
            DOM.pendingBadge.style.display = "none";
        }
    }

    // 5. Populate all department dropdowns before rendering pages
    populateDepartmentSelects();

    // 6. Initialize page-specific data
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

    // 6. Render notification dropdown counts
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
            AppStore.set("notifications", notifications);
            renderNotifications();
            showToast("Đã xóa tất cả thông báo.", "info");
        });
    }

    // --- PAGE-SPECIFIC EVENT LISTENERS ---
    
    // Page: EMPLOYEES
    if (currentPage === "employees") {
        if (DOM.searchEmpInput) DOM.searchEmpInput.addEventListener("input", renderEmployeeTable);
        if (DOM.filterDeptSelect) DOM.filterDeptSelect.addEventListener("change", renderEmployeeTable);
        if (DOM.filterStatusSelect) DOM.filterStatusSelect.addEventListener("change", renderEmployeeTable);

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
        if (DOM.btnAddRoleInDept) DOM.btnAddRoleInDept.addEventListener("click", () => openRoleModal());
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
        const activeEmployees = employees.filter(e => e.dept === dept.name).length;
        const linkedRoles = roles.filter(r => r.dept === dept.name).length;

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
                    <button class="action-icon-btn btn-view-hover" onclick="viewEmployeesInDepartment('${dept.name}')" title="Xem nhân sự">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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

function handleDepartmentFormSubmit(e) {
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

    if (formId) {
        const deptIndex = departments.findIndex(d => d.id === formId);
        if (deptIndex > -1) {
            const oldName = departments[deptIndex].name;
            departments[deptIndex] = { ...departments[deptIndex], name, desc };

            employees.forEach(emp => {
                if (emp.dept === oldName) emp.dept = name;
            });
            roles.forEach(role => {
                if (role.dept === oldName) role.dept = name;
            });

            AppStore.set("employees", employees);
            AppStore.set("roles", roles);
            logActivity("info", `Phòng ban <strong>${oldName}</strong> đã được đổi tên thành <strong>${name}</strong>.`);
            showToast("Cập nhật phòng ban thành công!", "success");
        }
    } else {
        const nextIdNum = Math.max(...departments.map(d => parseInt(d.id.replace("PB", ""))), 0) + 1;
        const newId = `PB${String(nextIdNum).padStart(3, "0")}`;
        departments.push({ id: newId, name, desc });
        logActivity("success", `Phòng ban mới <strong>${name}</strong> đã được thêm vào hệ thống.`);
        showToast("Thêm phòng ban mới thành công!", "success");
    }

    AppStore.set("departments", departments);
    populateDepartmentSelects();
    closeDepartmentModal();
    renderDepartmentTable();
    if (currentPage === "employees") renderEmployeeTable();
    if (currentPage === "roles") renderRoleTable();
}

window.editDepartment = function(deptId) {
    openDepartmentModal(deptId);
};

window.deleteDepartment = function(deptId) {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;

    const activeEmployees = employees.filter(e => e.dept === dept.name).length;
    const linkedRoles = roles.filter(r => r.dept === dept.name).length;
    if (activeEmployees > 0 || linkedRoles > 0) {
        showToast(`Không thể xóa phòng ban này vì còn ${activeEmployees} nhân viên và ${linkedRoles} chức vụ liên kết.`, "error");
        return;
    }

    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa phòng ban "${dept.name}"?`);
    if (!confirmDelete) return;

    departments = departments.filter(d => d.id !== deptId);
    AppStore.set("departments", departments);
    populateDepartmentSelects();
    renderDepartmentTable();
    showToast(`Đã xóa phòng ban ${dept.name}.`, "warning");
    logActivity("danger", `Phòng ban <strong>${dept.name}</strong> đã bị xóa khỏi hệ thống.`);
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
    const deptList = departments.map(d => d.name);
    
    deptList.forEach(dept => {
        const count = activeEmployees.filter(e => e.dept === dept).length;
        const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        
        const item = document.createElement("div");
        item.className = "dept-progress-item";
        item.innerHTML = `
            <div class="dept-info-row">
                <span class="dept-name">${dept}</span>
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

    if (filtered.length === 0) {
        if (DOM.empEmptyState) DOM.empEmptyState.style.display = "flex";
        return;
    } else {
        if (DOM.empEmptyState) DOM.empEmptyState.style.display = "none";
    }

    filtered.forEach(emp => {
        const initials = emp.name.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase();
        let statusClass = "status-working";
        if (emp.status === "Nghỉ phép") statusClass = "status-leave";
        if (emp.status === "Đã nghỉ việc") statusClass = "status-resigned";
        
        const row = document.createElement("tr");
        row.innerHTML = `
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
            <td>${formatDate(emp.joinDate)}</td>
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
        DOM.inputEmpJoinDate.value = emp.joinDate;
        DOM.inputEmpSalary.value = emp.salary;
        DOM.inputEmpTotalLeaves.value = emp.totalLeaves;
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

function handleEmployeeFormSubmit(e) {
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

    if (formId) {
        // UPDATE Existing Employee
        const empIndex = employees.findIndex(emp => emp.id === formId);
        if (empIndex > -1) {
            const oldTotal = employees[empIndex].totalLeaves;
            const oldRemaining = employees[empIndex].remainingLeaves;
            const diff = totalLeaves - oldTotal;
            const remainingLeaves = Math.max(0, oldRemaining + diff);

            employees[empIndex] = {
                ...employees[empIndex],
                name, gender, email, phone, dept, role, joinDate, salary, totalLeaves, remainingLeaves, status
            };
            
            logActivity("info", `Hồ sơ nhân viên <strong>${name}</strong> (${formId}) đã được chỉnh sửa.`);
            showToast("Cập nhật thông tin nhân viên thành công!", "success");
        }
    } else {
        // CREATE New Employee
        const nextIdNum = Math.max(...employees.map(emp => parseInt(emp.id.replace("NV", "")))) + 1;
        const newId = `NV${String(nextIdNum).padStart(3, "0")}`;
        
        const newEmp = {
            id: newId,
            name, gender, email, phone, dept, role, joinDate, salary,
            totalLeaves,
            remainingLeaves: totalLeaves,
            status
        };
        
        employees.push(newEmp);
        logActivity("info", `Nhân viên mới <strong>${name}</strong> (${newId}) đã được thêm vào phòng ${dept}.`);
        showToast(`Đã thêm nhân viên ${name} thành công!`, "success");
    }

    AppStore.set("employees", employees);
    closeEmployeeModal();
    renderEmployeeTable();
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
                    <span class="profile-detail-value">${formatDate(emp.joinDate)}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Lương Cơ Bản</span>
                    <span class="profile-detail-value">${formatCurrency(emp.salary)}</span>
                </div>
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Phép năm còn lại</span>
                    <span class="profile-detail-value" style="font-weight: 700; color: var(--color-primary);">${emp.remainingLeaves} / ${emp.totalLeaves} ngày</span>
                </div>
            </div>
        `;
    }
    
    if (DOM.profileModal) DOM.profileModal.classList.add("open");
};

window.viewEmployeesInRole = function(roleName) {
    showEmployeeList("Chức vụ", roleName);
};

window.viewEmployeesInDepartment = function(deptName) {
    showEmployeeList("Phòng ban", deptName);
};

function showEmployeeList(type, value) {
    const list = employees.filter(emp => {
        if (type === "Chức vụ") return emp.role === value;
        return emp.dept === value;
    });

    const title = `Nhân sự theo ${type.toLowerCase()}: ${value}`;
    const subtitle = `${list.length} nhân sự${list.length === 0 ? "" : " đang hoạt động"}`;

    if (DOM.profileModalBody) {
        const rows = list.map(emp => {
            const initials = emp.name.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase();
            return `
                <div class="profile-list-item">
                    <div class="profile-avatar-small">${initials}</div>
                    <div>
                        <strong>${emp.name}</strong>
                        <p>${emp.id} • ${emp.role}</p>
                    </div>
                    <button class="btn btn-secondary" onclick="viewEmployeeDetail('${emp.id}')">Xem</button>
                </div>
            `;
        }).join("");

        DOM.profileModalBody.innerHTML = `
            <div class="profile-card-header">
                <h2>${title}</h2>
                <p>${subtitle}</p>
            </div>
            <div class="profile-list-container" style="margin-top: 16px; display: grid; gap: 12px;">
                ${rows.length > 0 ? rows : `<div class="notif-empty">Không có nhân sự trong mục này.</div>`}
            </div>
        `;
    }

    if (DOM.profileModal) DOM.profileModal.classList.add("open");
};

window.editEmployee = function(empId) {
    openEmployeeModal(empId);
};

window.deleteEmployee = function(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên "${emp.name}" khỏi hệ thống? 
(Lưu ý: Hành động này sẽ chuyển trạng thái của họ sang "Đã nghỉ việc")`);
    
    if (confirmDelete) {
        emp.status = "Đã nghỉ việc";
        AppStore.set("employees", employees);
        logActivity("danger", `Hồ sơ nhân viên <strong>${emp.name}</strong> đã chuyển sang trạng thái <strong>Đã nghỉ việc</strong>.`);
        showToast(`Đã chuyển trạng thái nhân viên ${emp.name} sang Đã nghỉ việc.`, "warning");
        renderEmployeeTable();
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

function openRoleModal(roleId = null, preselectDept = "") {
    if (!DOM.roleModal) return;
    
    DOM.roleModal.classList.add("open");
    DOM.roleForm.reset();
    DOM.roleFormId.value = "";
    
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
        if (preselectDept && DOM.inputRoleDept) {
            DOM.inputRoleDept.value = preselectDept;
        }
    }
}

function closeRoleModal() {
    if (DOM.roleModal) DOM.roleModal.classList.remove("open");
}

function handleRoleFormSubmit(e) {
    e.preventDefault();
    
    const formId = DOM.roleFormId.value;
    const name = DOM.inputRoleName.value.trim();
    const dept = DOM.inputRoleDept.value;
    const desc = DOM.inputRoleDesc.value.trim();
    
    if (!name || !dept) {
        showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
        return;
    }
    
    if (formId) {
        // Edit Mode
        const roleIndex = roles.findIndex(r => r.id === formId);
        if (roleIndex > -1) {
            const oldName = roles[roleIndex].name;
            roles[roleIndex] = { ...roles[roleIndex], name, dept, desc };
            
            // Auto update employees holding this role
            let updatedCount = 0;
            employees.forEach(emp => {
                if (emp.role === oldName) {
                    emp.role = name;
                    emp.dept = dept; // sync department
                    updatedCount++;
                }
            });
            
            if (updatedCount > 0) {
                AppStore.set("employees", employees);
                logActivity("info", `Đã đồng bộ cập nhật chức vụ mới cho <strong>${updatedCount}</strong> nhân sự.`);
            }
            
            logActivity("info", `Chức vụ <strong>${name}</strong> đã được cập nhật.`);
            showToast("Cập nhật chức vụ thành công!", "success");
        }
    } else {
        // Add Mode
        const nextIdNum = Math.max(...roles.map(r => parseInt(r.id.replace("CV", ""))), 0) + 1;
        const newId = `CV${String(nextIdNum).padStart(3, "0")}`;
        
        const newRole = { id: newId, name, dept, desc };
        roles.push(newRole);
        
        logActivity("info", `Chức vụ mới <strong>${name}</strong> (${newId}) đã được tạo.`);
        showToast("Thêm chức vụ mới thành công!", "success");
    }
    
    AppStore.set("roles", roles);
    closeRoleModal();
    renderRoleTable();
}

window.editRole = function(roleId) {
    openRoleModal(roleId);
};

window.deleteRole = function(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    const activeEmps = employees.filter(e => e.role === role.name && e.status !== "Đã nghỉ việc");
    if (activeEmps.length > 0) {
        showToast(`Không thể xóa! Có ${activeEmps.length} nhân viên đang đảm nhiệm chức vụ này.`, "error");
        return;
    }
    
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa chức vụ "${role.name}"?`);
    if (confirmDelete) {
        roles = roles.filter(r => r.id !== roleId);
        AppStore.set("roles", roles);
        
        logActivity("danger", `Chức vụ <strong>${role.name}</strong> đã bị xóa khỏi hệ thống.`);
        showToast(`Đã xóa chức vụ ${role.name}.`, "warning");
        
        renderRoleTable();
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
        DOM.empRemainingLeavesBadge.textContent = `${emp.remainingLeaves} ngày`;
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

function handleLeaveRequestSubmit(e) {
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
    
    if (type === "Nghỉ phép năm" && emp.remainingLeaves < days) {
        showToast(`Nhân viên chỉ còn ${emp.remainingLeaves} ngày phép năm, không đủ cho yêu cầu ${days} ngày!`, "error");
        return;
    }

    const nextIdNum = Math.max(...leaveRequests.map(r => parseInt(r.id.replace("LR", ""))), 0) + 1;
    const newRequest = {
        id: `LR${String(nextIdNum).padStart(3, "0")}`,
        empId,
        empName: emp.name,
        empDept: emp.dept,
        type,
        startDate,
        endDate,
        days,
        reason,
        status: "Chờ duyệt",
        submittedAt: getFormattedNow()
    };
    
    leaveRequests.unshift(newRequest);
    AppStore.set("leave_requests", leaveRequests);
    
    notifications.unshift({
        id: `n-${Date.now()}`,
        text: `Yêu cầu phép mới từ ${emp.name} đang chờ duyệt.`,
        time: "Vừa xong",
        read: false
    });
    AppStore.set("notifications", notifications);

    logActivity("warning", `<strong>${emp.name}</strong> gửi đơn xin nghỉ phép <strong>${type}</strong> (${days} ngày).`);
    showToast("Đã gửi đơn xin nghỉ phép thành công! Đang chờ duyệt.", "success");
    
    DOM.leaveRequestForm.reset();
    DOM.leaveCalculatedDays.textContent = "0 ngày";
    DOM.empRemainingLeavesBadge.textContent = "0 ngày";
    
    renderLeaveHistory();
    renderNotifications();
    
    // Refresh sidebar badge
    const pendingCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
    if (DOM.pendingBadge) {
        if (pendingCount > 0) {
            DOM.pendingBadge.textContent = pendingCount;
            DOM.pendingBadge.style.display = "inline-block";
        } else {
            DOM.pendingBadge.style.display = "none";
        }
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
                <span class="history-emp-name">${req.empName}</span>
                <span class="history-badge ${badgeClass}">${req.status}</span>
            </div>
            <div class="history-details">
                <div><strong>Loại:</strong> ${req.type}</div>
                <div><strong>Số ngày:</strong> ${req.days} ngày</div>
                <div style="grid-column: span 2;"><strong>Thời gian:</strong> ${formatDate(req.startDate)} - ${formatDate(req.endDate)}</div>
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
        const initials = req.empName.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase();
        
        const card = document.createElement("div");
        card.className = "approval-card";
        card.innerHTML = `
            <div class="approval-profile">
                <div class="employee-avatar">${initials}</div>
                <div class="approval-info">
                    <span class="approval-emp-name">${req.empName}</span>
                    <span class="approval-emp-dept">${req.empId} • <strong>${req.empDept}</strong></span>
                </div>
            </div>
            
            <div class="approval-dates">
                <div><strong>Loại phép:</strong> ${req.type}</div>
                <div><strong>Thời gian nghỉ:</strong> ${formatDate(req.startDate)} đến ${formatDate(req.endDate)}</div>
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

window.decideLeaveRequest = function(reqId, action) {
    const reqIndex = leaveRequests.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;
    
    const req = leaveRequests[reqIndex];
    const emp = employees.find(e => e.id === req.empId);
    
    if (action === "approve") {
        req.status = "Đã duyệt";
        logActivity("success", `Yêu cầu phép của <strong>${req.empName}</strong> đã được PHÊ DUYỆT (${req.days} ngày).`);
        showToast(`Đã duyệt đơn xin nghỉ của ${req.empName}!`, "success");
        
        if (emp) {
            if (req.type === "Nghỉ phép năm") {
                emp.remainingLeaves = Math.max(0, emp.remainingLeaves - req.days);
            }
            const today = new Date().toISOString().split("T")[0];
            if (today >= req.startDate && today <= req.endDate) {
                emp.status = "Nghỉ phép";
            }
        }
    } else {
        req.status = "Từ chối";
        logActivity("danger", `Từ chối yêu cầu nghỉ phép của <strong>${req.empName}</strong>.`);
        showToast(`Đã từ chối đơn nghỉ phép của ${req.empName}.`, "warning");
    }
    
    AppStore.set("leave_requests", leaveRequests);
    AppStore.set("employees", employees);
    
    renderApprovals();
    
    // Refresh sidebar badge
    const pendingCount = leaveRequests.filter(r => r.status === "Chờ duyệt").length;
    if (DOM.pendingBadge) {
        if (pendingCount > 0) {
            DOM.pendingBadge.textContent = pendingCount;
            DOM.pendingBadge.style.display = "inline-block";
        } else {
            DOM.pendingBadge.style.display = "none";
        }
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
    const newAct = {
        id: `act-${Date.now()}`,
        type,
        text,
        time: "Vừa xong"
    };
    activities.unshift(newAct);
    AppStore.set("activities", activities);
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
