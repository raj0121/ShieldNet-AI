// src/core/algorithms/ThreatAnalysis.ts
export function calculateUsernameEntropy(username: string): number {
  if (!username) return 0;
  const freq: Record<string, number> = {};
  for (const ch of username) freq[ch] = (freq[ch] || 0) + 1;
  const len = username.length;
  let entropy = 0;
  for (const k in freq) {
    const p = freq[k] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat((entropy * 1.7).toFixed(2));
}

export function detectPostingBurst(timestamps: string[], windowMinutes = 10, threshold = 10): boolean {
  if (!timestamps || timestamps.length === 0) return false;
  const msWindow = windowMinutes * 60 * 1000;
  const now = new Date(timestamps[0]).getTime();
  const count = timestamps.filter(ts => (now - new Date(ts).getTime()) <= msWindow).length;
  return count >= threshold;
}

export function simulateImageSimilarity(imagePhash: string | null): number {
  if (!imagePhash) return 0;
  let s = 0;
  for (let i = 0; i < imagePhash.length; i++) s += imagePhash.charCodeAt(i);
  return Math.min(95, Math.abs(s) % 100);
}

export function computeNetworkScore(metadata: any): number {
  if (!metadata) return 0;
  const followers = metadata.followers || 0;
  const following = metadata.following || 0;
  if (followers === 0 && following > 50) return 0.9;
  if (following > 500 && followers < 50) return 0.8;
  if (metadata.co_follow_cluster_size && metadata.co_follow_cluster_size > 5) {
    return Math.min(1, 0.5 + metadata.co_follow_cluster_size / 20);
  }
  return 0;
}

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