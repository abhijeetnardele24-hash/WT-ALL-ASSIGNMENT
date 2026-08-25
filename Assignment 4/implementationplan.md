# VIT Semester Result System — Implementation Plan

## 1. Overview
A full-stack academic result management system for one semester, 4 subjects,
MSE (30%) + ESE (70%) weightage. Built with an industrial-grade stack instead
of a static frontend-only demo.

**Login credential:** PRN Number + Password (not username/email).

**Key correction:** Students never enter their own marks. In real VIT-style
systems, the exam cell/faculty already has the marks — a student only logs
in to *view* a result that already exists in the DB. So this app:
- Seeds MySQL with a batch of students (auto-generated PRN + password) and
  their marks for 4 subjects, via a `DataSeeder`.
- Student login (PRN + password) just fetches and displays their pre-stored,
  pre-computed result. No marks-entry screen for students.
- A separate FACULTY/ADMIN role (optional, for the "industrial" story) is
  the only one allowed to POST/update marks — students are read-only.

## 2. Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React (Vite), Axios, React Router |
| Backend | Spring Boot 3 (Web, Security, Data JPA, Validation) |
| Database | MySQL 8 |
| Auth | JWT (jjwt library), BCrypt password hashing |
| Build/Deploy | Docker, Docker Compose, GitHub Actions |
| Testing | JUnit + Mockito (backend), Jest + RTL (frontend), Cypress (e2e) |

## 3. Database Schema (MySQL)

```sql
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  prn_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'STUDENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  credits INT DEFAULT 3
);
-- Seeded from the uploaded syllabus sheet:
-- CS3212  PCC: Design and Analysis of Algorithm   (credits 4)
-- CS3213  PCC: Computer Networks                  (credits 3)
-- CS3111  PEC1: Web Technologies                   (credits 4)
-- CS3112  PEC1: Mainframe Technology                (credits 4)

CREATE TABLE marks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  mse DECIMAL(5,2) NOT NULL CHECK (mse BETWEEN 0 AND 50),
  ese DECIMAL(5,2) NOT NULL CHECK (ese BETWEEN 0 AND 100),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  UNIQUE (student_id, subject_id)
);
```

## 4. Data Seeding (auto-generated credentials + marks)
A `DataSeeder` (`@Component implements CommandLineRunner`) runs once on
backend startup and, only if the tables are empty:
1. Inserts the 4 subjects (codes above) into `subjects`.
2. Generates N sample students, e.g. PRN `23BCE0001`...`23BCE0010`, with a
   default password (e.g. `Vit@1234`) — **hash it with BCrypt before saving**.
3. Generates random-but-realistic MSE (0-50) and ESE (0-100) marks for each
   student × each of the 4 subjects, inserted into `marks`.
4. Logs the generated PRN/password pairs to the console (or writes a
   `credentials.csv` in a `seed-output/` folder) so you have a real
   PRN + password to log in and demo with — this simulates the exam cell
   having already published results before the student ever visits the app.

This removes any student-facing "enter marks" screen entirely — the only
thing students provide is their login PRN + password.

## 5. Auth Flow (JWT, PRN-based)
1. `POST /api/auth/login` body: `{ "prnNumber": "...", "password": "..." }`
2. Backend loads student by `prn_number`, verifies BCrypt hash.
3. On success, issues signed JWT: claims = `prnNumber`, `role`, `exp`.
4. Client stores token (memory / httpOnly cookie) and sends
   `Authorization: Bearer <token>` on every subsequent request.
5. `JwtAuthFilter` validates token per-request, sets Spring Security context.
6. Endpoints protected with `@PreAuthorize("hasRole('STUDENT')")` /
   `hasRole('FACULTY')`.

## 6. REST API Endpoints
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/login | Public | Login with PRN + password, returns JWT |
| GET | /api/students/me | STUDENT | Get logged-in student profile |
| GET | /api/subjects | STUDENT/FACULTY | List the 4 subjects |
| GET | /api/results/me | STUDENT | Pre-computed result: per-subject total, grade, CGPA (read-only) |
| GET | /api/results/{prnNumber} | FACULTY | View any student's result |
| POST | /api/marks | FACULTY (admin use only) | Correct/update a mark after seeding — not exposed to students |

There is intentionally **no student-facing "submit marks" endpoint** — marks
only enter the system via the seeder or the FACULTY-only correction endpoint.

Grade/CGPA computation lives in `ResultService` on the backend
(MSE/50 × 30 + ESE/100 × 70 per subject) — never recomputed on the frontend,
so there's one source of truth.

## 7. Backend Folder Structure
```
backend/
  src/main/java/com/vit/result/
    config/        SecurityConfig, JwtConfig, DataSeeder
    controller/     AuthController, StudentController, MarksController, ResultController
    dto/            LoginRequest, ResultResponse, MarksUpdateRequest
    entity/         Student, Subject, Marks
    repository/     StudentRepository, SubjectRepository, MarksRepository
    security/       JwtAuthFilter, JwtUtil, UserDetailsServiceImpl
    service/        AuthService, ResultService, MarksService
  src/main/resources/application.yml
  Dockerfile
```

## 8. Frontend Folder Structure
```
frontend/
  src/
    api/            axiosClient.js (interceptor attaches JWT)
    components/     LoginForm, SubjectRow, ResultSummary, GradeBadge
    context/        AuthContext.jsx (holds token, prnNumber, role)
    pages/          LoginPage, ResultPage
    routes/         ProtectedRoute.jsx
    App.jsx
  Dockerfile
```

## 9. Implementation Phases
1. DB schema in MySQL (students, subjects, marks).
2. Spring Boot project skeleton, entities, repositories.
3. `DataSeeder`: generate subjects, students (PRN + BCrypt password), and
   random marks — print/export the credentials used for demo login.
4. JWT auth: login with PRN number + password, JwtAuthFilter.
5. Result API with backend grade/CGPA logic (read-only for students).
6. React: login page (PRN + password), AuthContext, ProtectedRoute.
7. React: result page consuming `/api/results/me` — no marks-entry UI.
8. Validation + error handling (Bean Validation backend, zod frontend).
9. Testing: JUnit/Mockito, Jest/RTL, one Cypress e2e (login → view result).
10. Dockerfile for backend and frontend, docker-compose with MySQL.
11. GitHub Actions: build → test → docker build → deploy.

## 10. Deployment
- Backend + MySQL: Docker Compose on a VM, or Render/AWS Elastic Beanstalk.
- Frontend: Vercel/Netlify, or same Docker host behind nginx.
- Secrets (JWT signing key, DB credentials) via environment variables, never
  committed to the repo.