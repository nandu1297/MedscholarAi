from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pydantic import BaseModel
from systemprompt import systemprompt ,teaching_prompt,question_generation_prompt ,comparison_prompt ,research_gap_prompt
from fastapi.middleware.cors import CORSMiddleware
from database_methods import save_message ,fetch_history
from history import router as history_router


load_dotenv()

app = FastAPI()
app.include_router(history_router)

DATA_DIR = os.path.join(os.path.dirname(__file__), "Data")
app.mount("/documents", StaticFiles(directory=DATA_DIR), name="documents")


@app.get("/document-download/{filename}")
def download_document(filename: str):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(DATA_DIR, safe_filename)
    if safe_filename != filename or not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Document not found")
    return FileResponse(file_path, media_type="application/pdf", filename=safe_filename)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ============================================================
# 1. LOAD EMBEDDING MODEL
# ============================================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# 2. LOAD EXISTING CHROMA VECTOR DATABASE
# ============================================================

vectorstore = Chroma(
    persist_directory=os.path.join(os.path.dirname(__file__), "chroma_db"),
    embedding_function=embeddings
)


# ============================================================
# 3. CREATE RETRIEVER
# ============================================================

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})


# ============================================================
# 4. USER QUERY
# ============================================================
class Queryrequest(BaseModel):
    query: str
    user_role: str = "student"
    feature: str = "chat"



def get_prompt(user_role, feature):
    if user_role == "student":
        if feature == "chat":
            return systemprompt 
    elif user_role == "professor":
        if feature == "chat":
            return systemprompt
        elif feature == "teaching":
            return teaching_prompt
        elif feature == "generate_questions":
            return question_generation_prompt
    elif user_role == "researcher":
        if feature == "chat":
            return systemprompt
  
        elif feature == "compare":
            return comparison_prompt
        elif feature == "gaps":
            return research_gap_prompt
    return None


# ============================================================
# 5. RETRIEVE RELEVANT CHUNKS
# ============================================================
@app.post("/ask_rag")
def ask_rag(req: Queryrequest):
    
    user_role =req.user_role
    features = req.feature
    user_query = req.query
    save_message("user", user_query,user_role)
    
    retrieved_docs = retriever.invoke(user_query)

    # Collect both content and metadata for citations
    contents = []
    citations = []
    for doc in retrieved_docs:
        contents.append(doc.page_content)
        citations.append({
            "source": doc.metadata.get("source", "Unknown"),
            "page": doc.metadata.get("page", "N/A")
        })

    context = "\n\n".join(contents)

    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=0,
        api_key=api_key,
    )
    history = fetch_history(user_role)
    prompt = ChatPromptTemplate.from_messages([
        ("system", get_prompt(user_role, features)),  
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}\n\nContext:\n{context}")
    ])
    
    formatmessage = prompt.format_messages(
        history=history,
        context=context,
        question=user_query,
    )
    response = llm.invoke(formatmessage)

    save_message("assistant", response.text, user_role)

    return {
        "answer": response.text,
        "citations": citations
    }



