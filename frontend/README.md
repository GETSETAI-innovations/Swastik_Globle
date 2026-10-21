# Multi-Company Employee Management & Quotation Procurement System

A modern, responsive, institutional-grade web application built for multi-company workforce governance, tender bidding, and quotation procurement with mandatory two-stage statutory approval workflows.

## 🚀 Technology Stack

- **React 19** with **Vite** and **JavaScript (JSX)**
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **React Router v7** for navigation & route guards
- **Recharts** for dashboard analytics
- **Framer Motion** for subtle UI interactions
- **Local State & Reactive Mock Database** with persistent browser storage

---

## 🏛️ Architecture & Role-Based Experiences

The system implements four distinct role experiences, each with its own visual palette, permissions, KPI metrics, and navigation rails:

| Role | Palette Identity | Primary / Accent | Purpose |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Navy + Teal | `#0B1F3A` / `#0F766E` | Global HQ oversight, company ledgers, final Stage-2 approval, central audit trail |
| **Company Admin** | Royal Blue | `#173B70` / `#2563EB` | Company workforce, attendance logs, work update review, Stage-1 approval |
| **Employee** | Indigo + Violet | `#3730A3` / `#6366F1` | Daily work reporting, hours tracking, personal attendance calendar, session history |
| **Salesperson** | Emerald + Slate | `#14532D` / `#059669` | Tender bidding, 9-step quotation preparation, PDF manifest uploads, win-rate tracking |

---

## 🔑 Demo Accounts (One-Click Login)

The login page provides one-click demo role selectors:

- **Super Admin**: `superadmin@swastik.gov.in` (Password: `admin123`)
- **Company Admin**: `rajesh@swastik.gov.in` (Password: `admin123`)
- **Employee**: `arjun@swastik.gov.in` (Password: `employee123`)
- **Salesperson**: `deepak@swastik.gov.in` (Password: `sales123`)

*Note: You can also instantly switch between all four roles from the active role dropdown located in the top navigation bar at any time.*

---

## ⚙️ Core Modules & Features

### 1. Two-Stage Mandatory Approval Workflow
- **Salesperson** submits quotation with line items and PDF attachment.
- **Company Admin** performs Stage 1 technical review and approves or rejects with remarks.
- **Super Admin HQ** review remains strictly **locked** until Stage 1 succeeds.
- Once Stage 1 is cleared, **Super Admin** grants final Stage 2 statutory approval.
- Upon Stage 2 clearance, **Purchase Order generation is unlocked**.

### 2. Side-by-Side Quotation Comparison Matrix
- Compare multiple vendor quotes for a single requisition.
- Automatic **Lowest Evaluated Price** tagging and percentage delta calculation.
- Evaluates price, delivery lead time, warranty, payment terms, and statutory compliance.
- Supports value-based procurement selection adhering to GFR 2017 Rule 149.
- **PDF Preview Modal** rendering official supplier manifests with digital signature stamps.

### 3. Purchase Order Management
- Generates official Purchase Orders with line items, GST breakdown, and delivery milestones.
- Tracks shipment lifecycle (`Pending Dispatch` → `In Transit` → `Delivered` → `Completed`).
- One-click print and PDF export.

### 4. Employee Management & Work Reporting
- Complete staff directory with department, designation, and account status toggles.
- Daily work update reporting with task titles, deliverables, hours logged, and admin feedback.
- Monthly attendance calendar with compliance tracking and duty hour averages.

### 5. Central Immutable Audit Trail
- Chronological, tamper-evident audit logging for all critical system actions (logins, uploads, approvals, rejections, PO creations).
- Filterable by event type and user.

---

## 💻 Running the Application

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/`.

### Build for Production
```bash
npm run build
```
The production bundle will be output to `frontend/dist/`.
