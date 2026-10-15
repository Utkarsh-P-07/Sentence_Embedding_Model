from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import MODEL_NAME, VERSION, EMBEDDING_DIM, MAX_SEQ_LENGTH
from model import get_model, encode_sentence, compute_similarity, semantic_search
from schemas import (
    EmbedRequest,
    EmbedResponse,
    SimilarityRequest,
    SimilarityResponse,
    SearchRequest,
    SearchResponse,
    SearchResult,
    ModelInfoResponse,
    HealthResponse,
    get_interpretation,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-load the model on startup so the first request isn't slow
    get_model()
    yield


app = FastAPI(title="Sentence Embedding API", version=VERSION, lifespan=lifespan)

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/embed", response_model=EmbedResponse)
def embed(request: EmbedRequest) -> EmbedResponse:
    """Generate a sentence embedding for the provided text."""
    embedding = encode_sentence(request.sentence)
    return EmbedResponse(
        embedding=embedding,
        model=MODEL_NAME,
        version=VERSION,
        dimension=len(embedding),
    )


@app.post("/similarity", response_model=SimilarityResponse)
def similarity(request: SimilarityRequest) -> SimilarityResponse:
    """Compute cosine similarity between two sentences."""
    score = compute_similarity(request.sentence1, request.sentence2)
    interpretation = get_interpretation(score)
    return SimilarityResponse(
        score=score,
        interpretation=interpretation,
        model=MODEL_NAME,
        version=VERSION,
    )


@app.post("/search", response_model=SearchResponse)
def search(request: SearchRequest) -> SearchResponse:
    """Perform semantic search over a list of candidate sentences."""
    raw_results = semantic_search(request.query, request.candidates, request.top_k)
    results = [
        SearchResult(sentence=r["sentence"], score=r["score"], rank=r["rank"])
        for r in raw_results
    ]
    return SearchResponse(results=results, model=MODEL_NAME, version=VERSION)


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info() -> ModelInfoResponse:
    """Return metadata about the loaded model."""
    return ModelInfoResponse(
        model_name=MODEL_NAME,
        version=VERSION,
        embedding_dim=EMBEDDING_DIM,
        max_seq_length=MAX_SEQ_LENGTH,
        description="Sentence-BERT model for semantic similarity and search",
    )


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Health check endpoint."""
    from model import _model  # check if singleton is populated

    return HealthResponse(
        status="ok",
        model_loaded=_model is not None,
        model_name=MODEL_NAME,
    )
