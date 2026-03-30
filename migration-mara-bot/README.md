# 🤖 MARA AI Bot

Migration consultant chatbot powered by RAG (Retrieval-Augmented Generation) for Australian visa questions.

## Tech Stack
- **Frontend**: React (Vercel)
- **Backend**: Node.js / Express (Railway)
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Anthropic Claude (claude-sonnet-4-5) + OpenAI (Embeddings, Whisper, TTS)
- **Payments**: Stripe (AUD $30 per conversation)

## Setup

### 1. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables
Fill in your API keys in:
- `backend/.env` — Anthropic, OpenAI, Supabase, Stripe keys
- `frontend/.env` — API URL + Stripe publishable key

### 3. Setup Supabase
Run the SQL schema from `01_DATABASE_AND_PDF_PIPELINE.md` in your Supabase SQL Editor.

### 4. Run locally
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

### 5. Test
- Backend: http://localhost:5000/test
- Frontend: http://localhost:3000

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /test | Health check |
| GET | /api/availability | MARA agent availability |
| POST | /api/pay/checkout | Create Stripe checkout |
| GET | /api/pay/verify | Verify payment + issue token |
| POST | /api/mara/chat | Chat with MARA (requires token) |
| POST | /api/upload/pdf | Upload policy PDF |
| GET | /api/upload/pdfs | List uploaded PDFs |
| DELETE | /api/upload/pdf/:name | Delete a PDF |
| POST | /api/voice/transcribe | Speech to text |
| POST | /api/voice/speak | Text to speech |
