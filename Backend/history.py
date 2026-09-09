from fastapi import APIRouter

from database_methods import (
    get_history_for_api,
    clear_history
)


router = APIRouter()


@router.get("/history")
def get_history(user_role: str = "student"):

    history = get_history_for_api(user_role)

    return {
        "history": history
    }


@router.delete("/clearhistory")
def delete_history():

    clear_history()

    return {
        "message": "History cleared successfully"
    }