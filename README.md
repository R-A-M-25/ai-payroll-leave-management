# AI-Enhanced Employee Payroll & Leave Management System

## 📌 Project Status (Current Milestone)

**Phase:** Authentication & Authorization (COMPLETED ✅)

This project is an enterprise-style full-stack web application designed to manage employee payroll and leave workflows. The foundation of the system — authentication, authorization, and security — has been fully implemented and verified end-to-end.

> ⚠️ Business modules (Leave Management, Payroll Processing, AI/NLP features) are **planned and pending**. This README reflects the project **up to the current stable checkpoint**.

---

## 🧩 Tech Stack

### Frontend

* **React.js** – Component-based UI
* **React Router** – Client-side routing
* **Context API** – Global authentication state
* **LocalStorage** – Session persistence

### Backend

* **Node.js** – Runtime environment
* **Express.js** – REST API framework
* **JWT (jsonwebtoken)** – Stateless authentication
* **bcrypt** – Secure password hashing

### Database

* **PostgreSQL** – Relational database

---

## 🏗️ Architecture Overview

```
React Frontend
   │
   │ (email, password)
   ▼
Express Backend (Auth API)
   │
   │ bcrypt.compare()
   ▼
PostgreSQL (users, roles)
   │
   │ JWT issued (userId, role)
   ▼
Frontend (stores token + role)
   │
   ▼
Protected Backend APIs (JWT Middleware)
```

---

## 🔐 Authentication & Authorization (Implemented)

### Authentication Flow

1. User logs in with **email + password**
2. Backend validates credentials using **bcrypt**
3. On success, backend issues a **JWT** containing:

   * `userId`
   * `role`
   * `iat`, `exp`
4. Frontend stores JWT and role in **localStorage**
5. Session is restored on page refresh

### Authorization Flow

* JWT is sent in every protected request via:

  ```
  Authorization: Bearer <token>
  ```
* Backend middleware verifies:

  * Token validity
  * Token expiry
  * User role

---

## 👥 Role-Based Access Control (RBAC)

### Roles

* **EMPLOYEE** – Basic user (future: apply leave, view payslips)
* **MANAGER** – Approval authority (future: approve/reject leave)
* **HR** – Admin role (system & payroll management)

Roles are stored in a normalized `roles` table and linked to users via foreign keys.

---

## 🗄️ Database Schema (Current)

### `roles` table

| Column | Type        | Description             |
| ------ | ----------- | ----------------------- |
| id     | SERIAL (PK) | Role ID                 |
| name   | VARCHAR     | EMPLOYEE / MANAGER / HR |

### `users` table

| Column        | Type             | Description            |
| ------------- | ---------------- | ---------------------- |
| id            | SERIAL (PK)      | User ID                |
| email         | VARCHAR (UNIQUE) | Login email            |
| password_hash | TEXT             | bcrypt hashed password |
| role_id       | INT (FK)         | Reference to roles     |
| created_at    | TIMESTAMP        | Account creation time  |

---

## 🔑 Backend APIs (Implemented)

### Login

```
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```

**Response**

```json
{
  "token": "<jwt_token>",
  "role": "HR"
}
```

---

### Protected Test Route

```
GET /api/auth/protected
```

**Headers**

```
Authorization: Bearer <jwt_token>
```

**Response**

```json
{
  "message": "Protected route accessed",
  "user": {
    "userId": 1,
    "role": "HR"
  }
}
```

---

## 🧪 Security Verification

The following scenarios were tested and verified:

* ✅ Valid token → access granted
* ❌ No token → 401 Unauthorized
* ❌ Invalid / expired token → 401 Unauthorized
* ❌ Unauthorized role → 403 Forbidden

---


## 🚧 Upcoming Features (Planned)

* Leave Management Module

  * Apply leave (Employee)
  * Approve / Reject leave (Manager)
* Payroll Processing Module
* Role-based API protection for business modules
* AI/NLP-based leave reason analysis (optional)
* Documentation & deployment

---

## 🧠 Design Decisions (Why This Approach)

* **JWT over sessions** → stateless, scalable
* **bcrypt** → secure password storage
* **Normalized roles table** → flexible RBAC
* **AuthContext** → clean frontend state management
* **Secure-first approach** → foundation before features

---

## 📌 Current Status Summary

✔ Authentication complete
✔ Authorization complete
✔ JWT middleware verified
✔ Session persistence working

➡️ Next step: **Leave Management Module**

---

## 🏁 How to Run Locally (Auth Phase)

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

> This README will be **updated incrementally** as new modules are added.
