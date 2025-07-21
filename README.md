
# 🏢 Employee Management System

A role-based employee management web application for monitoring employee workflow, managing salaries, verifying employees, and handling payroll requests with secure authentication, real-time updates, and an interactive dashboard.

This project is built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

---

## ✨ Features

✅ Role-Based Access Control

* Employee: View personal profile, salary history, and work progress
* HR: Manage employees, verify accounts, initiate payroll requests
* Admin: Approve payroll, manage HR & Employees, view system analytics

✅ Authentication & Authorization

* Firebase Authentication (Email/Password + Google Login)
* JWT-based secure API routes
* Default social login users are assigned the Employee role

✅ Employee Management

* View employee list (HR & Admin)
* Verify employees before initiating payroll
* Update employee details (HR & Admin)

✅ Payroll Management

* HR requests salary payment for verified employees
* Admin approves payroll requests before processing
* Employees view payment history with status (Pending, Paid)

✅ Dashboard & Analytics

* Total employees, verified employees, pending payrolls, etc.
* Monthly payroll trend graph using Recharts
* Role-based dynamic dashboard

✅ Modern UI & UX

* Built with ShadCN UI components
* Dark mode compatible
* Toast notifications for interactions

✅ Image & File Management

* Employee profile photos uploaded via imgbb

✅ Tech Stack

* Frontend: React + Vite, ShadCN UI, TailwindCSS, TanStack Query
* Backend: Node.js, Express.js, MongoDB, JWT
* Auth: Firebase Authentication
* Image Hosting: imgbb

---

## 🚀 Project Structure

```
employee-management-system/
├── client/        # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── ...
├── server/        # Node.js + Express backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── ...
└── README.md
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/employee-management-system.git
cd employee-management-system
```

### 2️⃣ Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside server/

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

---

### 3️⃣ Setup the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside client/

```env
VITE_API_URL=http://localhost:5000
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

Run the frontend:

```bash
npm run dev
```

---

## 🔑 Test Admin Credentials

To access Admin Panel, use the following credentials:

* Email: `eagletheboss@eagle.com`
* Password: `@Eagleboss123`

> ⚠️ Note: For security, change these credentials in production.

---

## 🌟 Pages Overview

* Home Page → Company overview, services, testimonials
* Employee Dashboard → Personal info, workflow tracking, salary history
* HR Dashboard → Employee list, verification, payroll request management
* Admin Dashboard → Approve payroll, manage roles, analytics

---

## 🖼️ Screenshots

*(Add screenshots later for Home, Dashboard, Employee List, Payroll Flow)*

---

## 📡 API Endpoints

### Auth

* `POST /auth/login` → Login
* `POST /auth/register` → Register new user
* `GET /auth/me` → Get logged-in user

### Employees

* `GET /employees` → Get all employees (HR/Admin)
* `PATCH /employees/:id/verify` → Verify employee (HR/Admin)

### Payroll

* `POST /payroll/request` → HR requests payroll
* `GET /payroll` → Get payroll requests
* `PATCH /payroll/:id/approve` → Admin approves payroll

---

## ✅ Future Enhancements

* ✅ Payment gateway integration
* ✅ Real-time notifications for payroll approval
* ✅ Advanced role-based middleware
* ✅ Activity log for all actions

---

## 📝 License

This project is for educational purposes. You may use and modify it freely.

---

Would you like me to also:
✅ Add badges (build status, license, tech stack) for a more professional look?
✅ Generate sample screenshots & add placeholders?
✅ Or write a short CONTRIBUTING.md for contributors?

Should I include those extra enhancements?
