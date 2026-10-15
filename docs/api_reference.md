# API Reference

Base URL: `http://localhost:8000`

---

## GET /health

Health check.

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_name": "all-MiniLM-L6-v2"
}
```

---

## GET /model-info

Model metadata.

**Response:**
```json
{
  "model_name": "all-MiniLM-L6-v2",
  "model_version": "1.0.0",
  "dimensions": 384,
  "max_sequence_length": 256,
  "description": "...",
  "pooling": "mean",
  "similarity_metric": "cosine"
}
```

---

## POST /embed

Generate a sentence embedding.

**Request:**
```json
{ "sentence": "The quick brown fox" }
```

**Response:**
```json
{
  "embedding": [0.0123, -0.0456, "..."],
  "model_name": "all-MiniLM-L6-v2",
  "model_version": "1.0.0",
  "dimensions": 384
}
```

---

## POST /similarity

Compute cosine similarity between two sentences.

**Request:**
```json
{
  "sentence1": "I love machine learning",
  "sentence2": "Deep learning is fascinating"
}
```

**Response:**
```json
{
  "similarity_score": 0.763412,
  "sentence1": "I love machine learning",
  "sentence2": "Deep learning is fascinating",
  "model_name": "all-MiniLM-L6-v2",
  "model_version": "1.0.0"
}
```

---

## POST /search

Rank candidates by semantic similarity to a query.

**Request:**
```json
{
  "query": "How do neural networks work?",
  "candidates": [
    "Neural networks are inspired by the brain.",
    "The weather is sunny today.",
    "Deep learning uses multiple layers."
  ],
  "top_k": 2
}
```

**Response:**
```json
{
  "query": "How do neural networks work?",
  "results": [
    {"sentence": "Neural networks are inspired by the brain.", "score": 0.874123, "rank": 1},
    {"sentence": "Deep learning uses multiple layers.", "score": 0.812456, "rank": 2}
  ],
  "model_name": "all-MiniLM-L6-v2",
  "model_version": "1.0.0"
}
```
