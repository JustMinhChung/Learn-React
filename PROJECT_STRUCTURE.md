# 📋 HR Management Portal - React

Ứng dụng quản lý nhân sự (HR Portal) được xây dựng với React + Vite

## 📁 Cấu trúc Project

```
src/
├── components/           # Các thành phần React tái sử dụng
│   ├── Common/          # Common components (nếu cần)
│   ├── HR/              # HR-specific components
│   │   └── Leave/       # Leave-related components
│   ├── Layout/          # Layout components
│   │   ├── Sidebar.jsx  # Navigation sidebar
│   │   ├── Header.jsx   # Page header
│   │   └── Toast.jsx    # Toast notifications
│   └── styles/          # Component styles
│       ├── sidebar.css
│       ├── header.css
│       └── toast.css
│
├── pages/               # Các trang chính
│   ├── Dashboard.jsx    # Bảng điều khiển
│   ├── Employees.jsx    # Quản lý nhân viên
│   ├── Departments.jsx  # Quản lý phòng ban
│   ├── Roles.jsx        # Quản lý chức vụ
│   ├── RequestLeave.jsx # Yêu cầu nghỉ phép
│   └── ApproveLeave.jsx # Phê duyệt phép
│
├── contexts/            # React Contexts (State management)
│   └── HRContext.jsx    # Global HR state
│
├── utils/               # Utility functions
│   ├── storage.js       # LocalStorage wrapper
│   ├── mockData.js      # Mock data
│   └── helpers.js       # Helper functions
│
├── styles/              # Global styles
│   └── globals.css      # Global CSS variables & base styles
│
├── App.jsx              # Main App component
├── App.css              # App styles
├── main.jsx             # Entry point
└── index.css            # Base styles

```

## 🚀 Bắt đầu

### Cài đặt
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

## 📦 Cấu trúc Dữ liệu

### Employee
```javascript
{
  id: string,
  name: string,
  gender: string,
  email: string,
  phone: string,
  dept: string,
  role: string,
  joinDate: string,
  salary: number,
  totalLeaves: number,
  remainingLeaves: number,
  status: string
}
```

### Leave Request
```javascript
{
  id: string,
  empId: string,
  empName: string,
  empDept: string,
  type: string,
  startDate: string,
  endDate: string,
  days: number,
  reason: string,
  status: string,
  submittedAt: string
}
```

### Department
```javascript
{
  id: string,
  name: string,
  desc: string
}
```

### Role
```javascript
{
  id: string,
  name: string,
  dept: string,
  desc: string
}
```

## 🎨 Theme System

Ứng dụng hỗ trợ Light/Dark theme:
- Light (mặc định)
- Dark

Theme được lưu trong localStorage (`hr_portal_theme`)

## 💾 Data Persistence

Tất cả dữ liệu được lưu trong localStorage với prefix `hr_portal_`:
- `hr_portal_employees`
- `hr_portal_departments`
- `hr_portal_roles`
- `hr_portal_leave_requests`
- `hr_portal_activities`
- `hr_portal_notifications`
- `hr_portal_theme`

## 🔧 Các Tính Năng

### Dashboard
- Thống kê tổng quan
- Phân bố nhân viên theo phòng ban
- Hoạt động gần đây
- Tóm tắt yêu cầu nghỉ phép

### Quản lý Nhân viên
- Danh sách nhân viên
- Tìm kiếm và lọc theo phòng ban
- Thêm/Sửa/Xóa nhân viên

### Quản lý Phòng ban
- Danh sách phòng ban
- Tìm kiếm
- Thêm/Sửa/Xóa phòng ban

### Quản lý Chức vụ
- Danh sách chức vụ
- Lọc theo phòng ban
- Thêm/Sửa/Xóa chức vụ

### Yêu cầu Nghỉ phép
- Gửi yêu cầu nghỉ phép
- Tính toán tự động số ngày nghỉ
- Hiển thị phép còn lại

### Phê duyệt Phép
- Danh sách yêu cầu chờ duyệt
- Phê duyệt/Từ chối yêu cầu

## 🎨 CSS Variables

Tất cả màu sắc được định nghĩa trong `:root`:
```css
--bg-primary: #f8fafc;
--bg-secondary: #ffffff;
--text-primary: #0f172a;
--text-secondary: #64748b;
--color-primary: #4f46e5;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-danger: #ef4444;
...
```

## 📝 Ghi chú

- Dữ liệu được lưu trữ trong localStorage (mô phỏng database)
- Component được xây dựng với React Hooks
- State management sử dụng React Context
