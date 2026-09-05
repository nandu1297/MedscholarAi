<<<<<<< HEAD
# MedScholarAI

MedScholarAI is a medical literature research assistant that lets users ask natural-language questions about an indexed collection of medical PDF documents. It combines retrieval-augmented generation (RAG), semantic embeddings, a Chroma vector store, Google Gemini, and a Next.js research workspace.

> **Medical disclaimer:** MedScholarAI is an educational research tool, not a medical professional. Its responses should not be used for diagnosis, treatment, or urgent medical decisions. Always consult a qualified healthcare professional.

## Features


## Architecture

```text
frontend/                 Next.js application
    |
    | HTTP requests
    v
Backend/retreival.py      FastAPI application
    |
    +-- Chroma             Semantic document retrieval
    +-- Hugging Face       all-MiniLM-L6-v2 embeddings
    +-- Google Gemini      Answer generation
    +-- MongoDB            Conversation history
    +-- Backend/Data       Source PDF documents
```

## Technology Stack


## Project Structure

```text
MedScholarAi/
├── Backend/
│   ├── Data/                 Source medical PDFs
│   ├── chroma_db/            Persisted vector database
│   ├── ingestion.py          PDF ingestion and embedding script
│   ├── retreival.py          FastAPI app and RAG endpoint
│   ├── history.py            History API routes
│   ├── database_methods.py   MongoDB history operations
│   ├── mongodb_conn.py       MongoDB connection
│   ├── systemprompt.py       Medical assistant safety and answer rules
│   └── requirements.txt       Python dependencies
└── frontend/
    ├── app/                  Next.js routes and UI
    └── package.json          Frontend scripts and dependencies
```

## Prerequisites

Install the following before starting:


## Configuration

Create `Backend/.env`:

```env
google_api_key=your_google_gemini_api_key
MONGO_URI=mongodb://localhost:27017
```

The backend uses `mongodb://localhost:27017` when `MONGO_URI` is not set. Never commit real API keys or other secrets.

The frontend uses `http://localhost:8000` by default. To point it at another backend, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Installation

### Backend

From the `Backend` directory:

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend

From the `frontend` directory:

```powershell
cd frontend
npm install
```

## Indexing Documents

Place PDF files in `Backend/Data/`, then run the ingestion script from the `Backend` directory:

```powershell
cd Backend
python ingestion.py
```

This creates or updates the persisted Chroma database in `Backend/chroma_db/`. Before running ingestion on another machine, update the PDF directory path in `Backend/ingestion.py`; the current script contains a machine-specific Windows path.

## Running Locally

Open two terminals from the repository root.

### Start the API

```powershell
cd Backend
.\.venv\Scripts\Activate.ps1
uvicorn retreival:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000). FastAPI's interactive documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Start the frontend

```powershell
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/ask_rag` | Retrieve relevant documents and generate an answer. Body: `{ "query": "..." }` |
| `GET` | `/history` | Return the saved conversation history. |
| `DELETE` | `/clearhistory` | Delete the saved conversation history. |
| `GET` | `/documents/{filename}` | Serve a source PDF from `Backend/Data/`. |
| `GET` | `/document-download/{filename}` | Download a source PDF. |

Example request:

```powershell
Invoke-RestMethod `
  -Uri http://localhost:8000/ask_rag `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"query":"What are the main findings in the indexed documents?"}'
```

## Frontend Routes


## Development Commands

From `frontend/`:

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Start the production server
```

## Notes

=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> origin/master
