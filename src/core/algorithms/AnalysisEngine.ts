// src/core/algorithms/AnalysisEngine.ts
export type AnalysisInputs = {
  username_entropy: number;
  image_similarity: number; // 0-100
  posting_burst: boolean;
  network_score: number; // 0..1
};

export function computeSuspicionScore(inputs: AnalysisInputs): number {
  let score = 0;
  score += Math.min(3, inputs.username_entropy / 3); // up to 3
  if (inputs.image_similarity >= 80) score += 3;
  else if (inputs.image_similarity >= 60) score += 2;
  else if (inputs.image_similarity >= 40) score += 1;
  if (inputs.posting_burst) score += 2.5;
  score += inputs.network_score * 2.5; // up to 2.5
  return parseFloat(score.toFixed(2));
}

export function getSuspicionLevelFromScore(score: number): 'low' | 'medium' | 'high' {
  if (score >= 6.5) return 'high';
  if (score >= 3.5) return 'medium';
  return 'low';
}
