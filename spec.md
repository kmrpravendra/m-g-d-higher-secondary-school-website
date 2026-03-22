# Specification

## Summary
**Goal:** Build a school management website for M.G.D. Higher Secondary School with a public Home/About page and an authenticated management area for admissions, attendance, fees, monthly tests, and exams.

**Planned changes:**
- Create a public Home/About page showing the school name, address, principal, phone numbers, and Instagram handle/link (English).
- Add Internet Identity login and restrict all management modules/routes to authenticated users.
- Implement backend data models and CRUD APIs for Student Admissions/Profiles (including photo and all required fields).
- Build an Admissions frontend module: list with search (name, mobile), create/edit forms, detail view (including photo), and delete with confirmation.
- Implement backend storage and APIs for Attendance (per-student per-date, Present/Absent, note) with queries by student and date range and duplicate prevention.
- Build an Attendance frontend module to mark attendance by date and view per-student history by date range.
- Implement backend storage and APIs for Fees (date, amount, payment mode, optional note/receipt ref) with history by student and totals by date range.
- Build a Fees frontend module to record payments, view history, and see basic totals over a selectable date range.
- Implement backend storage and APIs for Monthly Tests (month, subject, score, optional remark) with filtering by student and month.
- Build a Monthly Tests frontend module to add/view records with filters by month and subject.
- Implement backend storage and APIs for Exams (exam name, exam date/session, subject, marks/grade, optional remark) with filtering by student and exam name.
- Build an Exams frontend module to add/view records with at least exam-name filtering.
- Add consistent navigation across public and authenticated areas; use React Query for fetching/caching with clear loading and error states and automatic refresh after mutations.
- Apply a consistent school-appropriate visual theme across the app (avoid blue/purple as primary colors).
- Add generated static images under `frontend/public/assets/generated` and render them in the UI via static paths (no backend image serving).

**User-visible outcome:** Visitors can view the school’s public Home/About information, while signed-in users (Internet Identity) can manage student admissions and track attendance, fees, monthly tests, and exam records through a consistent, themed dashboard with searchable lists, forms, filters, and persistent data.
