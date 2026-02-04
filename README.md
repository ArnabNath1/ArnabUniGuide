# UniGuide | AI-Powered Study Abroad Counsellor

UniGuide is a premium AI-driven platform designed to simplify the international education journey for students. It provides personalized university recommendations, automated CV parsing, and university-specific application roadmaps using state-of-the-art Large Language Models.

![UniGuide Preview](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)

## 🚀 Key Features

- **🤖 AI Study Abroad Counsellor**: Interactive chat powered by **Llama 3.3 (70B)** providing expert advice on university selection, profile evaluation, and admission strategies.
- **📄 AI CV Parser**: Upload your academic CV (PDF) and let our AI instantly populate your profile with your education, skills, and projects.
- **🏛️ University Shortlisting**: Search through a global database of universities and maintain a curated shortlist of your target institutions.
- **🗺️ Tailored Application Guidance**: Generate university-specific checklists that guide you through every step of the application process for each school on your shortlist.
- **🔒 Secure Data Management**: Cloud-synced profiles and secure account management, including a reliable "Danger Zone" for account deletion.
- **✨ Premium UI/UX**: A modern, dark-themed interface featuring glassmorphism, smooth Framer Motion animations, and real-time Sonner notifications.

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS (Custom Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **API Client**: Axios

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **AI Integration**: Groq API (Llama-3.3-70b-versatile)
- **Database**: Supabase (Postgres)
- **CV Parsing**: PDFMiner.six
- **Data Validation**: Pydantic

## ⚙️ Setup & Installation

### **1. Prerequisites**
- Node.js (v18+)
- Python (3.10+)
- Supabase Account
- Groq Cloud API Key

### **2. Environment Variables**
Create a `.env` file in the root directory:
```env
# Backend
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **3. Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **4. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Database Setup (Supabase)
Ensure you have the following tables in your Supabase project:
- `profiles`: to store user academic data and shortlisted universities.
- `conversations`: to store AI chat history for each user.

Refer to `README_SUPABASE.md` for specific SQL schema details.

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for students worldwide.*
