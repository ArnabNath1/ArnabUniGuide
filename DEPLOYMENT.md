# Deployment Guide: AI Study Abroad Counsellor

Follow these steps to deploy your application to the web.

## 1. Backend Deployment (Render.com)

[Render](https://render.com/) is great for hosting FastAPI backends.

1. **Push your code to GitHub.**
2. **Create a new Web Service** on Render and connect your repository.
3. **Configure Settings:**
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (Make sure your working directory is set to `backend`)
4. **Add Environment Variables:**
   - `GROQ_API_KEY`: Your Groq API Key
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_KEY`: Your Supabase Service Role or Anon Key
5. **Note your Backend URL** (e.g., `https://my-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

[Vercel](https://vercel.com/) is the native host for Next.js.

1. **Connect your GitHub Repo** to Vercel.
2. **Configure Settings:**
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `frontend`
3. **Add Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend from Step 1 (e.g., `https://my-backend.onrender.com`).
4. **Deploy!**

---

## 3. Database & Database Security (Supabase)

1. **Update CORS settings**: In `backend/app/main.py`, you can eventually restrict `allow_origins` to your Vercel URL for better security.
2. **Table Schema**: Ensure your `profiles` table is set up in Supabase as described in `README_SUPABASE.md`.

---

## Local Testing
To test locally with the new environment system:
1. Go to `frontend` folder.
2. Create or update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
3. Run `npm run dev`.
