# 🏥 Dscribe — Hospital Patient Admission Management Web App

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-Python%20FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20Persistent-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, production-grade hospital patient admission and bed dispatch system. Built with **React.js** on the frontend, **Python FastAPI** on the backend, and **persistent SQLite/PostgreSQL** storage with strict dual-layer data validation, real-time search & multi-criteria filtering, and intuitive clinical workflow controls.

---

## 📋 Table of Contents
- [Tech Stack Architecture](#-tech-stack-architecture)
- [Key Features](#-key-features)
- [Validation Matrix](#-validation-matrix)
- [Project Structure](#-project-structure)
- [REST API Reference](#-rest-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup-fastapi)
  - [Frontend Setup](#2-frontend-setup-react)
  - [One-Click Startup](#3-one-click-startup-windows)
- [Running Automated Verification Suite](#-running-automated-verification-suite)
- [Production Deployment Guide](#-production-deployment-guide)

---

## ⚡ Tech Stack Architecture

### Frontend
- **Framework**: React.js (Vite toolchain)
- **Styling**: Tailwind CSS with clinical color palette
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized error intercepts and timeout handling
- **Architecture**: Modular component hierarchy with real-time reactive search, multi-filter dropdowns, and modal dialogs

### Backend
- **Framework**: Python 3 (FastAPI)
- **ASGI Server**: Uvicorn
- **ORM & Database**: SQLAlchemy 2.0 with persistent SQLite (or PostgreSQL via `DATABASE_URL`)
- **Data Validation**: Pydantic v2 with custom field and model validators
- **CORS Handling**: Fast middleware configured for multi-environment access

---

## 🎯 Key Features

1. **Patient Registration & Admission**:
   - Register new admissions with clinical data: Name, Age, Gender, Ward, Department, Doctor, Admission Date, and Status.
   - Intelligent field validations reject erroneous or future dates before submission.

2. **Clean, Organized Records Table**:
   - High-contrast clinical table with patient avatars, age/gender tags, ward/dept indicators, attending physician, and formatted admission dates.
   - Status indicators:
     - 🟢 **Admitted**: Emerald status pill with pulsating active-care indicator.
     - ⚪ **Discharged**: Slate status pill with checkmark.

3. **Live Search**:
   - Instant debounced search querying patient names in real-time.

4. **Multi-Criteria Filter Engine**:
   - Dynamic filters for **Ward**, **Department**, **Attending Doctor**, and **Admission Status**.
   - Active filter count indicator and one-click "Reset All Filters" button.

5. **Editing & Status Updates**:
   - In-place editing modal pre-populated with verified patient details.
   - Quick one-click **"Discharge"** action with server-side duplicate guard.

6. **Patient Deletion with Safety Dialog**:
   - Destructive action confirmation modal with patient name and ID to prevent accidental data loss.

7. **Aggregated Metric Cards**:
   - Top overview dashboard cards displaying **Total Patients**, **Currently Admitted**, **Discharged**, and **Active Clinical Departments**.

8. **Professional ERP Keyboard Navigation**:
   - **`S`** or **`/`**: Instant focus on patient search bar.
   - **`↑` / `↓`** (or **`J` / `K`**): Move active patient row selection up and down with live indicator.
   - **`E`** or **`Enter`**: Edit/view the currently selected patient record.
   - **`D`**: Mark currently selected admitted patient as Discharged.
   - **`Del`** or **`X`** or **`Backspace`**: Open deletion confirmation modal for the active record.
   - **`N`**: Open New Patient Admission registration modal.
   - **`W`**: Jump to Ward filter dropdown.
   - **`P`**: Jump to Department filter dropdown.
   - **`R`**: Reset all active search and dropdown filters.
   - **`?`**: Toggle the interactive Keyboard Shortcuts Cheatsheet.
   - **`Esc`**: Dismiss active dialogs, clear search, and unfocus inputs.

---

## 🛡️ Validation Matrix

| Field | Rule Description | Frontend Enforcement | Backend Enforcement |
|---|---|---|---|
| **Name** | Required, letters and spaces only, length 2–100 chars | Real-time regex `/^[A-Za-z\s]+$/` with inline helper error | Pydantic regex validator + min/max length check (HTTP 422) |
| **Age** | Required, numeric integer between 0 and 120 | Numeric bounds checking (0 ≤ age ≤ 120) | Pydantic integer validator `0 <= age <= 120` (HTTP 422) |
| **Gender** | Required selection (`Male`, `Female`, `Other`) | Dropdown with predefined clinical options | Pydantic enum validation (HTTP 422) |
| **Ward** | Required selection from hospital wards | Dropdown populated via metadata API | Pydantic enum validation (HTTP 422) |
| **Department**| Required selection from clinical departments | Dropdown populated via metadata API | Pydantic enum validation (HTTP 422) |
| **Doctor** | Required selection from registered physicians | Dropdown populated via metadata API | Pydantic enum validation (HTTP 422) |
| **Admission Date** | Required, **strictly cannot be in the future** | HTML5 `max` attribute set to today + JS date comparison | Pydantic validator `admission_date <= date.today()` (HTTP 422) |
| **Status** | Required (`Admitted` or `Discharged`) | Controlled select input | Pydantic enum validation (HTTP 422) |

---

## 📂 Project Structure

```
Assignment/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application & exception handlers
│   │   ├── core/
│   │   │   ├── config.py        # Settings, allowed origins & hospital metadata
│   │   │   └── database.py      # SQLAlchemy engine, session & declarative base
│   │   ├── models/
│   │   │   └── patient.py       # SQLAlchemy Patient database model
│   │   ├── schemas/
│   │   │   └── patient.py       # Pydantic v2 validation models
│   │   ├── crud/
│   │   │   └── patient.py       # Database CRUD queries and aggregations
│   │   └── api/
│   │       └── routes.py        # Clean REST API route endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variable template
│   ├── seed_data.py             # Realistic patient seed script
│   ├── test_backend.py          # Unit tests for database and schemas
│   └── run.py                   # Server runner script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Top bar with branding & quick admission
│   │   │   ├── StatsCards.jsx         # Metric overview cards
│   │   │   ├── SearchAndFilters.jsx   # Search & multi-dropdown filters
│   │   │   ├── PatientTable.jsx       # Responsive table & mobile cards view
│   │   │   ├── PatientModal.jsx       # Add/Edit form with real-time validation
│   │   │   ├── DeleteConfirmModal.jsx # Deletion confirmation safety modal
│   │   │   ├── ToastNotification.jsx  # Auto-dismissing toast alerts
│   │   │   └── EmptyState.jsx         # Friendly empty state & filter resets
│   │   ├── constants/
│   │   │   └── hospitalData.js        # Fallback hospital departments & wards
│   │   ├── services/
│   │   │   └── api.js                 # Centralized Axios API service
│   │   ├── App.jsx                    # Root view & state coordinator
│   │   ├── main.jsx                   # React DOM root entry
│   │   └── index.css                  # Tailwind directives & typography
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── test_full_suite.py           # 15-point end-to-end integration test suite
├── start-all.bat                # Windows one-click dual launcher
├── .gitignore                   # Production gitignore rules
└── README.md                    # Project documentation
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/health` | Server health status | `200` |
| `GET` | `/api/metadata` | Predefined dropdown options (wards, departments, doctors) | `200` |
| `GET` | `/api/stats` | Aggregated dashboard metric counts | `200` |
| `GET` | `/api/patients` | Query patients with optional `search`, `ward`, `department`, `doctor`, `status` | `200` |
| `GET` | `/api/patients/{id}` | Retrieve single patient record by ID | `200`, `404` |
| `POST` | `/api/patients` | Register new patient admission | `201`, `422` |
| `PUT` | `/api/patients/{id}` | Update patient details | `200`, `404`, `422` |
| `PATCH` | `/api/patients/{id}/discharge` | Mark patient as Discharged | `200`, `400`, `404` |
| `DELETE` | `/api/patients/{id}` | Permanently delete patient record | `200`, `404` |

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: 18+ (tested on Node v24)
- **npm** or **pnpm**

---

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Populate the persistent database with sample patient records:
   ```bash
   python seed_data.py
   ```

5. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   *The backend will run on `http://localhost:8000`.*
   *Interactive API documentation (Swagger UI): `http://localhost:8000/docs`.*

---

### 2. Frontend Setup (React)

1. In a new terminal window, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (defaults to local backend):
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

### 3. One-Click Startup (Windows)
If running on Windows, you can simply double-click:
```bash
start-all.bat
```
This automatically launches both backend and frontend servers in separate windows.

---

## 🧪 Running Automated Verification Suite

To verify all 15 automated validation checks, database persistence, and CRUD REST APIs:

```bash
python test_full_suite.py
# or: python backend/tests/test_full_suite.py
```

Expected output:
```
==================================================
   PATIENT ADMISSION MANAGEMENT - VERIFICATION    
==================================================
[PASS] 1. Live GET /health endpoint
[PASS] 2. Live GET /api/metadata (10 wards, 9 departments)
[PASS] 3. Live GET /api/stats (Total: 10, Admitted: 7)
[PASS] 4. Live GET /api/patients?search=Arjun (Found: Arjun Sharma)
[PASS] 5. Live GET /api/patients?department=Cardiology (Found: 2)
[PASS] 6. Live POST /api/patients (Created ID #11: Kavita Singhania)
[PASS] 7. Live PUT /api/patients/11 (Updated age to 43)
[PASS] 8. Live PATCH /api/patients/11/discharge (Status: Discharged)
[PASS] 9. Duplicate discharge rejected with 400 Bad Request
[PASS] 10. Live DELETE /api/patients/11 (Record removed)
[PASS] 11. GET deleted patient returns 404 Not Found
[PASS] 12. Validation: Invalid name rejected (422)
[PASS] 13. Validation: Future admission date rejected (422)
[PASS] 14. Validation: Invalid age rejected (422)
[PASS] 15. Database persistence verified: SQLite/PostgreSQL stores records
==================================================
   ALL 15 END-TO-END VERIFICATION CHECKS PASSED!  
==================================================
```

---

## 🌐 Production Deployment Guide

### Option A: Deploy Backend on Render / Railway
1. Push repository to GitHub.
2. Create a new Web Service pointing to the `backend` folder.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Optional: Set `DATABASE_URL` environment variable to a persistent PostgreSQL database instance.

### Option B: Deploy Frontend on Vercel / Netlify
1. Connect repository to Vercel/Netlify.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
