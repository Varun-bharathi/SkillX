# 🎓 SkillX — Full-Stack Learning Management System

> A modern, feature-rich Learning Management System built with the MERN stack and Google Gemini AI. SkillX provides an end-to-end learning experience — from course discovery and interactive enrollment to AI-synthesized slide presentations, real-time streamed lesson generators, randomized certification exams, and downloadable credentials.

---

## ✨ Features

### 🧑‍🎓 Student Experience
- **Interactive Course Catalog** — Browse and filter all available courses by category, difficulty, and student ratings.
- **One-Click Enrollment & Tracking** — Instant enrollment with persistent real-time lesson progress tracking.
- **AI-Powered Lecture Presentations** — Dynamic, full-screen slide presentations generated on-the-fly.
- **AI Voiceover Narration** — Integrated Text-to-Speech (TTS) narration guiding learners through each presentation slide.
- **Dynamic Content Generation** — Smooth, typewriter-style live streaming of comprehensive module lessons powered by Google Gemini.
- **Student Dashboard** — Personalized overview of active enrollments, overall progress, and learning milestones.
- **Personalized Learning Path** — Tailored AI recommendations based on student career goals and target skills.
- **Student Analytics** — Visual analytics charts tracking weekly study hours, quiz scores, and course completion rates.

### 🏆 Certification & Quiz Engine
- **Graduation Gate** — Course certification exams are unlocked only after reaching **100%** lesson completion.
- **10-Question Course Quizzes** — Contextual multiple-choice questions fetched per course.
- **Fisher-Yates Randomization** — Question and option orders are dynamically shuffled on every attempt to prevent rote memorization.
- **Instant Scoring & Progress Rings** — Animated score progress rings render immediately upon exam submission.
- **Passing Threshold** — Score **7/10 or higher** to graduate and unlock your certificate.
- **Automated Re-Testing** — Failed attempts immediately generate a fresh shuffled question set for re-examination.
- **Dual-Format Certificate Export** — Download official certificates as high-resolution **PNG images** or print-ready **PDFs**.

### 👤 User Management & Security
- **JWT Authentication** — Secure token-based sessions with password hashing via `bcryptjs`.
- **Learner Profile** — Manage personal bios, target skills, notification preferences, and earned certificates.
- **Dual-Mode Persistence** — Seamlessly runs on MongoDB, with an automatic **In-Memory Database Fallback** if MongoDB is unavailable locally.
- **Graceful AI Fallback** — Operates smoothly even without an active internet connection or API key using curated offline learning material.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, Vite 8, React Router v7 |
| **Icons & Visuals** | Lucide React (`lucide-react`) |
| **Data Visualization** | Recharts (`recharts`) |
| **Markdown Rendering** | React Markdown (`react-markdown`) |
| **Styling** | Modern Vanilla CSS, CSS Custom Properties, Glassmorphism, Dark/Light theme toggle |
| **State Management** | React Context API (`LmsContext`) |
| **Backend Framework** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose 8 ODM) |
| **Fallback Database** | Built-in In-Memory Database store with automated failover |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs` password hashing |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) with `gemini-3.1-flash-lite` & `gemini-3.8-flash` |
| **Certificate Engine** | HTML5 Canvas (PNG export) + Browser Print API (PDF generation) |

---

## 📁 Project Structure

```
SkillX/
├── backend/                      # Express API server
│   ├── middleware/
│   │   └── auth.js               # JWT verification & session handling
│   ├── models/                   # Mongoose schemas + in-memory store
│   │   ├── Course.js             # Course schema
│   │   ├── Quiz.js               # Quiz schema
│   │   ├── User.js               # User & enrollment schema
│   │   └── inMemoryDb.js         # Zero-config in-memory fallback database
│   ├── routes/                   # API endpoint controllers
│   │   ├── auth.js               # /api/auth — signup, login, profile
│   │   ├── courses.js            # /api/courses — catalog, enroll, progress
│   │   ├── llm.js                # /api/llm — streaming AI course content
│   │   ├── quizzes.js            # /api/quizzes — course exam questions
│   │   └── video.js              # /api/video — AI slide decks & narration
│   ├── seeder.js                 # Database seeder script
│   └── server.js                 # Entry point, Express setup, crash-guarding
│
├── frontend/                     # React 19 + Vite frontend
│   ├── public/
│   │   └── favicon.svg           # App icon
│   └── src/
│       ├── components/           # Reusable UI components (Navbar, Sidebar, Cards…)
│       ├── context/
│       │   └── LmsContext.jsx    # Global state, auth, and API sync provider
│       ├── data/
│       │   └── mockData.js       # Static fallbacks for learning paths & courses
│       ├── layouts/
│       │   └── AppLayout.jsx     # Navigation shell & persistent layout
│       ├── pages/
│       │   ├── LandingPage.jsx   # Hero section & feature showcases
│       │   ├── LoginPage.jsx     # User authentication login
│       │   ├── SignupPage.jsx    # User account registration
│       │   ├── Dashboard.jsx     # Enrolled courses & quick stats
│       │   ├── Catalog.jsx       # Searchable course directory
│       │   ├── CourseDetails.jsx # Lesson player & graduation gate
│       │   ├── QuizGeneration.jsx# Exam engine, scoring & certificate unlock
│       │   ├── ProfilePage.jsx   # Earned credentials & certificate downloads
│       │   ├── StudentAnalytics.jsx # Learning time & performance charts
│       │   ├── PersonalizedLearningPath.jsx # Goal-based career roadmaps
│       │   └── SettingsPage.jsx  # Notification & profile preferences
│       ├── routes/
│       │   └── AppRoutes.jsx     # Application route definitions
│       ├── styles/
│       │   └── index.css         # Comprehensive design system & variables
│       ├── App.jsx               # App entry wrapper
│       └── main.jsx              # React DOM mounting
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18, v20, or v24+
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas) — *optional; the server automatically falls back to the in-memory database if MongoDB is not detected.*
- A free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) *(optional, fallback content is provided if absent)*.

