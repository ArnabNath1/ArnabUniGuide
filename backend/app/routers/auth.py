from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login():
    return {"message": "Login endpoint"}

@router.post("/signup")
def signup():
    return {"message": "Signup endpoint"}
