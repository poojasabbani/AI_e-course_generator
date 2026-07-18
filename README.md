# 📚 Coursefy

Transform any PDF into an interactive AI-powered learning experience.

 Coursefy is a full-stack web application that allows users to upload PDF documents and automatically convert them into structured learning courses using AI. The platform is designed to make technical documentation, textbooks, research papers, and notes easier to learn through organized lessons, AI-assisted explanations, quizzes, and conversational learning.

---

## ✨ Features

### ✅ Current Features

- Secure User Authentication
- PDF Upload
- Supabase Storage Integration
- Course Dashboard
- Automatic Course Creation
- Responsive Modern UI
- FastAPI Backend
- React + TypeScript Frontend

---

## 🚧 Upcoming Features

- AI Course Generation
- Intelligent PDF Chunking
- Vector Embeddings
- Semantic Search
- AI Chat with PDF
- Quiz Generation
- Flashcard Generation
- Learning Progress Tracking
- Analytics Dashboard

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend

- FastAPI
- Python
- Supabase
- PostgreSQL
- Supabase Storage

### AI (In Progress)

- Groq LLM
- Sentence Transformers
- PyMuPDF
- FAISS
- LangChain

---

## 📂 Project Structure

```
docu-course-engine-main/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── requirements.txt
│
├── src/
├── public/
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/docu-course-ai.git
cd docu-course-ai
```

---

### Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

### Frontend

```bash
npm install
npm run dev
```

---

## Environment Variables

Create a file named:

```
backend/.env
```

Example:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
```

---

## Roadmap

- [x] Authentication
- [x] PDF Upload
- [x] Dashboard
- [x] Supabase Integration
- [ ] PDF Text Extraction
- [ ] Semantic Chunking
- [ ] Embedding Generation
- [ ] AI Course Generation
- [ ] Chat with PDF
- [ ] Quiz Generator
- [ ] Analytics

---

## Screenshots

Coming Soon

---

## Author

**Pooja Sabbani**

B.Tech Robotics and Automation Engineering

---

## License

This project is intended for educational and portfolio purposes.
