from dotenv import load_dotenv
import os

from langchain_core.messages import HumanMessage ,AIMessage

load_dotenv()

from datetime import datetime

from langchain_core.messages import HumanMessage, AIMessage

from mongodb_conn import chat_collection


# --------------------------------------------------
# SAVE MESSAGE
# --------------------------------------------------

def save_message(role, content):

    chat_collection.insert_one({
        "chat_id": "default",
        "role": role,
        "content": content,
        "created_at": datetime.utcnow()
    })


# --------------------------------------------------
# FETCH HISTORY FOR LLM
# --------------------------------------------------

def fetch_history():

    messages = chat_collection.find(
        {"chat_id": "default"}
    ).sort("created_at", 1)

    history = []

    for message in messages:

        if message["role"] == "user":

            history.append(
                HumanMessage(
                    content=message["content"]
                )
            )

        elif message["role"] == "assistant":

            history.append(
                AIMessage(
                    content=message["content"]
                )
            )

    return history


# --------------------------------------------------
# FETCH HISTORY FOR FRONTEND
# --------------------------------------------------

def get_history_for_api():

    messages = chat_collection.find(
        {"chat_id": "default"}
    ).sort("created_at", 1)

    history = []

    for message in messages:

        history.append({
            "role": message["role"],
            "content": message["content"]
        })

    return history


# --------------------------------------------------
# CLEAR HISTORY
# --------------------------------------------------

def clear_history():

    chat_collection.delete_many({
        "chat_id": "default"
    })