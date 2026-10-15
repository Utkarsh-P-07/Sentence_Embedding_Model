from fastapi import APIRouter
from app.models.embedding_model import embedding_model
from config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model_loaded": embedding_model.is_loaded,
        "model_name": settings.MODEL_NAME,
    }
