from pydantic import BaseModel, Field
from typing import List


class EmbedRequest(BaseModel):
    sentence: str = Field(..., min_length=1, description="The sentence to embed.")


class SimilarityRequest(BaseModel):
    sentence1: str = Field(..., min_length=1, description="First sentence.")
    sentence2: str = Field(..., min_length=1, description="Second sentence.")


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The search query.")
    candidates: List[str] = Field(..., min_length=1, description="List of candidate sentences.")
    top_k: int = Field(5, ge=1, le=100, description="Number of top results to return.")
