# 🎓 SkillX — Full-Stack Learning Management System

> A modern, feature-rich Learning Management System built with the MERN stack. SkillX provides an end-to-end learning experience — from course browsing and enrollment to AI-powered quiz certification and downloadable certificates.

---

## ✨ Features

### 🧑‍🎓 Student Experience
- **Course Catalog** — Browse and filter all available courses by category, difficulty, and rating
- **Course Enrollment** — One-click enrollment with real-time progress tracking
- **Video Lectures** — Stream lessons in-browser with automatic progress marking
- **Dashboard** — Personalized overview of enrolled courses, progress stats, and recent activity
- **Personalized Learning Path** — Tailored AI-driven course recommendations
- **Student Analytics** — Visual charts for learning hours, quiz scores, and completion rates

### 🏆 Certification & Quiz System
- **Graduation Gate** — Certificates are locked until a student completes **100%** of all course lessons
- **Auto-Generated Quizzes** — 10 unique multiple-choice questions fetched per course from the backend
- **Randomized Questions** — Questions are shuffled on every attempt via Fisher-Yates algorithm to prevent memorization
- **Instant Scoring** — Animated circular progress ring displays the final score immediately after submission
- **Pass Threshold** — Score **7/10 or higher** to pass and unlock the certificate
- **Re-Test on Failure** — Failed attempts trigger a new shuffled question set automatically
- **Certificate Download** — Download the certificate as a **PNG image** or a **print-quality PDF**

### 👤 User Management
- **JWT Authentication** — Secure login/signup with token-based sessions
- **Profile Page** — View all earned certificates and personal stats
- **Settings Page** — Update account preferences and notification settings

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Vanilla CSS with CSS Variables, Glassmorphism |
| **State Management** | React Context API (`LmsContext`) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Fallback DB** | In-Memory Database (auto-activated if MongoDB is unreachable) |
| **Auth** | JWT (`jsonwebtoken`), `bcryptjs` for password hashing |
| **Certificate** | HTML5 Canvas (PNG) + Browser Print API (PDF) |

---

## 📁 Project Structure

```
lms/
├── backend/                  # Express API server
│   ├── middleware/           # Auth middleware (JWT verification)
│   ├── models/               # Mongoose models + inMemoryDb fallback
│   │   ├── inMemoryDb.js     # In-memory data store with seeded data
│   │   ├── Course.js
│   │   ├── Quiz.js
│   │   └── User.js
│   ├── routes/               # API route handlers
│   │   ├── auth.js           # /api/auth — login, signup, profile
│   │   ├── courses.js        # /api/courses — CRUD, enrollment, progress
│   │   └── quizzes.js        # /api/quizzes — fetch quiz by courseId
│   ├── seeder.js             # Seeds courses, quizzes, and users
│   └── server.js             # Entry point, Express setup, CORS
│
└── frontend/                 # React + Vite application
    └── src/
        ├── components/       # Reusable UI components (Navbar, Sidebar, Cards…)
        ├── context/
        │   └── LmsContext.jsx  # Global state, API calls, auth management
        ├── layouts/          # Page layout wrappers
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   ├── Dashboard.jsx
        │   ├── Catalog.jsx
        │   ├── CourseDetails.jsx   # Lesson player + graduation gate
        │   ├── QuizGeneration.jsx  # Exam engine with scoring & certificate unlock
        │   ├── ProfilePage.jsx     # Certificates + PNG/PDF download
        │   ├── StudentAnalytics.jsx
        │   ├── PersonalizedLearningPath.jsx
        │   └── SettingsPage.jsx
        ├── routes/           # React Router route definitions
        └── styles/           # Global and component-level CSS
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas) — *optional, app runs with in-memory DB if unavailable*

### 1. Clone the Repository
```bash
git clone https://github.com/Varun-bharathi/SkillX.git
cd SkillX
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install
```

Create a `.env` file in the `backend` directory and add the following configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auralms
JWT_SECRET=aura_lms_super_secret_session_token_key_1994
```

Seed the database and start the backend:
```bash
# Seed the database with courses, quizzes, and a demo user
npm run seed

# Start the development server
npm run dev
```
The backend will start on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```
The frontend will start on **http://localhost:5173**

### 4. Demo Credentials
After running `npm run seed` in the backend:

| Field | Value |
|---|---|
| Email | `demo@auralms.com` |
| Password | `password123` |

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/profile` | Get current user profile (protected) |

### Courses — `/api/courses`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | List all available courses |
| `GET` | `/api/courses/:id` | Get course details |
| `POST` | `/api/courses/:id/enroll` | Enroll in a course (protected) |
| `PUT` | `/api/courses/:id/progress` | Update lesson progress (protected) |

### Quizzes — `/api/quizzes`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quizzes/:courseId` | Fetch 10-question quiz for a course |

---

## 🏅 Certification Flow

```
Enroll in Course
      ↓
Complete all lessons (100% progress)
      ↓
"Take Certification Exam" button unlocks
      ↓
10 randomized MCQs are loaded from the backend
      ↓
     Score?
    /       \
  ≥ 7/10    < 7/10
    ↓           ↓
  PASS        FAIL
    ↓           ↓
Certificate   New shuffled
unlocked      question set
    ↓         for re-test
Download PNG or PDF
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — Lightning-fast build tool
- [Express.js](https://expressjs.com/) — Backend framework
- [MongoDB](https://www.mongodb.com/) — Database
- [Mongoose](https://mongoosejs.com/) — ODM for MongoDB