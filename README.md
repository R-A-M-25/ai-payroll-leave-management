# AI-Enhanced Employee Payroll & Leave Management System

## Project Overview

This project is a **secure, role-based employee management system** built to demonstrate how real-world backend systems are designed before adding business features. The work completed so far focuses on **authentication, authorization, organizational hierarchy, and a complete leave management workflow**.

This README explains **what has been implemented and how it works**, without going into code or folder-level details.

---

## What Has Been Built So Far

So far, the project includes:

* Secure authentication using JWT
* Role-based authorization enforced at backend level
* Separation of authentication data and business data
* Organization hierarchy (manager–employee mapping)
* Complete leave management workflow

All of these are **fully working and tested end-to-end**.

---

## Authentication: What We Did and How

### What was done

* Implemented login using email and password
* Passwords are stored only in **hashed form**
* Backend generates a JWT token after successful login

### How it works

```
User enters credentials
        ↓
Backend verifies password securely
        ↓
JWT token is generated (userId + role)
        ↓
Client stores token
        ↓
Token is sent with every protected request
```

### Why this approach

* Prevents password leaks
* Stateless authentication (scalable)
* Backend never trusts frontend alone

---

## Authorization (Role-Based Access Control)

### What was done

* Defined clear user roles
* Enforced role checks on every protected API

### Roles implemented

* **EMPLOYEE** – Apply leave, view own leave history
* **MANAGER** – View and approve team leave requests
* **HR (Admin)** – Top-level manager role

### How authorization works

```
Incoming request
        ↓
JWT verification
        ↓
Extract user role
        ↓
Check role permission
        ↓
Allow or block request
```

This ensures that even if the UI is bypassed, the backend remains secure.

---

## Separation of Users and Employees

### Design decision

* **Users** represent login identities
* **Employees** represent organizational entities

### Why this matters

* Authentication logic stays isolated
* Organization hierarchy becomes clean
* Payroll and HR features can be added later

This separation avoids tight coupling and improves scalability.

---

## Organization Hierarchy

### What was implemented

* Each employee is assigned **one fixed manager**
* One manager can have **multiple employees**

### Hierarchy model

```
Manager
 ├── Employee A
 ├── Employee B
 └── Employee C
```

Employees do not choose approvers; the backend resolves the manager automatically.

---

## Leave Management Module (Completed)

The leave module is the **core business functionality implemented so far**.

---

### Overall Leave Workflow

```
Employee applies leave
        ↓
Leave status = PENDING
        ↓
Manager reviews request
   ┌─────────────┐
   ▼             ▼
APPROVED     REJECTED
```

All state transitions are enforced at the backend.

---

## Apply Leave (Employee)

### How it works

```
Authenticated employee
        ↓
Backend finds employee record
        ↓
Manager resolved from hierarchy
        ↓
Leave created with status = PENDING
```

### Key points

* Employee cannot select manager
* Leave always starts in a neutral state
* Backend controls workflow

---

## Manager View Leave Requests

### How it works

```
Authenticated manager
        ↓
Resolve manager identity
        ↓
Fetch only assigned team leaves
```

Managers can only see leave requests from their own team.

---

## Approve / Reject Leave

### How it works

```
Manager action
        ↓
Verify leave ownership
        ↓
Ensure status = PENDING
        ↓
Update status + review timestamp
```

Invalid actions (re-approval, cross-team access) are blocked.

---

## Employee Leave History

### How it works

```
Authenticated employee
        ↓
Resolve employee identity
        ↓
Fetch only own leave records
```

This provides transparency without exposing others’ data.

---

## Security Measures Implemented

* Secure password hashing
* JWT verification on all protected APIs
* Role-based access control
* Ownership validation before updates
* Restricted database user permissions

Security is enforced by design, not assumed.

---

## Current Completion Status

* Authentication & Authorization ✅
* Organization Hierarchy ✅
* Leave Management Workflow (End-to-End) ✅

This forms a **strong and realistic backend foundation**.

---

## Summary 

> This project demonstrates how to design a secure backend system by completing authentication, authorization, and organizational workflow before adding business features. It implements a full leave management lifecycle with strict backend-enforced rules and real-world hierarchy modeling.

---

> This README documents the work completed so far and will be **extended**, not rewritten, as payroll and other modules are added.
