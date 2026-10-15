from __future__ import annotations

import numpy as np
from typing import List


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    a = np.array(v1, dtype=np.float32)
    b = np.array(v2, dtype=np.float32)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def rank_by_similarity(
    query_emb: list[float],
    candidate_embs: list[list[float]],
    candidates: list[str],
) -> List[dict]:
    """Rank candidates by cosine similarity to the query embedding."""
    scored = []
    for i, (cand_emb, cand_text) in enumerate(zip(candidate_embs, candidates)):
        score = cosine_similarity(query_emb, cand_emb)
        scored.append({"sentence": cand_text, "score": round(score, 6), "rank": 0})

    # Sort descending by score
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Assign ranks
    for rank, item in enumerate(scored, start=1):
        item["rank"] = rank

    return scored
