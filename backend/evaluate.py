import json
import os

from datasets import load_dataset
from scipy.stats import spearmanr

from model import compute_similarity
from config import MODEL_NAME


def run_evaluation() -> dict:
    """
    Evaluate the model on the STS Benchmark (test split).

    Human scores are in the range 0-5 and are normalized to 0-1.
    Spearman correlation is computed between model cosine similarities
    and the normalized human scores.
    """
    print("Loading STS Benchmark dataset...")
    dataset = load_dataset("sentence-transformers/stsb")
    test_split = dataset["test"]

    model_scores = []
    human_scores = []

    total = len(test_split)
    print(f"Evaluating {total} sentence pairs...")

    for i, example in enumerate(test_split):
        sentence1 = example["sentence1"]
        sentence2 = example["sentence2"]
        human_score = example["score"] / 5.0  # normalize 0-5 → 0-1

        cos_sim = compute_similarity(sentence1, sentence2)

        model_scores.append(cos_sim)
        human_scores.append(human_score)

        if (i + 1) % 100 == 0:
            print(f"  Processed {i + 1}/{total} pairs...")

    correlation, p_value = spearmanr(human_scores, model_scores)

    results = {
        "spearman_correlation": float(correlation),
        "num_pairs": total,
        "model_name": MODEL_NAME,
        "dataset": "stsb",
        "split": "test",
        "evaluated": True,
    }

    print(f"\nResults:")
    print(f"  Model        : {MODEL_NAME}")
    print(f"  Dataset      : stsb (test)")
    print(f"  Pairs        : {total}")
    print(f"  Spearman r   : {correlation:.4f}")
    print(f"  p-value      : {p_value:.4e}")

    return results


if __name__ == "__main__":
    results = run_evaluation()

    output_path = os.path.join(os.path.dirname(__file__), "evaluation_results.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"\nResults saved to {output_path}")
