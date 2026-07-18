"""FastAPI app entrypoint. Fill in routers as you build them."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.upload import router as upload_router
from app.api.courses import router as courses_router

# from app.core.config import settings
# from app.api import auth, pdfs, courses, lessons, quiz, chat, search, history, analytics


def create_app() -> FastAPI:
    app = FastAPI(title="Coursefy API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # tighten to settings.CORS_ORIGINS in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # app.include_router(auth.router, prefix="/auth", tags=["auth"])
    # app.include_router(pdfs.router, prefix="/pdfs", tags=["pdfs"])
    # app.include_router(courses.router, prefix="/courses", tags=["courses"])
    # app.include_router(lessons.router, tags=["lessons"])
    # app.include_router(quiz.router, tags=["quiz"])
    # app.include_router(chat.router, prefix="/chat", tags=["chat"])
    # app.include_router(search.router, prefix="/search", tags=["search"])
    # app.include_router(history.router, prefix="/history", tags=["history"])
    # app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

    @app.get("/health")
    def health():
        return {"ok": True}
    
    app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
    )
    app.include_router(
    upload_router,
    prefix="/upload",
    tags=["Upload"],
    )
    
    app.include_router(
    courses_router,
    prefix="/courses",
    tags=["Courses"],
    )
    
    return app


app = create_app()
