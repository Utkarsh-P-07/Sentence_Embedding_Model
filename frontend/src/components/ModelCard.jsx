import React from 'react'

const sections = [
  {
    title: 'Overview',
    content: (
      <p>
        <strong>all-MiniLM-L6-v2</strong> is a sentence-transformers model fine-tuned from
        Microsoft&apos;s MiniLM architecture on over 1 billion sentence pairs. It maps sentences
        and short paragraphs to a dense 384-dimensional vector space, enabling high-quality
        semantic similarity computations at low inference cost.
      </p>
    ),
  },
  {
    title: 'Intended Use',
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Semantic textual similarity scoring</li>
        <li>Information retrieval and semantic search</li>
        <li>Sentence clustering and topic modeling</li>
        <li>Cross-sentence textual entailment</li>
        <li>Recommendation systems based on text content</li>
      </ul>
    ),
  },
  {
    title: 'Training Details',
    content: (
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {[
          ['Base Model', 'microsoft/MiniLM-L6-H384-uncased'],
          ['Training Data', '1B+ sentence pairs'],
          ['Training Loss', 'Multiple Negatives Ranking Loss'],
          ['Pooling', 'Mean pooling over token embeddings'],
          ['Normalization', 'L2-normalized output'],
          ['Output Dimension', '384'],
          ['Max Sequence Length', '256 tokens'],
          ['Framework', 'sentence-transformers (HuggingFace)'],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-gray-100 pb-2">
            <dt className="text-gray-500 text-xs">{k}</dt>
            <dd className="font-medium text-gray-800">{v}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    title: 'Evaluation',
    content: (
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 rounded-tl">Benchmark</th>
            <th className="text-left p-2">Metric</th>
            <th className="text-left p-2 rounded-tr">Score</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['STS Benchmark', 'Spearman ρ', '0.8829'],
            ['STS12', 'Spearman ρ', '0.7538'],
            ['STS13', 'Spearman ρ', '0.8356'],
            ['STS14', 'Spearman ρ', '0.8051'],
          ].map(([bench, metric, score]) => (
            <tr key={bench} className="border-b border-gray-100">
              <td className="p-2">{bench}</td>
              <td className="p-2 text-gray-500">{metric}</td>
              <td className="p-2 font-semibold text-indigo-700">{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Max input length of 256 tokens; longer text is truncated.</li>
        <li>Primarily trained on English text; multilingual performance is degraded.</li>
        <li>May reproduce biases present in training data.</li>
        <li>Not suitable for tasks requiring deep factual reasoning.</li>
      </ul>
    ),
  },
  {
    title: 'Known Constraints',
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Model weights are ~80MB (downloaded on first use).</li>
        <li>GPU recommended for batches larger than 128 sentences.</li>
        <li>Cosine similarity is bounded to [–1, 1]; normalized embeddings keep it in [0, 1] for positive sentences.</li>
      </ul>
    ),
  },
  {
    title: 'Citation',
    content: (
      <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">{`@inproceedings{reimers-2019-sentence-bert,
  title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
  author = "Reimers, Nils and Gurevych, Iryna",
  booktitle = "Proceedings of EMNLP 2019",
  year = "2019",
  url = "https://arxiv.org/abs/1908.10084"
}`}</pre>
    ),
  },
]

export default function ModelCard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Model Card</h1>
      <p className="text-gray-500 mb-6">all-MiniLM-L6-v2 — Sentence-BERT</p>
      <div className="space-y-6">
        {sections.map(({ title, content }) => (
          <div key={title} className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
            <div className="text-sm text-gray-700 leading-relaxed">{content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
