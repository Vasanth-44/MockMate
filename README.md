# <p align="center">🧠 MockMate — Ace Your Interviews with AI 🚀</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Gemini_1.5_Flash-AI-blue?style=for-the-badge&logo=google-gemini" alt="Gemini" />
</p>

---

**MockMate** is a state-of-the-art AI-powered interview simulator that helps developers practice coding, system design, and behavioral questions with real-time feedback. Designed with a premium glassmorphic UI, fluid framer-motion micro-animations, and a Python FastAPI analysis engine powered by Gemini.

---

## 🌟 Core Features

- **⚡ Resume-Tailored Assessment (NEW):** Drag & drop your PDF resume. MockMate automatically extracts content, parses your technical profile, detects seniority, and designs a customized curriculum of 8 targeted questions (5 technical, 3 behavioral).
- **⚡ Real-Time Cognitive Analytics:** Instant feedback on technical precision, communication flow, confidence metrics, and structural correctness.
- **🎯 Professional Rubrics:** Specialized training for Frontend, Backend, Machine Learning, HR Leadership, and Product Manager interview tracks.
- **📊 Performance Analytics:** Historical charts visualizing your score patterns, technical depth, and confidence levels over multiple runs.
- **⚡ Zero-Fail Fallback Engine:** Smart local heuristics return premium structural evaluations even during upstream AI provider service disruptions.

---

## 📸 Interface Screenshots & Previews

### 1. Resume Personalization Setup Dashboard
The new pre-interview workspace allows you to personalize questions by dropping your resume PDF directly. It features interactive drag-and-drop animations, progress logs, and a fallback route for generic interviews.

<p align="center">
  <img src="public/images/resume_setup_ui.png" width="700" alt="Resume Personalization Setup Screen" />
</p>

### 2. Personalized AI Interview Workspace
Once analyzed, the workspace loads your custom questions into the checklist tracker. You can click on any question in the sidebar checklist to load the context and begin the interview session.

<p align="center">
  <img src="public/images/interview_chat_ui.png" width="700" alt="Personalized AI Interview Workspace" />
</p>

---

## 🏗️ Architecture Design

```mermaid
graph TD
    User([User Candidate]) -->|Interacts with UI| FE[Next.js Frontend]
    FE -->|Uploads PDF Resume| BE[FastAPI Backend:8000]
    
    subgraph AI Engine
        BE -->|Extracts text via PyMuPDF| Extraction[PDF Text Extractor]
        Extraction -->|Prompts with Schema| Gemini[Gemini 1.5 Flash API]
        Gemini -->|Returns Question Schema JSON| BE
    end

    subgraph Resilience Layer
        BE -->|On API Fail| Fallback[Heuristic Parser & Fallback Generator]
    end

    BE -->|HTTP 200 JSON| FE
    FE -->|Renders Checklist & Questions| Chat[Active Chat Simulator]
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide React, Canvas Confetti |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, PyMuPDF (fitz), Pydantic, Python-Requests |
| **AI Model** | Google Gemini 1.5 Flash (via API) |
| **Deployment** | Vercel (Frontend), FastAPI Host (Backend) |

---

## 📂 Project Structure

```
├── backend/
│   ├── services/
│   │   ├── __init__.py
│   │   └── resume_service.py # PDF Extraction & Gemini prompt builders
│   ├── main.py              # FastAPI Evaluation & Upload endpoints
│   └── .env.example         # Environment template (GEMINI_API_KEY)
├── public/
│   └── images/              # Assets for documentation
├── src/
│   ├── app/                 # Next.js App Router Pages (Interview, Roles, Analytics)
│   ├── components/          # UI components (Navbar, GridBackground, BentoCards)
│   ├── lib/                 # API client handlers
│   └── globals.css          # Core Design System & Tailwind v4 Custom Tokens
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup & Installation

### 1. Clone & Set Up Backend

```bash
# Navigate to backend
cd backend

# Create local environment configuration
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY

# Install dependencies (FastAPI, Uvicorn, PyMuPDF, Requests)
pip install fastapi uvicorn requests pydantic pymupdf

# Launch the FastAPI server
python -m uvicorn main:app --port 8000 --reload
```

The backend server will run online at `http://127.0.0.1:8000`.

### 2. Set Up Frontend

```bash
# In the root project directory
npm install

# Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience **MockMate**.

---

<p align="center">Made with ❤️ by the MockMate Dev Team</p>
