from fastapi import APIRouter, HTTPException
from app.models.embedding_model import embedding_model
from app.schemas.requests import SimilarityRequest
from config import settings

router = APIRouter()


@router.post("/similarity")
async def compute_similarity(request: SimilarityRequest):
    try:
        emb1 = embedding_model.encode(request.sentence1)
        emb2 = embedding_model.encode(request.sentence2)
        score = embedding_model.cosine_similarity(emb1, emb2)
        return {
            "similarity_score": round(score, 6),
            "sentence1": request.sentence1,
            "sentence2": request.sentence2,
            "model_name": settings.MODEL_NAME,
            "model_version": settings.MODEL_VERSION,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
