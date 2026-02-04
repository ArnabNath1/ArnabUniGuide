from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.profile import Profile
from app.services.supabase_client import supabase
from app.services.ai import parse_cv_to_json

import io

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/{email}")
def get_profile(email: str):
    response = supabase.table("profiles").select("*").eq("email", email).execute()
    if not response.data:
        # Return empty/default if not found instead of error for smoother UX
        return {} 
    return response.data[0]

@router.post("/")
def update_profile(profile: Profile):
    # Upsert data using email as key if possible, assuming email is unique/primary
    # For user ease without auth ID, we'll try to match by email.
    
    data = profile.dict()
    # Remove id if None so Supabase generates it
    if data.get("id") is None:
        del data["id"]
        
    # Flatten test scores if needed for DB or keep as jsonb. 
    # Supabase handles JSON nicely if the column is JSONB.
    # Assuming 'profiles' table structure.
    
    response = supabase.table("profiles").upsert(data, on_conflict="email").execute()
    return {"message": "Profile updated successfully", "data": response.data}

@router.post("/parse-cv")
async def parse_cv(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        # Use pdfminer.six for robust text extraction
        from pdfminer.high_level import extract_text
        text = extract_text(pdf_file)
        
        print(f"Extracted Text Length: {len(text)}")
        
        if not text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from PDF. It might be an image-based PDF (scanned).")

        extracted_data = parse_cv_to_json(text)
        return extracted_data
    except HTTPException as he:
        # Re-raise FastAPIs HTTPExceptions
        raise he
    except Exception as e:
        print(f"Error parsing CV: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF: {str(e)}")

@router.delete("/{email}")
def delete_profile(email: str):
    # Delete profile
    supabase.table("profiles").delete().eq("email", email).execute()
    # Delete conversations
    supabase.table("conversations").delete().eq("user_email", email).execute()
    return {"message": "Account deleted successfully"}
