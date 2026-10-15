import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export async function generateEmbedding(sentence) {
  const { data } = await client.post('/embed', { sentence })
  return data
}

export async function computeSimilarity(sentence1, sentence2) {
  const { data } = await client.post('/similarity', { sentence1, sentence2 })
  return data
}

export async function semanticSearch(query, candidates, topK = 5) {
  const { data } = await client.post('/search', { query, candidates, top_k: topK })
  return data
}

export async function getModelInfo() {
  const { data } = await client.get('/model-info')
  return data
}

export async function getHealth() {
  const { data } = await client.get('/health')
  return data
}

export default client
