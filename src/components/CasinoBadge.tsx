const CASINO_COLORS: Record<string, string> = {
  Stake: '#0d6efd',
  Rollbit: '#f7931a',
  Roobet: '#ffcc00',
  Duelbits: '#8b5cf6',
  PackRush: '#ed4245',
  Shuffle: '#10b981',
}

interface CasinoBadgeProps {
  casino: string | null
}

export default function CasinoBadge({ casino }: CasinoBadgeProps) {
  if (!casino) {
    return (
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>--</span>
    )
  }

  const color = CASINO_COLORS[casino] || 'var(--accent-blue)'

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {casino}
    </span>
  )
}
