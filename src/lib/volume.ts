export function estimateVolume(rank: number | null, avgViewers: number): string {
  if (rank && rank <= 10) return '$1M+'
  if (rank && rank <= 50) return '$250K+'
  if (rank && rank <= 200) return '$50K+'
  if (!rank && avgViewers >= 1000) return '$10K+'
  return '--'
}
