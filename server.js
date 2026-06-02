/* ==========================================================================
   HR PORTAL BACKEND SERVER - EXPRESS & SQLITE3
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests (supports CORS for direct file:// or localhost:5173 access)
app.use(cors());
app.use(express.json());

// Serve vanilla HTML/CSS/JS frontend statically
app.use(express.static(path.join(__dirname, 'hr-management-app')));

// --- SQLITE DATABASE CONNECTION ---
const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database at:', DB_PATH);
        // Enable WAL mode (Write-Ahead Logging) for high performance concurrent read/writes
        db.run('PRAGMA journal_mode = WAL');
        initializeDatabase();
    }
});

// --- DATABASE DDL & SEEDING ---
function initializeDatabase() {
    db.serialize(() => {
        // 1. Create Tables
        db.run(`
            CREATE TABLE IF NOT EXISTS departments (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                desc TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS roles (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                dept TEXT NOT NULL,
                desc TEXT,
                FOREIGN KEY (dept) REFERENCES departments(name)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                gender TEXT,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                dept TEXT,
                role TEXT,
                join_date TEXT,
                salary REAL,
                total_leaves INTEGER DEFAULT 12,
                remaining_leaves INTEGER DEFAULT 12,
                status TEXT DEFAULT 'Đang làm việc',
                FOREIGN KEY (dept) REFERENCES departments(name),
                FOREIGN KEY (role) REFERENCES roles(name)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS leave_requests (
                id TEXT PRIMARY KEY,
                emp_id TEXT NOT NULL,
                emp_name TEXT NOT NULL,
                emp_dept TEXT NOT NULL,
                type TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                days INTEGER NOT NULL,
                reason TEXT NOT NULL,
                status TEXT DEFAULT 'Chờ duyệt',
                submitted_at TEXT NOT NULL,
                FOREIGN KEY (emp_id) REFERENCES employees(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                text TEXT NOT NULL,
                time TEXT NOT NULL
            )
        `);

        // 2. Create High-Performance Indexes for 1,000+ employees scalability
        db.run(`CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_employees_dept ON employees(dept)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_leave_requests_emp ON leave_requests(emp_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status)`);

        // 3. Seed Mock Data if tables are empty
        seedData();
    });
}

function seedData() {
    // A. Seed Departments
    db.get("SELECT COUNT(*) as count FROM departments", (err, row) => {
        if (row && row.count === 0) {
            const depts = [
                { id: "PB001", name: "Kỹ thuật", desc: "Chịu trách nhiệm phát triển sản phẩm và giải pháp kỹ thuật." },
                { id: "PB002", name: "Nhân sự", desc: "Quản lý tuyển dụng, đào tạo và phúc lợi nhân viên." },
                { id: "PB003", name: "Marketing", desc: "Xây dựng chiến lược truyền thông và thương hiệu." },
                { id: "PB004", name: "Kinh doanh", desc: "Phát triển doanh số và chăm sóc khách hàng." },
                { id: "PB005", name: "Thiết kế", desc: "Thiết kế giao diện và trải nghiệm người dùng." }
            ];
            const stmt = db.prepare("INSERT INTO departments (id, name, desc) VALUES (?, ?, ?)");
            depts.forEach(d => stmt.run(d.id, d.name, d.desc));
            stmt.finalize();
            console.log('Seeded default departments.');
        }
    });

    // B. Seed Roles
    db.get("SELECT COUNT(*) as count FROM roles", (err, row) => {
        if (row && row.count === 0) {
            const roles = [
                { id: "CV001", name: "Kỹ sư Backend chính", dept: "Kỹ thuật", desc: "Phát triển hệ thống máy chủ và API" },
                { id: "CV002", name: "Trưởng phòng HR", dept: "Nhân sự", desc: "Quản lý tuyển dụng và chính sách nhân sự" },
                { id: "CV003", name: "Frontend Developer", dept: "Kỹ thuật", desc: "Xây dựng giao diện ứng dụng web" },
                { id: "CV004", name: "Chuyên viên Content", dept: "Marketing", desc: "Lập kế hoạch và sản xuất nội dung" },
                { id: "CV005", name: "UI/UX Designer", dept: "Thiết kế", desc: "Thiết kế trải nghiệm và giao diện người dùng" },
                { id: "CV006", name: "Trưởng nhóm Kinh doanh", dept: "Kinh doanh", desc: "Định hướng mục tiêu doanh số bán hàng" }
            ];
            const stmt = db.prepare("INSERT INTO roles (id, name, dept, desc) VALUES (?, ?, ?, ?)");
            roles.forEach(r => stmt.run(r.id, r.name, r.dept, r.desc));
            stmt.finalize();
            console.log('Seeded default roles.');
        }
    });

    // C. Seed 1,000+ Mock Employees dynamically to demonstrate high scalability
    db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
        if (row && row.count === 0) {
            console.log('Generating 1,015 mock employees in SQLite (Please wait a second)...');
            
            // Initial 6 core employees to keep mock data fully matching previous frontends
            const coreEmployees = [
                { id: "NV001", name: "Nguyễn Minh Tuấn", gender: "Nam", email: "tuan.nm@company.com", phone: "0912345678", dept: "Kỹ thuật", role: "Kỹ sư Backend chính", join_date: "2023-01-15", salary: 26000000, total_leaves: 12, remaining_leaves: 8, status: "Đang làm việc" },
                { id: "NV002", name: "Trần Thị Mai", gender: "Nữ", email: "mai.tt@company.com", phone: "0987654321", dept: "Nhân sự", role: "Trưởng phòng HR", join_date: "2022-05-10", salary: 32000000, total_leaves: 15, remaining_leaves: 12, status: "Đang làm việc" },
                { id: "NV003", name: "Lê Hoàng Nam", gender: "Nam", email: "nam.lh@company.com", phone: "0905123456", dept: "Kỹ thuật", role: "Frontend Developer", join_date: "2024-03-01", salary: 19500000, total_leaves: 12, remaining_leaves: 7, status: "Nghỉ phép" },
                { id: "NV004", name: "Phạm Thanh Hương", gender: "Nữ", email: "huong.pt@company.com", phone: "0977889900", dept: "Marketing", role: "Chuyên viên Content", join_date: "2023-11-20", salary: 16000000, total_leaves: 12, remaining_leaves: 11, status: "Đang làm việc" },
                { id: "NV005", name: "Đặng Anh Tú", gender: "Nam", email: "tu.da@company.com", phone: "0933445566", dept: "Thiết kế", role: "UI/UX Designer", join_date: "2024-02-15", salary: 22000000, total_leaves: 12, remaining_leaves: 9, status: "Đang làm việc" },
                { id: "NV006", name: "Bùi Văn Hùng", gender: "Nam", email: "hung.bv@company.com", phone: "0966554433", dept: "Kinh doanh", role: "Trưởng nhóm Kinh doanh", join_date: "2022-09-01", salary: 28000000, total_leaves: 12, remaining_leaves: 0, status: "Đã nghỉ việc" }
            ];

            const stmt = db.prepare(`
                INSERT INTO employees (
                    id, name, gender, email, phone, dept, role, join_date, salary, total_leaves, remaining_leaves, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            // Insert core employees first
            coreEmployees.forEach(e => {
                stmt.run(e.id, e.name, e.gender, e.email, e.phone, e.dept, e.role, e.join_date, e.salary, e.total_leaves, e.remaining_leaves, e.status);
            });

            // Vietnamese Name pools for random generation
            const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
            const midNames = ["Minh", "Văn", "Đức", "Thành", "Hồng", "Khánh", "Anh", "Hoàng", "Tuấn", "Hùng", "Ngọc", "Thanh", "Quốc", "Huy", "Duy"];
            const lastNamesNam = ["Tuấn", "Hùng", "Nam", "Tú", "Huy", "Duy", "Đức", "Hải", "Phương", "Bảo", "Phong", "Thịnh", "Sơn", "Long", "Vinh"];
            const lastNamesNu = ["Mai", "Hương", "Trang", "Quỳnh", "Vy", "Yến", "Lan", "Thảo", "Linh", "Hà", "Nhung", "Cúc", "Trúc", "Đào", "Anh"];
            
            const deptsWithRoles = [
                { name: "Kỹ thuật", roles: ["Kỹ sư Backend chính", "Frontend Developer"] },
                { name: "Nhân sự", roles: ["Trưởng phòng HR"] },
                { name: "Marketing", roles: ["Chuyên viên Content"] },
                { name: "Thiết kế", roles: ["UI/UX Designer"] },
                { name: "Kinh doanh", roles: ["Trưởng nhóm Kinh doanh"] }
            ];

            // Helper to remove accents for email generation
            function removeAccents(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
            }

            // Generate 1009 more employees to reach 1015 employees
            for (let i = 7; i <= 1015; i++) {
                const isMale = Math.random() > 0.45;
                const gender = isMale ? "Nam" : "Nữ";
                
                const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const mName = midNames[Math.floor(Math.random() * midNames.length)];
                const lName = isMale 
                    ? lastNamesNam[Math.floor(Math.random() * lastNamesNam.length)] 
                    : lastNamesNu[Math.floor(Math.random() * lastNamesNu.length)];
                
                const fullName = `${fName} ${mName} ${lName}`;
                
                const nameSlug = removeAccents(`${lName}.${fName.substring(0,1)}${mName.substring(0,1)}`);
                const email = `${nameSlug}.${i}@company.com`;
                
                const phone = `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
                
                const deptObj = deptsWithRoles[Math.floor(Math.random() * deptsWithRoles.length)];
                const dept = deptObj.name;
                const role = deptObj.roles[Math.floor(Math.random() * deptObj.roles.length)];
                
                // Random join date from last 4 years
                const year = 2022 + Math.floor(Math.random() * 4);
                const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
                const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
                const join_date = `${year}-${month}-${day}`;
                
                const salary = 8000000 + Math.floor(Math.random() * 32) * 1000000; // 8M to 40M VND
                const total_leaves = Math.random() > 0.8 ? 15 : 12;
                const remaining_leaves = Math.floor(Math.random() * (total_leaves + 1));
                
                // 95% active, 4% on leave, 1% resigned
                const rand = Math.random();
                const status = rand > 0.99 ? "Đã nghỉ việc" : (rand > 0.95 ? "Nghỉ phép" : "Đang làm việc");

                const empId = `NV${String(i).padStart(3, '0')}`;
                stmt.run(empId, fullName, gender, email, phone, dept, role, join_date, salary, total_leaves, remaining_leaves, status);
            }
            
            stmt.finalize();
            console.log('Database successfully seeded with 1,015 mock employees!');
        }
    });

    // D. Seed Leave Requests & Activities
    db.get("SELECT COUNT(*) as count FROM leave_requests", (err, row) => {
        if (row && row.count === 0) {
            const reqs = [
                { id: "LR001", emp_id: "NV003", emp_name: "Lê Hoàng Nam", emp_dept: "Kỹ thuật", type: "Nghỉ ốm", start_date: "2026-05-24", end_date: "2026-05-26", days: 3, reason: "Sốt siêu vi, bác sĩ chỉ định nghỉ ngơi tại nhà.", status: "Đã duyệt", submitted_at: "2026-05-23 09:30" },
                { id: "LR002", emp_id: "NV001", emp_name: "Nguyễn Minh Tuấn", emp_dept: "Kỹ thuật", type: "Nghỉ phép năm", start_date: "2026-05-28", end_date: "2026-05-30", days: 3, reason: "Giải quyết công việc cá nhân ở quê.", status: "Chờ duyệt", submitted_at: "2026-05-24 08:15" },
                { id: "LR003", emp_id: "NV004", emp_name: "Phạm Thanh Hương", emp_dept: "Marketing", type: "Nghỉ phép năm", start_date: "2026-06-10", end_date: "2026-06-12", days: 3, reason: "Nghỉ phép hè du lịch cùng gia đình.", status: "Chờ duyệt", submitted_at: "2026-05-24 14:45" }
            ];
            const stmt = db.prepare(`
                INSERT INTO leave_requests (
                    id, emp_id, emp_name, emp_dept, type, start_date, end_date, days, reason, status, submitted_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            reqs.forEach(r => stmt.run(r.id, r.emp_id, r.emp_name, r.emp_dept, r.type, r.start_date, r.end_date, r.days, r.reason, r.status, r.submitted_at));
            stmt.finalize();
            console.log('Seeded default leave requests.');
        }
    });

    db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
        if (row && row.count === 0) {
            const acts = [
                { type: "success", text: "Yêu cầu nghỉ phép của <strong>Lê Hoàng Nam</strong> đã được phê duyệt.", time: "Hôm qua lúc 17:00" },
                { type: "info", text: "Nhân viên mới <strong>Đặng Anh Tú</strong> được thêm vào phòng Thiết kế.", time: "3 ngày trước" },
                { type: "warning", text: "Hệ thống ghi nhận <strong>Nguyễn Minh Tuấn</strong> gửi yêu cầu nghỉ phép mới.", time: "Hôm nay lúc 08:15" }
            ];
            const stmt = db.prepare("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)");
            acts.forEach(a => stmt.run(a.type, a.text, a.time));
            stmt.finalize();
            console.log('Seeded default activities.');
        }
    });
}

// --- API ROUTES ---

// 1. Phân hệ Phòng ban (Departments)
app.get('/api/departments', (req, res) => {
    db.all("SELECT * FROM departments ORDER BY id ASC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/departments', (req, res) => {
    const { name, desc } = req.body;
    if (!name) return res.status(400).json({ error: "Tên phòng ban là bắt buộc" });

    db.get("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) as max_val FROM departments", (err, row) => {
        const nextId = row && row.max_val ? row.max_val + 1 : 1;
        const newId = `PB${String(nextId).padStart(3, '0')}`;

        db.run("INSERT INTO departments (id, name, desc) VALUES (?, ?, ?)", [newId, name, desc], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // Add activity
            db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["success", `Phòng ban mới <strong>${name}</strong> đã được thêm vào hệ thống.`, "Vừa xong"]);
            res.json({ id: newId, name, desc });
        });
    });
});

app.put('/api/departments/:id', (req, res) => {
    const { name, desc } = req.body;
    const { id } = req.params;

    db.get("SELECT name FROM departments WHERE id = ?", [id], (err, oldDept) => {
        if (!oldDept) return res.status(404).json({ error: "Phòng ban không tồn tại" });
        const oldName = oldDept.name;

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.run("UPDATE departments SET name = ?, desc = ? WHERE id = ?", [name, desc, id]);
            // Sync with employees and roles
            db.run("UPDATE employees SET dept = ? WHERE dept = ?", [name, oldName]);
            db.run("UPDATE roles SET dept = ? WHERE dept = ?", [name, oldName]);
            db.run("COMMIT", (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["info", `Phòng ban <strong>${oldName}</strong> đã được đổi tên thành <strong>${name}</strong>.`, "Vừa xong"]);
                res.json({ id, name, desc });
            });
        });
    });
});

app.delete('/api/departments/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT name FROM departments WHERE id = ?", [id], (err, dept) => {
        if (!dept) return res.status(404).json({ error: "Phòng ban không tồn tại" });
        const deptName = dept.name;

        // Check if there are active employees or roles linked
        db.get("SELECT COUNT(*) as count FROM employees WHERE dept = ? AND status != 'Đã nghỉ việc'", [deptName], (err, empRow) => {
            db.get("SELECT COUNT(*) as count FROM roles WHERE dept = ?", [deptName], (err, roleRow) => {
                if (empRow.count > 0 || roleRow.count > 0) {
                    return res.status(400).json({ error: `Không thể xóa phòng ban này vì còn ${empRow.count} nhân viên và ${roleRow.count} chức vụ liên kết.` });
                }

                db.run("DELETE FROM departments WHERE id = ?", [id], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["danger", `Phòng ban <strong>${deptName}</strong> đã bị xóa khỏi hệ thống.`, "Vừa xong"]);
                    res.json({ success: true, message: `Đã xóa phòng ban ${deptName}` });
                });
            });
        });
    });
});

// 2. Phân hệ Chức vụ (Roles)
app.get('/api/roles', (req, res) => {
    db.all("SELECT * FROM roles ORDER BY id ASC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/roles', (req, res) => {
    const { name, dept, desc } = req.body;
    if (!name || !dept) return res.status(400).json({ error: "Tên chức vụ và phòng ban liên kết là bắt buộc" });

    db.get("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) as max_val FROM roles", (err, row) => {
        const nextId = row && row.max_val ? row.max_val + 1 : 1;
        const newId = `CV${String(nextId).padStart(3, '0')}`;

        db.run("INSERT INTO roles (id, name, dept, desc) VALUES (?, ?, ?, ?)", [newId, name, dept, desc], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["success", `Chức vụ mới <strong>${name}</strong> (${newId}) đã được tạo.`, "Vừa xong"]);
            res.json({ id: newId, name, dept, desc });
        });
    });
});

app.put('/api/roles/:id', (req, res) => {
    const { name, dept, desc } = req.body;
    const { id } = req.params;

    db.get("SELECT name FROM roles WHERE id = ?", [id], (err, oldRole) => {
        if (!oldRole) return res.status(404).json({ error: "Chức vụ không tồn tại" });
        const oldName = oldRole.name;

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.run("UPDATE roles SET name = ?, dept = ?, desc = ? WHERE id = ?", [name, dept, desc, id]);
            // Sync with employees
            db.run("UPDATE employees SET role = ?, dept = ? WHERE role = ?", [name, dept, oldName]);
            db.run("COMMIT", (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["info", `Chức vụ <strong>${oldName}</strong> đã được đổi tên thành <strong>${name}</strong>.`, "Vừa xong"]);
                res.json({ id, name, dept, desc });
            });
        });
    });
});

app.delete('/api/roles/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT name FROM roles WHERE id = ?", [id], (err, role) => {
        if (!role) return res.status(404).json({ error: "Chức vụ không tồn tại" });
        const roleName = role.name;

        // Check if employees are assigned to this role
        db.get("SELECT COUNT(*) as count FROM employees WHERE role = ? AND status != 'Đã nghỉ việc'", [roleName], (err, empRow) => {
            if (empRow.count > 0) {
                return res.status(400).json({ error: `Không thể xóa! Có ${empRow.count} nhân viên đang đảm nhiệm chức vụ này.` });
            }

            db.run("DELETE FROM roles WHERE id = ?", [id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["danger", `Chức vụ <strong>${roleName}</strong> đã bị xóa khỏi hệ thống.`, "Vừa xong"]);
                res.json({ success: true, message: `Đã xóa chức vụ ${roleName}` });
            });
        });
    });
});

// 3. Phân hệ Nhân viên (Employees)
app.get('/api/employees', (req, res) => {
    db.all("SELECT * FROM employees ORDER BY id ASC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/employees', (req, res) => {
    const { name, gender, email, phone, dept, role, join_date, salary, total_leaves, status } = req.body;
    
    if (!name || !email || !phone || !role || !join_date || isNaN(salary)) {
        return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin bắt buộc" });
    }

    // Validation: Name must not contain special characters or numbers
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƯưăâêôơư\s]+$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ error: "Họ tên không được chứa số hoặc ký tự đặc biệt!" });
    }

    // Validation: Phone must not contain letters
    const phoneRegex = /^[^a-zA-Z]+$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Số điện thoại không được chứa chữ cái!" });
    }

    const digitOnlyPhone = phone.replace(/[^0-9]/g, "");
    if (digitOnlyPhone.length < 9 || digitOnlyPhone.length > 11) {
        return res.status(400).json({ error: "Số điện thoại phải chứa từ 9 đến 11 chữ số!" });
    }

    db.get("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) as max_val FROM employees", (err, row) => {
        const nextId = row && row.max_val ? row.max_val + 1 : 1;
        const newId = `NV${String(nextId).padStart(3, '0')}`;
        const leaves = total_leaves || 12;

        db.run(`
            INSERT INTO employees (
                id, name, gender, email, phone, dept, role, join_date, salary, total_leaves, remaining_leaves, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [newId, name, gender, email, phone, dept, role, join_date, salary, leaves, leaves, status || 'Đang làm việc'], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["info", `Nhân viên mới <strong>${name}</strong> (${newId}) đã được thêm vào phòng ${dept}.`, "Vừa xong"]);
            res.json({ id: newId, name, gender, email, phone, dept, role, join_date, salary, total_leaves: leaves, remaining_leaves: leaves, status });
        });
    });
});

app.put('/api/employees/:id', (req, res) => {
    const { name, gender, email, phone, dept, role, join_date, salary, total_leaves, status } = req.body;
    const { id } = req.params;

    if (!name || !email || !phone || !role || !join_date || isNaN(salary)) {
        return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin bắt buộc" });
    }

    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƯưăâêôơư\s]+$/;
    if (!nameRegex.test(name)) return res.status(400).json({ error: "Họ tên không được chứa số hoặc ký tự đặc biệt!" });

    const phoneRegex = /^[^a-zA-Z]+$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ error: "Số điện thoại không được chứa chữ cái!" });

    const digitOnlyPhone = phone.replace(/[^0-9]/g, "");
    if (digitOnlyPhone.length < 9 || digitOnlyPhone.length > 11) {
        return res.status(400).json({ error: "Số điện thoại phải chứa từ 9 đến 11 chữ số!" });
    }

    db.get("SELECT total_leaves, remaining_leaves, name FROM employees WHERE id = ?", [id], (err, oldEmp) => {
        if (!oldEmp) return res.status(404).json({ error: "Nhân viên không tồn tại" });

        const diff = (total_leaves || 12) - oldEmp.total_leaves;
        const newRemaining = Math.max(0, oldEmp.remaining_leaves + diff);

        db.run(`
            UPDATE employees SET 
                name = ?, gender = ?, email = ?, phone = ?, dept = ?, role = ?, join_date = ?, salary = ?, 
                total_leaves = ?, remaining_leaves = ?, status = ?
            WHERE id = ?
        `, [name, gender, email, phone, dept, role, join_date, salary, total_leaves || 12, newRemaining, status, id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["info", `Hồ sơ nhân viên <strong>${name}</strong> (${id}) đã được chỉnh sửa.`, "Vừa xong"]);
            res.json({ id, name, gender, email, phone, dept, role, join_date, salary, total_leaves, remaining_leaves: newRemaining, status });
        });
    });
});

app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT name FROM employees WHERE id = ?", [id], (err, emp) => {
        if (!emp) return res.status(404).json({ error: "Nhân viên không tồn tại" });

        db.run("UPDATE employees SET status = 'Đã nghỉ việc' WHERE id = ?", [id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["danger", `Hồ sơ nhân viên <strong>${emp.name}</strong> đã chuyển sang trạng thái <strong>Đã nghỉ việc</strong>.`, "Vừa xong"]);
            res.json({ success: true, message: `Đã chuyển nhân viên ${emp.name} sang Trạng thái Đã nghỉ việc` });
        });
    });
});

// 4. Phân hệ Nghỉ phép (Leave requests)
app.get('/api/leave-requests', (req, res) => {
    db.all("SELECT * FROM leave_requests ORDER BY submitted_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/leave-requests', (req, res) => {
    const { emp_id, type, start_date, end_date, days, reason } = req.body;
    
    if (!emp_id || !start_date || !end_date || !reason || isNaN(days)) {
        return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc" });
    }

    db.get("SELECT name, dept, remaining_leaves FROM employees WHERE id = ?", [emp_id], (err, emp) => {
        if (!emp) return res.status(404).json({ error: "Nhân viên không tồn tại" });

        if (type === "Nghỉ phép năm" && emp.remaining_leaves < days) {
            return res.status(400).json({ error: `Nhân viên chỉ còn ${emp.remaining_leaves} ngày phép năm, không đủ cho yêu cầu ${days} ngày!` });
        }

        db.get("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) as max_val FROM leave_requests", (err, row) => {
            const nextId = row && row.max_val ? row.max_val + 1 : 1;
            const newId = `LR${String(nextId).padStart(3, '0')}`;
            const now = new Date();
            const dateStr = now.toISOString().split("T")[0];
            const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
            const submitted = `${dateStr} ${timeStr}`;

            db.run(`
                INSERT INTO leave_requests (
                    id, emp_id, emp_name, emp_dept, type, start_date, end_date, days, reason, status, submitted_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [newId, emp_id, emp.name, emp.dept, type, start_date, end_date, days, reason, 'Chờ duyệt', submitted], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                
                db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", ["warning", `<strong>${emp.name}</strong> gửi đơn xin nghỉ phép <strong>${type}</strong> (${days} ngày).`, "Vừa xong"]);
                res.json({ id: newId, emp_id, emp_name: emp.name, emp_dept: emp.dept, type, start_date, end_date, days, reason, status: 'Chờ duyệt', submitted_at: submitted });
            });
        });
    });
});

app.put('/api/leave-requests/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status || (status !== 'Đã duyệt' && status !== 'Từ chối')) {
        return res.status(400).json({ error: "Trạng thái phê duyệt không hợp lệ" });
    }

    db.get("SELECT * FROM leave_requests WHERE id = ?", [id], (err, request) => {
        if (!request) return res.status(404).json({ error: "Không tìm thấy yêu cầu nghỉ phép" });
        if (request.status !== 'Chờ duyệt') return res.status(400).json({ error: "Đơn xin phép này đã được xử lý từ trước" });

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.run("UPDATE leave_requests SET status = ? WHERE id = ?", [status, id]);
            
            if (status === 'Đã duyệt') {
                // Deduct remaining leaves if annual leave
                if (request.type === 'Nghỉ phép năm') {
                    db.run("UPDATE employees SET remaining_leaves = MAX(0, remaining_leaves - ?) WHERE id = ?", [request.days, request.emp_id]);
                }
                
                // Update employee status to 'Nghỉ phép' if leave spans today
                const today = new Date().toISOString().split("T")[0];
                if (today >= request.start_date && today <= request.end_date) {
                    db.run("UPDATE employees SET status = 'Nghỉ phép' WHERE id = ?", [request.emp_id]);
                }
            }
            
            db.run("COMMIT", (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }

                const actType = status === 'Đã duyệt' ? 'success' : 'danger';
                const actText = status === 'Đã duyệt' 
                    ? `Yêu cầu phép của <strong>${request.emp_name}</strong> đã được PHÊ DUYỆT (${request.days} ngày).`
                    : `Từ chối yêu cầu nghỉ phép của <strong>${request.emp_name}</strong>.`;

                db.run("INSERT INTO activities (type, text, time) VALUES (?, ?, ?)", [actType, actText, "Vừa xong"]);
                res.json({ id, status });
            });
        });
    });
});

// 5. Phân hệ Hoạt động (Activities)
app.get('/api/activities', (req, res) => {
    db.all("SELECT * FROM activities ORDER BY id DESC LIMIT 20", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- RUN SERVER ---
app.listen(PORT, () => {
    console.log(`HR Management Backend is running on port ${PORT}`);
    console.log(`Serving static UI from ${path.join(__dirname, 'hr-management-app')}`);
});
