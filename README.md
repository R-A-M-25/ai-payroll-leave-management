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
> 
 
## Payroll Backend – Salary, Deduction & Payslip Engine

---

## Overview

This project implements a **realistic payroll backend system** that calculates employee salaries by integrating:

- Salary configuration
- Leave management
- Monthly payroll execution
- Accurate unpaid leave (LOP) deductions
- Immutable payslip generation
- Role-based access control

The system ensures that **only approved unpaid leaves that overlap a payroll month affect salary**, while maintaining strict payroll locking and full salary transparency for employees.

---

## Core Design Principles

The payroll system follows real-world HR and enterprise rules:

- Payroll is executed **once per month**
- Payroll results are **immutable**
- Salary changes do **not** affect past payslips
- Only **approved unpaid leaves (LOP)** impact salary
- Leave deductions apply **only to the month they overlap**
- Employees can view salary breakdowns but cannot modify them

These rules prevent incorrect salary calculations and ensure auditability.

---

## Roles & Responsibilities

| Role | Permissions |
|---|---|
| **HR** | Assign salary, run payroll |
| **Employee** | View own payslips and salary breakdown |
| **Manager** | Approve / reject leaves (does not access payroll) |

All permissions are enforced at the **backend level**.

---

## Database Tables Explained

### 1. `employee_salary`

**Purpose**  
Stores **salary history** for each employee.

**Why this table exists**
- Salaries can change over time
- Old payslips must still reflect old salaries
- Payroll must always use the latest effective salary

**Key Fields**
- `employee_id`
- `monthly_salary`
- `effective_from`
- `created_at`

**Behavior**
- HR inserts a new record when salary changes
- Old records are preserved
- Payroll selects the latest effective salary

**Flow**
HR assigns salary
↓
Salary record stored (history preserved)
↓
Payroll fetches latest effective salary


---

### 2. `payroll_runs`

**Purpose**  
Locks payroll execution for a specific month and year.

**Why this table exists**
- Prevents duplicate payroll runs
- Creates an audit trail
- Ensures payslips are immutable

**Key Fields**
- `month`
- `year`
- `run_by`
- `run_at`
- `status`

**Behavior**
- One record per month/year
- If a record already exists → payroll is blocked

**Flow**
HR triggers payroll
↓
Check payroll_runs
↓
Exists? → Stop execution
↓
Not exists → Create payroll run


---

### 3. `payslips`

**Purpose**  
Stores final, immutable salary snapshots for employees.

**Why this table exists**
- Payslips must never change
- Employees need salary transparency
- Calculations should not be re-run dynamically

**Key Fields**
- `employee_id`
- `payroll_run_id`
- `base_salary`
- `lop_days`
- `lop_deduction`
- `net_salary`
- `generated_at`

**Behavior**
- One payslip per employee per payroll run
- Data represents a frozen snapshot

**Flow**
Payroll calculation
↓
Payslip generated (snapshot)
↓
Employee views (read-only)


---

## Unpaid Leave (LOP) Deduction Logic

### Business Rule

> Salary is deducted **only** for approved unpaid leave days that **overlap the payroll month**.

- Past unpaid leaves do not affect future payrolls
- Future unpaid leaves do not affect past payrolls

---

### LOP Day Calculation (Conceptual)

For each approved LOP leave:
↓
Find overlap between:
[leave_start_date, leave_end_date]
and
[payroll_month_start, payroll_month_end]
↓
Count overlapping days
↓
Sum overlapping days → LOP days


This logic:
- Handles multi-day leaves
- Handles month overlaps correctly
- Matches real payroll behavior

---

## Payroll Execution Flow

HR runs payroll
↓
Validate payroll lock (month/year)
↓
For each employee:
↓
Fetch latest effective salary
↓
Calculate overlapping LOP days
↓
Compute salary deduction
↓
Generate payslip
↓
Commit transaction


All steps run inside a database transaction to ensure consistency.

---

## Salary Calculation Formula

Daily Salary = Monthly Salary / 30
LOP Deduction = LOP Days × Daily Salary
Net Salary = Monthly Salary − LOP Deduction


This formula is simple, explainable, and enterprise-safe.

---

## Employee Salary Transparency

Employees can securely view their payslips, which include:

- Base salary
- Number of unpaid leave days
- Deduction amount
- Final net salary

### Example Payslip
Base Salary : 60000
LOP Days : 3
LOP Deduction : 6000
Net Salary : 54000


This ensures employees clearly understand how their salary was calculated.

---

## Security & Data Integrity

- Payroll actions restricted to HR
- Payroll execution locked per month/year
- Payslips are immutable after generation
- Employees can view only their own data
- All business rules enforced at backend level

---

## System State

- Salary history preserved
- Payroll execution auditable
- Leave-based deductions accurate
- Payslips immutable and transparent

The payroll backend is **stable, correct, and production-ready for this scope**.
