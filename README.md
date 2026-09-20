# 🏦 AI Financial Literacy — For Indian College Students

> AI-powered personal finance advisor. Three modules: Expense Analyzer, Affordability Checker, Scholarship Advisor.

---

## 🚀 Quick Start (3 Steps)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env          # Fill in your API keys
pip install -r requirements.txt
uvicorn main:app --reload     # Runs at http://localhost:8000
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb aifinance
# Tables are auto-created on first startup by SQLAlchemy
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env          # Set VITE_API_URL
npm install
npm run dev                   # Runs at http://localhost:5173
```

---

## 🔑 Required Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key (get from platform.openai.com) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SECRET_KEY` | Random 32+ char string for JWT signing |
| `SMTP_EMAIL` | Gmail address for OTP emails |
| `SMTP_PASSWORD` | Gmail App Password (not your real password) |
| `FRONTEND_URL` | Frontend URL for CORS (http://localhost:5173) |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (http://localhost:8000) |
| `VITE_GOOGLE_CLIENT_ID` | Same Google Client ID |

---

## 📁 Project Structure
```
ai-finance-literacy/
├── backend/
│   ├── main.py               # FastAPI app entry
│   ├── routers/              # auth, expenses, affordability, scholarship
│   ├── services/llm_service  # OpenAI GPT-4o-mini integration
│   ├── models/               # SQLAlchemy ORM models
│   ├── database/             # DB connection + init SQL
│   └── utils/otp.py          # OTP generation + email
└── frontend/
    └── src/
        ├── pages/            # Landing, Login, Dashboard, 3 modules
        ├── context/          # AuthContext (JWT)
        └── utils/api.js      # Fetch wrapper
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
vercel --prod
```

### Backend → Railway / Render
```bash
# Set all env vars in Railway/Render dashboard
# Railway detects Procfile automatically
railway up
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/send-otp` | Send OTP to email |
| POST | `/auth/verify-otp` | Verify OTP, get JWT |
| POST | `/auth/google` | Google OAuth login |
| GET  | `/expenses/list/{user_id}` | Get expense list |
| POST | `/expenses/add` | Add expense |
| GET  | `/expenses/summary/{user_id}` | Category summary |
| POST | `/expenses/ask-ai` | AI expense analysis |
| POST | `/afford/check` | Affordability score + AI advice |
| POST | `/scholarship/advise` | Scholarship & loan recommendations |

---

## 🛡️ Security
- JWT-based authentication (7-day tokens)
- OTP expiry in 10 minutes
- All financial data tied to user ID
- CORS restricted to configured frontend URL
- PII excluded from AI prompts

---

Built with ❤️ for Indian college students 🇮🇳
