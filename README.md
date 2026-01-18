Project Title:

Campaign-Tracker

## Live Links

Frontend: [<LIVE_FRONTEND_URL>](https://campaign-tracker-1-zd3p.onrender.com)

Backend API: [<LIVE_BACKEND_URL>](https://campaign-tracker-tz07.onrender.com)

API Docs (Swagger/Postman if any): <optional>

Features

✅ Full CRUD from UI + REST APIs
✅ Dashboard/Visualization updates dynamically
✅ Third-party API Integration

---

##Tech Stack

Frontend: React 
Backend: Django 
DB: PostgreSQL

---

##Setup (Local)

Backend
git clone <backend_repo>
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt


Create .env using .env.example

--

How to Test (MANDATORY)
✅ CRUD Flow

Go to: /

Click “Add New”

Fill form → Submit

Confirm item appears in list

Edit → Update

Delete → Confirm removed

✅ Dashboard / Report

Go to: /dashboard

Shows category/status-wise counts

Add/update/delete data → graph changes automatically

✅ Third-party API Feature

Go to: /integration (or mention exact page)

Example: Fetch external data / send API request

Demonstrates real API working

---

##Deployment Notes

Frontend deployed on: Render
Backend deployed on: Render
Database: Postgres Render
