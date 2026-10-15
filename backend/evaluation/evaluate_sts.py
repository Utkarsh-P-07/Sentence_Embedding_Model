"""
Evaluate the Sentence Embedding Model on the STS Benchmark.

Usage:
    cd backend
    python -m evaluation.evaluate_sts

Outputs:
    Spearman correlation printed to stdout
    Results saved to evaluation/results/sts_results.json
"""

import json
import os
import sys
from pathlib import Path

import numpy as np
from scipy.stats import spearmanr

# Add backend root to path so config and app are importable
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.models.embedding_model import embedding_model
from config import settings


def cosine_similarity_np(v1: np.ndarray, v2: np.ndarray) -> float:
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return float(np.dot(v1, v2) / (norm1 * norm2))


def load_sts_benchmark():
    """Load STS Benchmark test split from HuggingFace datasets."""
    try:
        from datasets import load_dataset
        # Try primary source
        dataset = load_dataset("mteb/stsbenchmark-sts", split="test")
        sentences1 = dataset["sentence1"]
        sentences2 = dataset["sentence2"]
        scores = [float(s) / 5.0 for s in dataset["score"]]  # Normalize to [0, 1]
        return sentences1, sentences2, scores
    except Exception:
        # Fallback source
        from datasets import load_dataset
        dataset = load_dataset("stsb_multi_mt", name="en", split="test")
        sentences1 = dataset["sentence1"]
        sentences2 = dataset["sentence2"]
        scores = [float(s) / 5.0 for s in dataset["similarity_score"]]
        return sentences1, sentences2, scores


def evaluate():
    print(f"Loading model: {settings.MODEL_NAME}")
    embedding_model.load()

    print("Loading STS Benchmark test split...")
    sentences1, sentences2, gold_scores = load_sts_benchmark()
    print(f"Loaded {len(gold_scores)} sentence pairs.")

    print("Encoding sentence pairs...")
    all_sentences = list(sentences1) + list(sentences2)
    all_embeddings = embedding_model.encode_batch(all_sentences)
    n = len(sentences1)
    embeddings1 = all_embeddings[:n]
    embeddings2 = all_embeddings[n:]

    print("Computing cosine similarities...")
    model_scores = []
    for e1, e2 in zip(embeddings1, embeddings2):
        sim = cosine_similarity_np(np.array(e1), np.array(e2))
        model_scores.append(sim)

    # Spearman correlation
    correlation, p_value = spearmanr(gold_scores, model_scores)
    print(f"\nSTS Benchmark Results:")
    print(f"  Model: {settings.MODEL_NAME}")
    print(f"  Spearman Correlation: {correlation:.4f}")
    print(f"  P-value: {p_value:.6f}")
    print(f"  Num pairs: {len(gold_scores)}")

    # Save results
    results = {
        "model_name": settings.MODEL_NAME,
        "model_version": settings.MODEL_VERSION,
        "dataset": "STS Benchmark",
        "split": "test",
        "num_pairs": len(gold_scores),
        "spearman_correlation": round(correlation, 6),
        "p_value": round(p_value, 8),
        "metric": "cosine_similarity",
    }

    results_dir = Path(__file__).parent / "results"
    results_dir.mkdir(exist_ok=True)
    results_path = results_dir / "sts_results.json"
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {results_path}")
    return results


if __name__ == "__main__":
    evaluate()
