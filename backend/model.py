from sentence_transformers import SentenceTransformer, util
from config import MODEL_NAME

# Module-level singleton cache
_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    """Return the loaded SentenceTransformer model, loading it on first call."""
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def encode_sentence(text: str) -> list[float]:
    """Encode a single sentence and return the embedding as a Python list of floats."""
    model = get_model()
    embedding = model.encode(text, convert_to_tensor=False)
    return embedding.tolist()


def compute_similarity(text1: str, text2: str) -> float:
    """Compute cosine similarity between two sentences, returning a float."""
    model = get_model()
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)
    similarity = util.cos_sim(emb1, emb2)
    return float(similarity.item())


def semantic_search(query: str, candidates: list[str], top_k: int = 5) -> list[dict]:
    """
    Perform semantic search over candidates for the given query.

    Returns a list of dicts with keys 'sentence', 'score', and 'rank',
    sorted by score in descending order.
    """
    model = get_model()
    query_embedding = model.encode(query, convert_to_tensor=True)
    candidate_embeddings = model.encode(candidates, convert_to_tensor=True)

    scores = util.cos_sim(query_embedding, candidate_embeddings)[0]

    # Build scored pairs and sort
    scored = [
        {"sentence": candidates[i], "score": float(scores[i].item())}
        for i in range(len(candidates))
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Take top_k results and assign ranks
    results = []
    for rank, item in enumerate(scored[:top_k], start=1):
        results.append(
            {
                "sentence": item["sentence"],
                "score": item["score"],
                "rank": rank,
            }
        )
    return results
