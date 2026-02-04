from fastapi import FastAPI
from app.routers import auth, profile, universities, content, counsellor

from fastapi.middleware.cors import CORSMiddleware

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI(title="AI Study Abroad Counsellor")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"Validation Error: {exc.errors()}")
    print(f"Body: {exc.body}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Study Abroad Counsellor API"}

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(universities.router)
app.include_router(content.router)
app.include_router(counsellor.router)
