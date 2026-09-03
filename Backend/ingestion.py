from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_experimental.text_splitter import SemanticChunker
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

#load data

loader = PyPDFDirectoryLoader(r"C:\Users\kumar\OneDrive\Desktop\GenAI(LEP)\Projects\MedScholarAi\Backend\Data")
documents = loader.load()
print("loaded documents:",len(documents))

#setup embedding and chunking
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
splitter = SemanticChunker(embeddings)
chunks = splitter.split_documents(documents)
#review chunks
for i, chunk in enumerate(chunks[:5]):
    print(f"\n--- Chunk {i+1} ---")
    print(chunk.page_content)
    
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)
print("loaded db")