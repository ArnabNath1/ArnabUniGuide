from fastapi import APIRouter

router = APIRouter(prefix="/universities", tags=["universities"])

@router.get("/search")
def search_universities(query: str):
    return {"message": f"Search universities with query: {query}"}
