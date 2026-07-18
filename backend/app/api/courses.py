from fastapi import APIRouter
from app.database.supabase import supabase

router = APIRouter()


@router.get("/")
def get_courses():
    response = (
        supabase.table("courses")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data