interface StatusBadgeProps {
  isLive: boolean
  lastSeenAt: Date | null
}

function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins > 0) return `${diffMins}m ago`
  return 'just now'
}

export default function StatusBadge({ isLive, lastSeenAt }: StatusBadgeProps) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--green-live)' }}
        />
        <span style={{ color: 'var(--green-live)' }}>LIVE</span>
      </span>
    )
  }

  if (lastSeenAt) {
    return (
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {timeAgo(new Date(lastSeenAt))}
      </span>
    )
  }

  return (
    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>--</span>
  )
}