---

### 1. Clone the Repository
```bash
git clone https://github.com/Varun-bharathi/SkillX.git
cd SkillX
```

---

### 2. Backend Configuration & Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/auralms
   JWT_SECRET=skillx_super_secret_session_token_key_2026
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   > 💡 **Tip:** Replace `your_google_gemini_api_key_here` with your API key from Google AI Studio. If left blank, the app will seamlessly serve pre-built offline curriculum content.

3. *(Optional)* Seed the database with demo courses, users, and quizzes:
   ```bash
   npm run seed
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will listen on **http://localhost:5000**

---

### 3. Frontend Configuration & Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to **http://localhost:5173**

---

### 4. Demo Credentials
If you seeded the database using `npm run seed`:

| Field | Value |
|---|---|
| **Email** | `demo@auralms.com` |
| **Password** | `password123` |

You can also click **Sign Up** on the frontend to create a fresh user account at any time.

---

## 🔌 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/signup` | Register a new learner account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user session & enrollments | Yes |
| `PUT` | `/api/auth/profile` | Update user bio, skills, and settings | Yes |

### 📚 Courses (`/api/courses`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/courses` | List all available catalog courses | No |
| `GET` | `/api/courses/:id` | Fetch detailed syllabus for a course | No |
| `POST` | `/api/courses/:id/enroll` | Enroll the authenticated user into a course | Yes |
| `PUT` | `/api/courses/:id/progress` | Update completed lessons & mark milestone | Yes |

### 📝 Quizzes (`/api/quizzes`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/quizzes/:courseId` | Fetch 10 randomized exam questions for a course | No |
| `POST` | `/api/quizzes/:courseId/submit` | Record exam score and unlock certification | Yes |

### 🤖 AI Generation (`/api/llm` & `/api/video`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/llm/generate` | Stream live markdown educational content for any topic | No |
| `POST` | `/api/video/generate` | Synthesize multi-slide deck with narration scripts | No |

---

## 🏅 Certification Flow

```
Enroll in Course
      ↓
Complete all lessons (100% progress)
      ↓
"Take Certification Exam" button unlocks
      ↓
10 randomized MCQs loaded from backend
      ↓
           Score?
          /      \
      ≥ 7/10    < 7/10
        ↓          ↓
      PASS       FAIL
        ↓          ↓
  Certificate   Fresh shuffled
    unlocked    question set
        ↓       for re-test
  Download PNG
     or PDF
```

---

## 🛡️ Robustness & AI Resilience
- **Multi-Model Roster**: Automatically routes queries to `gemini-3.1-flash-lite`, `gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, or `gemini-3.8-flash` to guarantee high availability and eliminate 503 high-demand errors.
- **Safe Chunk Streaming**: Streams generated content cleanly to the frontend reader without fragile SSE stream parser crashes.
- **Process Crash Protection**: Node process-level exception handlers safeguard the server from external network socket interruptions.
- **Zero-Config Database Fallback**: If local MongoDB is offline, SkillX switches to its in-memory database store so development never halts.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it for personal and commercial projects.

---

## 🙏 Acknowledgements

- [React 19](https://react.dev/) — User interface library
- [Vite](https://vite.dev/) — Next-generation frontend tooling
- [Google Gemini](https://ai.google.dev/) — Generative AI models
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) — Database architecture
- [Lucide Icons](https://lucide.dev/) — UI icons