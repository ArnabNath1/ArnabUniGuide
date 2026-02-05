import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/universities", tags=["universities"])

@router.get("/search")
async def search_universities(query: str):
    try:
        async with httpx.AsyncClient() as client:
            # Using HTTP since hipolabs primarily supports it
            response = await client.get(f"http://universities.hipolabs.com/search?name={query}")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error proxying university search: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch universities from remote API")
