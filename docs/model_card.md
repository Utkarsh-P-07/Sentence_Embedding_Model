# Model Card: all-MiniLM-L6-v2

## Overview

**all-MiniLM-L6-v2** is a sentence-transformers model fine-tuned from Microsoft's MiniLM architecture on over 1 billion sentence pairs. It maps sentences and short paragraphs to a dense 384-dimensional vector space.

## Model Details

| Property | Value |
|---|---|
| Model Type | Sentence Transformer |
| Base Architecture | MiniLM-L6-H384 |
| Output Dimensions | 384 |
| Max Sequence Length | 256 tokens |
| Pooling | Mean pooling |
| Normalization | L2-normalized |
| Parameters | ~22M |
| Model Size | ~80MB |

## Intended Use

- Semantic textual similarity
- Semantic search / information retrieval
- Clustering and classification
- Recommendation systems

## Training

Fine-tuned on 1B+ sentence pairs using Multiple Negatives Ranking Loss and a contrastive learning objective.

## Evaluation

| Benchmark | Metric | Score |
|---|---|---|
| STS Benchmark | Spearman ρ | 0.8829 |
| STS12 | Spearman ρ | 0.7538 |
| STS13 | Spearman ρ | 0.8356 |
| STS14 | Spearman ρ | 0.8051 |

## Limitations

- 256-token max; longer inputs are truncated.
- Primarily English; multilingual quality is lower.
- May reproduce biases from training data.

## Citation

```bibtex
@inproceedings{reimers-2019-sentence-bert,
  title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
  author = "Reimers, Nils and Gurevych, Iryna",
  booktitle = "Proceedings of EMNLP 2019",
  year = "2019",
  url = "https://arxiv.org/abs/1908.10084"
}
```
