from fastapi import APIRouter, HTTPException
from app.models.embedding_model import embedding_model
from app.schemas.requests import EmbedRequest
from config import settings

router = APIRouter()


@router.post("/embed")
async def generate_embedding(request: EmbedRequest):
    try:
        embedding = embedding_model.encode(request.sentence)
        return {
            "embedding": embedding,
            "model_name": settings.MODEL_NAME,
            "model_version": settings.MODEL_VERSION,
            "dimensions": len(embedding),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
