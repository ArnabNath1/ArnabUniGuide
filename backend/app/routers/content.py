from fastapi import APIRouter, Query
from app.services.ai import search_scholarships_ai

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/scholarships")
def search_scholarships(query: str = Query(..., min_length=1)):
    try:
        results = search_scholarships_ai(query)
        return {"scholarships": results}
    except Exception as e:
        return {"error": str(e), "scholarships": []}
