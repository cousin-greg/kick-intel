/**
 * Format an estimated monthly wager volume for display.
 * Uses actual estimatedVolume from DB when available.
 */
export function formatVolume(estimatedVolume: number | null): string {
  if (estimatedVolume === null || estimatedVolume === undefined) return '--'
  if (estimatedVolume >= 1000000) {
    const m = estimatedVolume / 1000000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M/mo`
  }
  if (estimatedVolume >= 1000) {
    const k = estimatedVolume / 1000
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)}K/mo`
  }
  return `$${estimatedVolume}/mo`
}

/**
 * Rank-based volume estimation (for backwards compat / fallback).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function estimateVolume(rank: number | null, avgViewers: number): string {
  if (rank === null || rank === undefined) return '--'
  if (rank === 1) return '$7.5M/mo'
  if (rank <= 3) return '$4M/mo'
  if (rank <= 10) return '$2M/mo'
  if (rank <= 25) return '$750K/mo'
  if (rank <= 50) return '$350K/mo'
  if (rank <= 100) return '$125K/mo'
  return '$30K/mo'
}

/**
 * Get numeric volume from rank (for sorting).
 */
export function volumeFromRank(rank: number | null): number | null {
  if (rank === null || rank === undefined) return null
  if (rank === 1) return 7500000
  if (rank <= 3) return 4000000
  if (rank <= 10) return 2000000
  if (rank <= 25) return 750000
  if (rank <= 50) return 350000
  if (rank <= 100) return 125000
  return 30000
}
