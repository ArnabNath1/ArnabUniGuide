from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthRequest(BaseModel):
    email: str
    name: Optional[str] = None

@router.post("/check-email")
def check_email(request: AuthRequest):
    response = supabase.table("profiles").select("email").eq("email", request.email).execute()
    if response.data:
        return {"exists": True}
    return {"exists": False}

@router.post("/signup")
def signup(request: AuthRequest):
    # Check if email exists
    response = supabase.table("profiles").select("email").eq("email", request.email).execute()
    if response.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "Email available"}

@router.post("/login")
def login(request: AuthRequest):
    # Check if exists
    response = supabase.table("profiles").select("email").eq("email", request.email).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Email not found. Please sign up.")
    return {"message": "Login successful"}
