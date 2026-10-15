# Sentence Embedding Model

A full-stack application for sentence embeddings, semantic similarity, and semantic search powered by Sentence-BERT (`all-MiniLM-L6-v2`).

## Tech Stack

- **Model**: all-MiniLM-L6-v2 (Sentence-BERT via HuggingFace `sentence-transformers`)
- **Backend**: Python 3.11 + FastAPI + Uvicorn
- **Frontend**: React + Vite + Tailwind CSS + Axios
- **Evaluation**: STS Benchmark + Spearman correlation

## Project Structure

```
Sentence_Embedding_Model/
├── backend/           # FastAPI backend
│   ├── app/           # Application code
│   ├── evaluation/    # STS Benchmark evaluation
│   ├── config.py      # App configuration
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/          # React frontend
│   └── src/
│       ├── components/
│       └── api/
├── docs/              # Documentation
└── README.md
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000
Swagger docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

### Docker (Backend only)

```bash
cd backend
docker build -t sentence-embedding-api .
docker run -p 8000:8000 sentence-embedding-api
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /model-info | Model metadata |
| POST | /embed | Generate sentence embedding |
| POST | /similarity | Compute cosine similarity |
| POST | /search | Semantic search over candidates |

See `docs/api_reference.md` for full details.

## Evaluation

Run STS Benchmark evaluation:

```bash
cd backend
python -m evaluation.evaluate_sts
```

Results are saved to `backend/evaluation/results/sts_results.json`.
Expected Spearman correlation: ~0.88

## Features

- **Embedding Generation**: Convert any sentence to a 384-dimensional dense vector
- **Semantic Similarity**: Compare two sentences and get a cosine similarity score (0–1)
- **Semantic Search**: Rank a list of candidate sentences by relevance to a query
- **Evaluation Dashboard**: View model performance on STS Benchmark
- **Model Card**: Full model documentation

<!-- scaffold verified -->
