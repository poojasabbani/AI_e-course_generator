from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.database.supabase import supabase

router = APIRouter()


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        file_bytes = await file.read()

        filename = f"{uuid4()}.pdf"

        supabase.storage.from_("documents").upload(
            filename,
            file_bytes,
            file_options={
                "content-type": "application/pdf"
            },
        )

        course = supabase.table("courses").insert(
            {
                "title": file.filename.replace(".pdf", ""),
                "pdf_path": filename,
                "status": "uploaded",
            }
        ).execute()

        return {
            "message": "Uploaded successfully",
            "course": course.data,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))