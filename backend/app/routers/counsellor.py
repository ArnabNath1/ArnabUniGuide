from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai import get_counsellor_response, get_application_guidance
from app.services.supabase_client import supabase

router = APIRouter(prefix="/counsellor", tags=["counsellor"])

class ChatRequest(BaseModel):
    user_email: str
    user_profile: str
    message: str
    session_id: Optional[str] = None

class GuidanceRequest(BaseModel):
    universities: List[str]
    country: str

@router.get("/sessions/{email}")
def get_sessions(email: str):
    try:
        response = supabase.table("conversations").select("id, title, created_at").eq("user_email", email).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching sessions: {e}")
        return []

@router.get("/session/{email}/{session_id}")
def get_session_history(email: str, session_id: str):
    try:
        # Secure fetch: must match both ID and user_email
        response = supabase.table("conversations").select("*").eq("id", session_id).eq("user_email", email).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Session not found or unauthorized")
        return response.data[0]
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error fetching session content: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve chat history")

@router.post("/chat")
def chat_with_counsellor(request: ChatRequest):
    try:
        history = []
        session_id = request.session_id
        
        if session_id:
            # Fetch existing history - Securely verify ownership
            res = supabase.table("conversations").select("messages").eq("id", session_id).eq("user_email", request.user_email).execute()
            if res.data:
                history = res.data[0].get("messages", [])
        
        # Get AI response
        # Profile context is added inside get_counsellor_response
        ai_response = get_counsellor_response(request.user_profile, request.message, history)
        
        # Prepare new messages list
        new_messages = history + [
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": ai_response}
        ]
        
        if session_id:
            # Update existing session - Securely verify ownership
            # We match by ID and user_email to prevent cross-account editing
            supabase.table("conversations").update({"messages": new_messages}).eq("id", session_id).eq("user_email", request.user_email).execute()
        else:
            # Create new session
            # Use first message as title
            title = request.message[:40] + ("..." if len(request.message) > 40 else "")
            res = supabase.table("conversations").insert({
                "user_email": request.user_email,
                "title": title,
                "messages": new_messages
            }).execute()
            if res.data:
                session_id = res.data[0]["id"]
            
        return {"response": ai_response, "session_id": session_id}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/guidance")
def application_guidance(request: GuidanceRequest):
    try:
        response = get_application_guidance(request.universities, request.country)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to generate guidance")
