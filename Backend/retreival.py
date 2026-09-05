from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from fastapi import FastAPI
import os
from pydantic import BaseModel
from systemprompt import systemprompt
from fastapi.middleware.cors import CORSMiddleware
from database_methods import save_message ,fetch_history
from history import router as history_router


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI()
app.include_router(history_router)


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
    persist_directory="chroma_db",
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





# ============================================================
# 5. RETRIEVE RELEVANT CHUNKS
# ============================================================
@app.post("/ask_rag")
def ask_rag(req: Queryrequest):

    user_query = req.query
    save_message("user",user_query)
    
    retrieved_docs = retriever.invoke(user_query)

    contents = []
    for doc in retrieved_docs:
        contents.append(doc.page_content)
    context = "\n\n".join(contents)

    api_key = os.getenv("google_api_key")
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=0,
        api_key=api_key,
    )
    history =fetch_history()
    prompt = ChatPromptTemplate.from_messages([
    ("system", systemprompt),  
    MessagesPlaceholder(variable_name="history"),
     ("human", "{question}\n\nContext:\n{context}")
   ])
    
    
    
    formatmessage = prompt.format_messages(
        history = history[:-1],
        context =context,
        question = user_query,
        
    )
    response = llm.invoke(formatmessage)
    save_message("assistant",response.text)
    return {
        "answer":response.text
    }


