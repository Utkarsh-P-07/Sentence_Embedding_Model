from pydantic import BaseModel


class EmbedRequest(BaseModel):
    sentence: str


class EmbedResponse(BaseModel):
    embedding: list[float]
    model: str
    version: str
    dimension: int


class SimilarityRequest(BaseModel):
    sentence1: str
    sentence2: str


class SimilarityResponse(BaseModel):
    score: float
    interpretation: str
    model: str
    version: str


class SearchResult(BaseModel):
    sentence: str
    score: float
    rank: int


class SearchRequest(BaseModel):
    query: str
    candidates: list[str]
    top_k: int = 5


class SearchResponse(BaseModel):
    results: list[SearchResult]
    model: str
    version: str


class ModelInfoResponse(BaseModel):
    model_name: str
    version: str
    embedding_dim: int
    max_seq_length: int
    description: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str


def get_interpretation(score: float) -> str:
    """Derive a human-readable interpretation from a cosine similarity score."""
    if score >= 0.8:
        return "Very similar"
    elif score >= 0.6:
        return "Moderately similar"
    elif score >= 0.4:
        return "Somewhat similar"
    else:
        return "Not similar"
