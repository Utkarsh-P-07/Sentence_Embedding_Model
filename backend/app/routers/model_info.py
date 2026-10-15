from fastapi import APIRouter
from config import settings

router = APIRouter()


@router.get("/model-info")
async def get_model_info():
    return {
        "model_name": settings.MODEL_NAME,
        "model_version": settings.MODEL_VERSION,
        "dimensions": 384,
        "max_sequence_length": 256,
        "description": (
            "all-MiniLM-L6-v2 is a sentence-transformers model fine-tuned on "
            "a large dataset of over 1 billion sentence pairs. It maps sentences "
            "and paragraphs to a 384-dimensional dense vector space for tasks like "
            "clustering and semantic search."
        ),
        "pooling": "mean",
        "similarity_metric": "cosine",
    }
