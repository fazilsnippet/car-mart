// Step 1: Reciprocal Rank Fusion (RRF)
export const reciprocalRankFusion = ({
  semanticResults = [],
  bm25Results = [],
  k = 60,
}) => {

  // Step 2: Store fused scores
  const scores = new Map();

  // Step 3: Add semantic rankings
  semanticResults.forEach((id, index) => {
    const score = 1 / (k + index + 1);

    scores.set(id, (scores.get(id) || 0) + score);
  });

  // Step 4: Add BM25 rankings
  bm25Results.forEach((id, index) => {
    const score = 1 / (k + index + 1);

    scores.set(id, (scores.get(id) || 0) + score);
  });

  // Step 5: Sort by fused score
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
};