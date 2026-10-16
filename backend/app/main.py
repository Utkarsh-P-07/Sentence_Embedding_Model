import os
# Use cached model; skip HuggingFace Hub network checks after first download
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.embedding_model import embedding_model
from app.routers import embed, similarity, search, model_info, health
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    embedding_model.load()
    yield
    # Cleanup on shutdown (no-op for this model)


app = FastAPI(
    title="Sentence Embedding API",
    description="API for sentence embeddings, semantic similarity, and semantic search using Sentence-BERT.",
    version=settings.MODEL_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(model_info.router, tags=["Model"])
app.include_router(embed.router, tags=["Embeddings"])
app.include_router(similarity.router, tags=["Similarity"])
app.include_router(search.router, tags=["Search"])
