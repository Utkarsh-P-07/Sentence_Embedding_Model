from fastapi import APIRouter, HTTPException
from app.models.embedding_model import embedding_model
from app.schemas.requests import SearchRequest
from app.utils.similarity_utils import rank_by_similarity
from config import settings

router = APIRouter()


@router.post("/search")
async def semantic_search(request: SearchRequest):
    try:
        query_emb = embedding_model.encode(request.query)
        candidate_embs = embedding_model.encode_batch(request.candidates)
        ranked = rank_by_similarity(query_emb, candidate_embs, request.candidates)
        top_results = ranked[: request.top_k]
        return {
            "query": request.query,
            "results": top_results,
            "model_name": settings.MODEL_NAME,
            "model_version": settings.MODEL_VERSION,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
