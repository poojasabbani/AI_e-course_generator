from fastapi import APIRouter, HTTPException
from supabase_auth.errors import AuthApiError

from app.database.supabase import supabase
from app.schemas.auth import SignUpRequest, LoginRequest

router = APIRouter()


@router.post("/signup")
def signup(data: SignUpRequest):
    try:
        response = supabase.auth.sign_up(
            {
                "email": data.email,
                "password": data.password,
            }
        )

        return {
            "message": "Signup successful",
            "user_id": response.user.id,
        }

    except AuthApiError as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": data.email,
                "password": data.password,
            }
        )

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": response.user.id,
        }

    except AuthApiError as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))