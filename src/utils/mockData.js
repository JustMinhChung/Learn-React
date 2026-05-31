// Mock data for HR Portal

export const DEFAULT_EMPLOYEES = [
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

export const DEFAULT_LEAVE_REQUESTS = [
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

export const DEFAULT_ROLES = [
    { id: "CV001", name: "Kỹ sư Backend chính", dept: "Kỹ thuật", desc: "Phát triển hệ thống máy chủ và API" },
    { id: "CV002", name: "Trưởng phòng HR", dept: "Nhân sự", desc: "Quản lý tuyển dụng và chính sách nhân sự" },
    { id: "CV003", name: "Frontend Developer", dept: "Kỹ thuật", desc: "Xây dựng giao diện ứng dụng web" },
    { id: "CV004", name: "Chuyên viên Content", dept: "Marketing", desc: "Lập kế hoạch và sản xuất nội dung" },
    { id: "CV005", name: "UI/UX Designer", dept: "Thiết kế", desc: "Thiết kế trải nghiệm và giao diện người dùng" },
    { id: "CV006", name: "Trưởng nhóm Kinh doanh", dept: "Kinh doanh", desc: "Định hướng mục tiêu doanh số bán hàng" }
];

export const DEFAULT_DEPARTMENTS = [
    { id: "PB001", name: "Kỹ thuật", desc: "Chịu trách nhiệm phát triển sản phẩm và giải pháp kỹ thuật." },
    { id: "PB002", name: "Nhân sự", desc: "Quản lý tuyển dụng, đào tạo và phúc lợi nhân viên." },
    { id: "PB003", name: "Marketing", desc: "Xây dựng chiến lược truyền thông và thương hiệu." },
    { id: "PB004", name: "Kinh doanh", desc: "Phát triển doanh số và chăm sóc khách hàng." },
    { id: "PB005", name: "Thiết kế", desc: "Thiết kế giao diện và trải nghiệm người dùng." }
];

export const DEFAULT_ACTIVITIES = [
    {
        id: "act-1",
        type: "success",
        text: "Yêu cầu nghỉ phép của Lê Hoàng Nam đã được phê duyệt.",
        time: "Hôm qua lúc 17:00"
    },
    {
        id: "act-2",
        type: "info",
        text: "Nhân viên mới Đặng Anh Tú được thêm vào phòng Thiết kế.",
        time: "3 ngày trước"
    },
    {
        id: "act-3",
        type: "warning",
        text: "Hệ thống ghi nhận Nguyễn Minh Tuấn gửi yêu cầu nghỉ phép mới.",
        time: "Hôm nay lúc 08:15"
    }
];
