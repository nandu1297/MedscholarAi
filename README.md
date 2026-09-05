# MedScholarAI

MedScholarAI is a medical literature research assistant that lets users ask natural-language questions about an indexed collection of medical PDF documents. It combines retrieval-augmented generation (RAG), semantic embeddings, a Chroma vector store, Google Gemini, and a Next.js research workspace.

> **Medical disclaimer:** MedScholarAI is an educational research tool, not a medical professional. Its responses should not be used for diagnosis, treatment, or urgent medical decisions. Always consult a qualified healthcare professional.

## Features

- Ask questions about the indexed medical research collection.
- Retrieve relevant document passages before generating an answer.
- Maintain conversation history in MongoDB.
- Browse, open, and download the source PDF collection.
- Clear saved conversation history.
- Use a responsive Next.js interface for research, documents, and conversation history.

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

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, Uvicorn
- **RAG:** LangChain, Hugging Face Sentence Transformers, Chroma
- **Language model:** Google Gemini through `langchain-google-genai`
- **Persistence:** MongoDB for chat history and Chroma for vector data

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

- Python 3.10 or newer
- Node.js 18.18 or newer
- npm
- MongoDB running locally, or a MongoDB connection string
- A Google Gemini API key

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

- `/ask` - Ask questions about the medical literature.
- `/documents` - Search and open indexed PDF documents.
- `/history` - Review or clear the conversation history.
- `/about` - Learn about the project.

## Development Commands

From `frontend/`:

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Start the production server
```

## Notes

- The backend loads the existing Chroma database during startup, so `Backend/chroma_db/` must exist and contain indexed data before asking questions.
- The embedding model may be downloaded the first time `HuggingFaceEmbeddings` is initialized.
- The frontend only allows CORS requests from `http://localhost:3000` in the current backend configuration.
- The current backend uses one default chat session (`chat_id: "default"`).
